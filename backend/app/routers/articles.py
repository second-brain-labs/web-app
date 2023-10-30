import os
import shutil
from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import ArticleModel, DirectoryModel
from app.schemas.articles import ArticleSchema, ArticleCreateSchema, ArticleContentSchema, DirectoryInfoSchema, DirectoryCreateSchema
import PyPDF2
import random
from transformers import AutoTokenizer, AutoModelWithLMHead
router = APIRouter(prefix="/articles")

@router.get("/")
async def article_info():
    return {"msg": "Article API"}

@router.get("/user/{user_id}", response_model=list[ArticleSchema])
async def get_articles(user_id: int, db=Depends(get_db)):
    articles : list[ArticleModel] = db.query(ArticleModel).filter(ArticleModel.user_id == user_id).all()
    return articles

@router.get("/article/{article_id}", response_model=ArticleSchema)
async def get_article(article_id: int, db=Depends(get_db)):
    article : ArticleModel = db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    return article

@router.get("/article/{article_id}/content", response_model=ArticleContentSchema)
async def get_article_content(article_id: int, db=Depends(get_db)):
    article : ArticleModel = db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    return article

@router.get("/directory/articles", response_model=list[ArticleSchema])
async def get_articles_by_directory(name: str, user_id: str, db=Depends(get_db)):
    articles : list[ArticleModel] = db.query(ArticleModel).filter(ArticleModel.directory == name, ArticleModel.user_id == user_id).all()
    return articles

@router.get("/directory/subdirectories", response_model=list[DirectoryInfoSchema])
async def get_folders(name: str, user_id: str, db=Depends(get_db)):
    directories : list[DirectoryModel] = db.query(DirectoryModel).filter(DirectoryModel.parent_directory == name, DirectoryModel.user_id == user_id).all()
    return directories


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
    existing_directory : DirectoryModel = db.query(DirectoryModel).filter(DirectoryModel.name == directory.name, DirectoryModel.user_id == directory.user_id).first()
    if existing_directory:
        return existing_directory

    if directory.name == "/":
        directory = DirectoryModel(name=directory.name, user_id=directory.user_id)
    else:
        directory = DirectoryModel(name=directory.name, user_id=directory.user_id, parent_directory=_get_parent_directory(directory.name))

    db.add(directory)
    db.commit()
    db.refresh(directory)
    return directory

@router.post("/article/upload", response_model=ArticleContentSchema)
async def create_article(article: ArticleCreateSchema = Depends(), db=Depends(get_db)):
    # check if directory exists

    # assumes text and not file
    directory = db.query(DirectoryModel).filter(DirectoryModel.name == article.directory, DirectoryModel.user_id == article.user_id).first()
    if directory is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Directory not found")
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
    article = ArticleModel(title=article.title, url=article.url, user_id=article.user_id, directory=article.directory, content=article_content)
    os.remove(file_location)
    # mock summary
    tokenizer = AutoTokenizer.from_pretrained('t5-base')
    model = AutoModelWithLMHead.from_pretrained('t5-base', return_dict=True)
    inputs = tokenizer.encode("summarize: " + article_content,
        return_tensors='pt',
        max_length=512,
        truncation=True
    )
    summary_ids = model.generate(inputs, max_length=200, min_length=80, length_penalty=5., num_beams=2)

    article.summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)


    db.add(article)
    db.commit()
    db.refresh(article)
    return article
