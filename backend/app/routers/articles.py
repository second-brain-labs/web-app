import sys
from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import *
from app.schemas import Article as ArticleSchema
from app.schemas import ArticleWithContent as ArticleWithContentSchema
from fastapi.encoders import jsonable_encoder

router = APIRouter(prefix="/articles")

@router.get("/")
async def article_info():
    return {"msg": "Article API"}

@router.get("/user/{user_id}", response_model=list[ArticleSchema])
async def get_articles(user_id: int, db=Depends(get_db)):
    print(db.query(ArticleModel).all())
    articles : list[ArticleModel] = db.query(ArticleModel).filter(ArticleModel.user_id == user_id).all()
    return articles

@router.get("/article/{article_id}", response_model=ArticleSchema)
async def get_article(article_id: int, db=Depends(get_db)):
    article : ArticleModel = db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    return article

@router.get("/article/{article_id}/content", response_model=ArticleWithContentSchema)
async def get_article_content(article_id: int, db=Depends(get_db)):
    article : ArticleModel = db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    return article

@router.get("/directory", response_model=list[ArticleSchema])
async def get_articles_by_directory(name: str, user_id: str, db=Depends(get_db)):
    articles : list[ArticleModel] = db.query(ArticleModel).filter(ArticleModel.directory == name, ArticleModel.user_id == user_id).all()
    print(articles)
    return articles

@router.get("/directory/subdirectories", response_model=list[ArticleSchema])
async def get_folders(name: str, db=Depends(get_db)):
    pass #TODO

@router.post("/article", response_model=ArticleSchema)
async def create_article(article: ArticleSchema, db=Depends(get_db)):
    pass # TODO

@router.post("/directory")
async def create_directory(name: str, parent_name: str, user_id: str, db=Depends(get_db)):
    pass # TODO