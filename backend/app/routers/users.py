from fastapi.encoders import jsonable_encoder
from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import *
from app.schemas import User as UserSchema

router = APIRouter(prefix="/users")

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(user_id: int, db=Depends(get_db)):
    user : UserModel = db.query(UserModel).filter(UserModel.id == user_id).first()
    
    return user



