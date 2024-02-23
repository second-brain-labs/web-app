import os
import shutil
from app.db import get_db, VESPA_URL
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import ArticleModel, DirectoryModel
from app.schemas.articles import (
    ArticleSchema,
    ArticleCreatePDFSchema,
    ArticleContentSchema,
    DirectoryArticlesAndSubdirectoriesSchema,
    DirectoryInfoSchema,
    DirectoryCreateSchema,
    ArticleCreateHTMLSchema,
)
import PyPDF2
import random
import requests
import json
import yake
import re

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


@router.get("/directory/all/", response_model=DirectoryArticlesAndSubdirectoriesSchema)
async def get_articles_and_folders(name: str, user_uuid: str, db=Depends(get_db)):
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


def generate_summary(text, model_name="t5-small", max_length=150, min_length=40):
    # Load model and tokenizer
    try:
        from transformers import T5Tokenizer, T5ForConditionalGeneration
        tokenizer = T5Tokenizer.from_pretrained(model_name)
        model = T5ForConditionalGeneration.from_pretrained(model_name)

        # Preprocess the text
        processed_text = preprocess_text(text)
        t5_prepared_Text = f"summarize: {processed_text}"

        # Tokenize and generate summary
        tokenized_text = tokenizer.encode(
            t5_prepared_Text, return_tensors="pt", max_length=150, truncation=True
        )
        summary_ids = model.generate(
            tokenized_text,
            max_length=max_length,
            min_length=min_length,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True,
        )
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    except Exception as e:
        print(e)

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


def handle_article(db, title, user_uuid, directory, content, url=None):
    summary = generate_summary(content)

    article = ArticleModel(
        title=title,
        user_uuid=user_uuid,
        directory=directory,
        summary=summary,
        content=content,
        url=url,
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
    tag = extract_keywords(summary)

    # Construct the new JSON format
    transformed_json = {
        "fields": {
            "title": title,
            "content": summary,  # Assuming you want to use 'summary' as 'content'
            "abstract": summary,  # Assuming 'summary' also goes into 'abstract'
            "url": url,  # Example URL, adjust as needed
            "directory": directory,
            "tag": tag,
        }
    }

    return transformed_json


def feed_document_to_vespa(
    document, document_id, user_id, vespa_url=VESPA_URL
):
    # Constructing the document API URL
    feed_url = (
        f"{vespa_url}/document/v1/articles/articles/group/{user_id}/{document_id}"
    )

    # Headers for the request
    headers = {"Content-Type": "application/json"}

    # Sending the POST request to Vespa
    response = requests.post(feed_url, headers=headers, data=json.dumps(document))

    # Check if the request was successful
    if response.status_code in [200, 201]:
        return response.json()
    else:
        raise Exception(
            f"Feeding failed with status code {response.status_code}: {response.text}"
        )


@router.post("/article/create", response_model=ArticleContentSchema)
async def create_article(
    article: ArticleCreateHTMLSchema,
    # content: str = Body(..., embed=True),
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

    article = handle_article(
        db,
        article.title,
        article.user_uuid,
        directory.id,
        article.content,
        article.url,
    )


    new_json = transform_json_input(article)
    document_id = f"{article.id}"
    feed_document_to_vespa(new_json, document_id, article.user_uuid)

    return article


def update_vespa_document(
    document_id, new_directory_value, user_id, vespa_url=VESPA_URL
):
    # Constructing the document API URL
    feed_url = (
        f"{vespa_url}/document/v1/articles/articles/group/{user_id}/{document_id}"
    )

    # Headers for the request
    headers = {"Content-Type": "application/json"}

    # Document update structure
    document_update = {
        "update": "id:articles:articles::{document_id}",
        "fields": {"directory": {"assign": new_directory_value}},
    }

    # Sending the request
    response = requests.put(feed_url, headers=headers, data=json.dumps(document_update))

    # Check if the request was successful
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


@router.post("/article/upload", response_model=ArticleContentSchema)
async def upload_article(
    article: ArticleCreatePDFSchema = Depends(), db=Depends(get_db)
):
    # check if directory exists

    # assumes text and not file
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
    file_location = f"./{article.uploaded_file.filename}{random.randint(0, 1000000)}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(article.uploaded_file.file, file_object)

    pdf_reader = PyPDF2.PdfReader(file_location)
    total_pages = len(pdf_reader.pages)
    text = ""
    for i in range(total_pages):
        page = pdf_reader.pages[i]
        text += page.extract_text().replace("\n", " ")
    article_content = text
    os.remove(file_location)
    # mock summary
    article = handle_article(
        db, article.title, article.user_uuid, directory.id, article_content
    )
    new_json = transform_json_input(article)
    document_id = f"{article.id}"
    feed_document_to_vespa(new_json, document_id, article.user_uuid)

    return article


def delete_article_from_vespa(document_id, user_id, vespa_url=VESPA_URL):
    feed_url = (
        f"{vespa_url}/document/v1/articles/articles/group/{user_id}/{document_id}"
    )

    headers = {"Content-Type": "application/json"}

    # Sending the POST request to Vespa
    response = requests.delete(feed_url, headers=headers)

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
    db.delete(article)
    db.commit()

    delete_article_from_vespa(article.id, article.user_uuid)
    return {"msg": "Article deleted successfully!"}
