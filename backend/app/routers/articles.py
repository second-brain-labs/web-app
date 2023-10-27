from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import *
router = APIRouter(prefix="/articles")

@router.get("/")
async def article_info():
    return {"msg": "Article API"}

@router.get("/user/{user_id}")
async def get_articles(user_id: int, db=Depends(get_db)):
    print(db.query(Article).all())
    articles = db.query(Article).filter(Article.user_id == user_id).all()
    return articles