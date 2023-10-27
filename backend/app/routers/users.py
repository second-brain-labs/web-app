from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import *
router = APIRouter(prefix="/users")

@router.get("/{user_id}")
async def get_user(user_id: int, db=Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return user



