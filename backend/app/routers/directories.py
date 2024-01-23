from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import ArticleModel, DirectoryModel
from app.schemas.articles import (
    DirectoryInfoSchema,
    DirectoryCreateSchema,
)

router = APIRouter(prefix="/directories")


@router.get("/subdirectories", response_model=list[DirectoryInfoSchema])
async def get_folders(name: str, user_uuid: str, db=Depends(get_db)):
    directories: list[DirectoryModel] = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.parent_directory_name == name,
            DirectoryModel.user_uuid == user_uuid,
        )
        .all()
    )
    return directories


def _get_parent_directory(directory: str):
    tree = directory.split("/")
    if len(tree) == 1:
        return "/"

    return "/".join(tree[:-1])


@router.post("/create", response_model=DirectoryInfoSchema)
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
        print(existing_directory)
        return existing_directory
    print("No existing directory found")
    if directory.name == "/":
        directory_model = DirectoryModel(
            name=directory.name, user_uuid=directory.user_uuid
        )
    else:
        parent_dir_name = _get_parent_directory(directory.name)
        parent_directory: DirectoryModel = (
            db.query(DirectoryModel)
            .filter(
                DirectoryModel.name == parent_dir_name,
                DirectoryModel.user_uuid == directory.user_uuid,
            )
            .first()
        )
        if parent_directory is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Parent directory not found",
            )
        print(f"Parent: {parent_directory}")
        directory_model = DirectoryModel(
            name=directory.name,
            user_uuid=directory.user_uuid,
            parent_directory=parent_directory.id,
        )

    db.add(directory_model)
    db.commit()
    db.refresh(directory_model)
    print(directory_model)
    return directory_model


@router.delete("/delete")
async def delete_directory(user_uuid: str, directory_name: str, db=Depends(get_db)):
    if directory_name == "/":
        return {"msg": "Cannot delete root directory!"}
    articles = (
        db.query(ArticleModel)
        .filter(
            ArticleModel.directory_name.startswith(directory_name),
            ArticleModel.user_uuid == user_uuid,
        )
        .all()
    )
    for article in articles:
        db.delete(article)
    db.commit()

    directories = (
        db.query(DirectoryModel)
        .filter(
            DirectoryModel.name.startswith(directory_name),
            DirectoryModel.user_uuid == user_uuid,
        )
        .all()
    )
    for directory in directories:
        db.delete(directory)
    db.commit()
    return {"msg": "Directory deleted successfully!"}


@router.get("/query", response_model=DirectoryInfoSchema)
async def get_directory(name: str, user_uuid: str, db=Depends(get_db)):
    directory: DirectoryModel = (
        db.query(DirectoryModel)
        .filter(DirectoryModel.name == name, DirectoryModel.user_uuid == user_uuid)
        .first()
    )
    if directory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Directory not found"
        )
    return directory
