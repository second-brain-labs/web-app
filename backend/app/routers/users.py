from app.db import get_db
from fastapi import APIRouter, Depends
from app.models import UserModel, DirectoryModel
from app.schemas.users import UserSchema, UserCreateSchema

router = APIRouter(prefix="/users")

@router.get("/{user_id}", response_model=UserSchema)
async def get_user(user_id: int, db=Depends(get_db)):

    user : UserModel = db.query(UserModel).filter(UserModel.id == user_id).first()

    return user

@router.post("/dummy/create/", response_model=UserSchema)
async def create_dummy_user(user: UserCreateSchema, db=Depends(get_db)):
    # check if user with email exists
    existing_user : UserModel = db.query(UserModel).filter(UserModel.email == user.email).first()
    if existing_user:
        return existing_user
    user : UserModel = UserModel(name=user.name, email=user.email, password=user.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    directory : DirectoryModel = DirectoryModel(name="/", user_id=user.id)
    db.add(directory)
    db.commit()

    return user
