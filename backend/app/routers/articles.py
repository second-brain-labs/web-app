import sys
from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import *
from app.schemas import Article as ArticleSchema
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