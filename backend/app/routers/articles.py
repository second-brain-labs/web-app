import os
import shutil
from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import ArticleModel, DirectoryModel
from app.schemas.articles import (
    ArticleSchema,
    ArticleCreatePDFSchema,
    ArticleContentSchema,
    DirectoryArticlesAndSubdirectoriesSchema,
    DirectoryInfoSchema,
    ArticleCreateHTMLSchema,
)
import PyPDF2
import random
from transformers import AutoTokenizer, AutoModelWithLMHead

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


@router.get("/directory/all-recursive", response_model=list[DirectoryInfoSchema])
async def get_all_directories(user_uuid: str, db=Depends(get_db)):
    directories: list[DirectoryModel] = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.user_uuid == user_uuid,
        )
        .all()
    )
    print(directories)
    directories.sort(key=lambda x: x.name)
    return directories


def handle_article(db, title, user_uuid, directory, content, url=None):
    tokenizer = AutoTokenizer.from_pretrained("t5-base")
    model = AutoModelWithLMHead.from_pretrained("t5-base", return_dict=True)
    inputs = tokenizer.encode(
        "summarize: " + content, return_tensors="pt", max_length=512, truncation=True
    )
    summary_ids = model.generate(
        inputs, max_length=250, length_penalty=5.0, num_beams=2
    )

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

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

    return article


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
    return {"msg": "Article deleted successfully!"}
