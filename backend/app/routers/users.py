from app.db import get_db
from fastapi import APIRouter, Depends
from app.models import UserModel, DirectoryModel
from app.schemas.users import UserSchema, UserCreateSchema

router = APIRouter(prefix="/users")

@router.get("/{user_uuid}", response_model=UserSchema)
async def get_user(user_uuid: str, db=Depends(get_db)):

    user : UserModel = db.query(UserModel).filter(UserModel.uuid == user_uuid).first()

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
    directory : DirectoryModel = DirectoryModel(name="/", user_uuid=user.uuid)
    db.add(directory)
    db.commit()

    return user

@router.get("/dummy/all")
async def dummy_get_users(db=Depends(get_db)):
    # DUMMY ROUTE
    users : list[UserModel] = db.query(UserModel).all()
    return users
