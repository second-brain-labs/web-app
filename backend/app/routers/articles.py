import json
import os
import random
import re
import shutil

import PyPDF2
import requests
import yake
from app.db import VESPA_URL, get_db, get_static_file_path, query_engine
from app.models import ArticleModel, DirectoryModel
from app.schemas.articles import (
    ArticleContentSchema,
    ArticleCreateHTMLSchema,
    ArticleCreatePDFSchema,
    ArticleSchema,
    DirectoryArticlesAndSubdirectoriesSchema,
    DirectoryCreateSchema,
    DirectoryInfoSchema,
)
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/articles")


@router.get("/")
async def article_info():
    return {"msg": "Article API"}


@router.get("/user/{user_uuid}", response_model=list[ArticleSchema])
async def get_articles(user_uuid: str, db=Depends(get_db)):
    articles: list[ArticleModel] = (
        db.query(ArticleModel).filter(ArticleModel.user_uuid == user_uuid).all()
    )
    return articles


@router.get("/article/{article_id}", response_model=ArticleSchema)
async def get_article(article_id: int, db=Depends(get_db)):
    article: ArticleModel = (
        db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    )
    if article is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Article not found"
        )
    return article


@router.get("/article/{article_id}/content", response_model=ArticleContentSchema)
async def get_article_content(article_id: int, db=Depends(get_db)):
    article: ArticleModel = (
        db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    )
    if article is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Article not found"
        )

    return article


@router.get("/directory/articles", response_model=list[ArticleSchema])
async def get_articles_by_directory(name: str, user_uuid: str, db=Depends(get_db)):
    articles: list[ArticleModel] = (
        db.query(ArticleModel)
        .filter(
            ArticleModel.directory_name == name, ArticleModel.user_uuid == user_uuid
        )
        .all()
    )
    return articles


@router.get("/smart_folder/articles", response_model=list[ArticleSchema])
async def get_articles_by_smart_folders(name: str, user_uuid: str, db=Depends(get_db)):
    articles: list[ArticleModel] = (
        db.query(ArticleModel)
        .filter(ArticleModel.smart_folder == name, ArticleModel.user_uuid == user_uuid)
        .all()
    )
    return articles


# since the smart folders are only one layer deep, we can just get all unique and add to a list then
# frontend just has to to extra processing, but whatever
@router.get("/smart_folder/all", response_model=list[str])
async def get_smart_folders(user_uuid: str, db=Depends(get_db)):
    articles: list[str] = (
        db.query(ArticleModel.smart_folder)
        .filter(ArticleModel.user_uuid == user_uuid)
        .distinct()
        .all()
    )
    return [row[0] for row in articles]


@router.get("/directory/all", response_model=DirectoryArticlesAndSubdirectoriesSchema)
async def get_articles_and_folders(name: str, user_uuid: str, db=Depends(get_db)):
    # instantiate root if it doesn't exist
    root_directory: DirectoryModel = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.name == "/",
            DirectoryModel.user_uuid == user_uuid,
        )
        .first()
    )
    if root_directory is None:
        root_directory = DirectoryModel(
            name="/", user_uuid=user_uuid, parent_directory=None
        )
        db.add(root_directory)
        db.commit()
        db.refresh(root_directory)

    directory = (
        db.query(DirectoryModel)
        .filter(DirectoryModel.name == name, DirectoryModel.user_uuid == user_uuid)
        .first()
    )
    if directory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Directory not found"
        )
    subdirs: list[DirectoryModel] = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.parent_directory == directory.id,
        )
        .all()
    )
    articles: list[ArticleModel] = (
        db.query(ArticleModel).filter(ArticleModel.directory == directory.id).all()
    )
    return DirectoryArticlesAndSubdirectoriesSchema(
        articles=articles, subdirectories=subdirs
    )


def _get_parent_directory(directory: str):
    tree = directory.split("/")
    if len(tree) == 1:
        return "/"

    return "/".join(tree[:-1])


@router.post("/directory/create", response_model=DirectoryInfoSchema)
async def create_directory(directory: DirectoryCreateSchema, db=Depends(get_db)):
    """
    Create a directory a/b/c/d
    """
    # check if directory exists
    existing_directory: DirectoryModel = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.name == directory.name,
            DirectoryModel.user_uuid == directory.user_uuid,
        )
        .first()
    )
    if existing_directory:
        return existing_directory
    if directory.name == "/":
        directory = DirectoryModel(name=directory.name, user_uuid=directory.user_uuid)
    else:
        parent_dir = _get_parent_directory(directory.name)
        parent_directory: DirectoryModel = (
            db.query(DirectoryModel)
            .filter(
                DirectoryModel.name == parent_dir,
                DirectoryModel.user_uuid == directory.user_uuid,
            )
            .first()
        )
        if parent_directory is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent directory not found",
            )
            # parent_directory = "/"
        directory = DirectoryModel(
            name=directory.name,
            user_uuid=directory.user_uuid,
            parent_directory=parent_dir,
        )

    db.add(directory)
    db.commit()
    db.refresh(directory)
    return directory


@router.get("/directory/all-recursive", response_model=list[DirectoryInfoSchema])
async def get_all_directories(user_uuid: str, db=Depends(get_db)):
    directories: list[DirectoryModel] = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.user_uuid == user_uuid,
        )
        .all()
    )
    directories.sort(key=lambda x: x.name)
    return directories


def preprocess_text(text):
    if len(text) > 1000:
        text = " ".join(text.split())

        text = re.sub(r"[^\x00-\x7F]+", " ", text)  # Remove non-ASCII characters
        text = re.sub(
            r"[\r|\n|\r\n]+", " ", text
        )  # Replace newline characters with space
        text = re.sub(" +", " ", text)  # Replace multiple spaces with a single space
        text = re.sub(
            r"http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",
            "",
            text,
        )
        text = re.sub(r"[^A-Za-z0-9]+", " ", text)  # Remove special characters

        return text.strip()
    else:
        return text.strip().replace("\n", " ")


def generate_summary(title, text, max_length=40000):
    # Load model and tokenizer
    text = text[0:max_length]
    prompt = f"Summarize the following text in a concise manner. Try to stick to <500 words, but you can go over if needed. Be sure to include a short line at the top describing what this document reads like to you. This is a pdf file and its title is {title}"
    summary: str = query_engine.query(prompt + ": \n " + text)
    return summary


def extract_keywords(
    text,
    max_ngram_size=2,
    deduplication_thresold=0.9,
    deduplication_algo="seqm",
    windowSize=1,
    numOfKeywords=3,
):
    custom_kw_extractor = yake.KeywordExtractor(
        lan="en",
        n=max_ngram_size,
        dedupLim=deduplication_thresold,
        dedupFunc=deduplication_algo,
        windowsSize=windowSize,
        top=numOfKeywords,
        features=None,
    )
    keywords = custom_kw_extractor.extract_keywords(preprocess_text(text))
    sorted_extracted = sorted(keywords, key=lambda x: x[1], reverse=True)
    return sorted_extracted[0][0].title()


async def handle_article(
    db,
    title,
    user_uuid,
    directory,
    content,
    url=None,
    local_path=None,
    smart_folder="None",
):
    summary = generate_summary(title, content)
    if not summary:
        summary = "Summary could not be generated..."

    article = ArticleModel(
        title=title,
        user_uuid=user_uuid,
        directory=directory,
        summary=summary,
        content=content,
        url=url,
        local_path=local_path,
        smart_folder=smart_folder,
    )
    db.add(article)
    db.commit()
    db.refresh(article)

    return article


def transform_json_input(input_json):
    # Extract values from input JSON
    title = input_json.title
    directory = input_json.directory
    summary = input_json.summary
    url = input_json.url
    tag = extract_keywords(summary) if summary else ""

    # Construct the new JSON format
    transformed_json = {
        "fields": {
            "title": title,
            "content": input_json.content,  # Assuming you want to use 'summary' as 'content'
            "abstract": summary,  # Assuming 'summary' also goes into 'abstract'
            "url": url if url is not None else "",  # Example URL, adjust as needed
            "directory": directory,
            "tag": tag,
        }
    }

    return transformed_json


def feed_document_to_vespa(document, document_id, user_id, vespa_url=VESPA_URL):
    feed_url = (
        f"{vespa_url}/document/v1/articles/articles/group/{user_id}/{document_id}"
    )
    headers = {"Content-Type": "application/json"}

    response = requests.post(feed_url, headers=headers, json=document)

    if response.status_code in [200, 201]:
        return response.json()
    else:
        raise Exception(
            f"Feeding failed with status code {response.status_code}: {response.text}"
        )


@router.post("/article/create", response_model=ArticleContentSchema)
async def create_article(
    article: ArticleCreateHTMLSchema,
    db=Depends(get_db),
):
    directory = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.id == article.directory,
            DirectoryModel.user_uuid == article.user_uuid,
        )
        .first()
    )
    if directory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Directory not found"
        )

    article = await handle_article(
        db,
        article.title,
        article.user_uuid,
        directory.id,
        article.content,
        article.url,
        local_path="",
    )

    new_json = transform_json_input(article)
    document_id = f"{article.id}"
    feed_document_to_vespa(new_json, document_id, article.user_uuid)

    return article


def update_vespa_document(
    document_id, new_directory_value, user_id, vespa_url=VESPA_URL
):
    feed_url = (
        f"{vespa_url}/document/v1/articles/articles/group/{user_id}/{document_id}"
    )

    headers = {"Content-Type": "application/json"}

    document_update = {
        "update": "id:articles:articles::{document_id}",
        "fields": {"directory": {"assign": new_directory_value}},
    }

    response = requests.put(feed_url, headers=headers, data=json.dumps(document_update))

    if response.status_code in [200, 201]:
        return response.json()
    else:
        raise Exception(
            f"Feeding failed with status code {response.status_code}: {response.text}"
        )


@router.post(
    "/article/update/{article_id}/{directory_name}", response_model=DirectoryInfoSchema
)
async def update_directory(article_id: int, directory_name: str, db=Depends(get_db)):
    article: ArticleModel = (
        db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    )
    if article is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Article not found"
        )
    article.directory = directory_name
    db.commit()
    db.refresh(article)

    document_id = f"{article.id}"
    update_vespa_document(
        document_id,
        directory_name,
        article.user_uuid,
    )

    return article


def clean_string_for_sql(string):
    pattern = re.compile(
        r"[^\x20-\x7E]"
    )  # Matches any character outside the printable ASCII range
    cleaned_string = re.sub(pattern, "", string)
    return cleaned_string


@router.post("/article/upload", response_model=ArticleContentSchema)
async def upload_article(
    article: ArticleCreatePDFSchema = Depends(), db=Depends(get_db)
):
    directory = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.id == article.directory,
            DirectoryModel.user_uuid == article.user_uuid,
        )
        .first()
    )
    if directory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Directory not found"
        )
    static_file_path = get_static_file_path()
    user_articles_path = static_file_path / article.user_uuid
    user_articles_path.mkdir(parents=True, exist_ok=True)
    file_location = (
        static_file_path / article.user_uuid / f"{article.uploaded_file.filename}"
    )
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(article.uploaded_file.file, file_object)

    pdf_reader = PyPDF2.PdfReader(file_location)
    total_pages = len(pdf_reader.pages)
    text: str = ""
    for i in range(total_pages):
        page = pdf_reader.pages[i]
        text += page.extract_text().replace("\n", " ")
    article_content: str = clean_string_for_sql(text)

    article = await handle_article(
        db,
        article.title,
        article.user_uuid,
        directory.id,
        article_content,
        local_path=str(file_location.absolute()),
    )
    new_json = transform_json_input(article)
    document_id = f"{article.id}"
    feed_document_to_vespa(new_json, document_id, article.user_uuid)

    return article


def delete_article_from_vespa(document_id, user_id, vespa_url=VESPA_URL):
    feed_url = f"https://secondbrainlabs.xyz/vespa/document/v1/articles/articles/group/{user_id}/{document_id}"

    response = requests.delete(feed_url)

    if response.status_code in [200, 201]:
        return response.json()
    else:
        raise Exception(
            f"Feeding failed with status code {response.status_code}: {response.text}"
        )


@router.delete("/article/{article_id}")
async def delete_article(article_id: int, db=Depends(get_db)):
    article: ArticleModel = (
        db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    )
    if article is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Article not found"
        )
    delete_article_from_vespa(article.id, article.user_uuid)
    db.delete(article)
    db.commit()
    return {"msg": "Article deleted successfully!"}


@router.post("/article/smart_categorize")
async def smart_categorize_into_folders(
    raw_folder_names: str, user_uuid: str, db=Depends(get_db)
):
    # 1. parse the folder names and descriptions from the string
    # 2. form generalized vespa query
    # 3. for each folder, plug in folder name and description to query, then make a map of article_ids to relevance
    # 4. iterate through the articles from the maps and for each article, make its smart_folder attribute
    folder_names_with_descriptions = raw_folder_names.split("|")
    folder_names = [
        re.sub(r"\([^)]*\)", "", part).strip()
        for part in folder_names_with_descriptions
    ]
    folder_names_with_descriptions = [
        x.replace("(", "").replace(")", "") for x in folder_names_with_descriptions
    ]
    article_folder_mappings = {}

    queryUrl = f"{VESPA_URL}/search/"
    for i in range(len(folder_names_with_descriptions)):
        described_folder = folder_names_with_descriptions[i]
        params = {
            "streaming.groupname": user_uuid,
            "format": "json",
            "yql": "select * from articles where {targetHits:400}nearestNeighbor(embedding, q) or userQuery()",
            "hits": 400,
            "ranking.profile": "semantic",
            "timeout": "3s",
            "input.query(threshold)": 0.0,
            f"input.query(q)": f'embed(e5, "{described_folder}")',
        }
        response = requests.get(queryUrl, params=params)
        if response.ok:
            for article in response.json()["root"]["children"]:
                article_id = article["id"].split(":")[-1]
                if article_id not in article_folder_mappings:
                    article_folder_mappings[article_id] = {
                        "smart_folder": folder_names[i],
                        "relevance": article["relevance"],
                    }
                else:
                    if (
                        article["relevance"]
                        > article_folder_mappings[article_id]["relevance"]
                    ):
                        article_folder_mappings[article_id] = {
                            "smart_folder": folder_names[i],
                            "relevance": article["relevance"],
                        }

    errors = []
    for article_name in article_folder_mappings:
        article: ArticleModel = (
            db.query(ArticleModel).filter(ArticleModel.id == article_name).first()
        )
        if article is None:
            errors.append(
                f"Article with id {article_name} not found in the database. Skipping..."
            )
            continue
        article.smart_folder = article_folder_mappings[article_name]["smart_folder"]
        db.commit()
        db.refresh(article)

    folder_names: set[str] = set()
    for article_name in article_folder_mappings:
        folder_names.add(article_folder_mappings[article_name]["smart_folder"])
    folder_names_list: list[str] = list(folder_names)
    return {
        "msg": "Articles Assigned Smart Folders Successfully!",
        "folders": folder_names_list,
        "articles": article_folder_mappings,
        "response_json": response.json(),
        "errors": errors,
    }
