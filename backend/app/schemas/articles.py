from datetime import datetime
from fastapi import Form, UploadFile
from pydantic import BaseModel


class ArticleBaseSchema(BaseModel):
    title: str = Form(...)
    url: str = Form(...)
    user_id: int = Form(...)
    directory: str = Form(...)

class ArticleCreateSchema(ArticleBaseSchema):
    uploaded_file: UploadFile = Form(...)


class ArticleSchema(ArticleBaseSchema):
    summary: str
    id: int
    time_created: datetime

    class Config:
        from_attributes = True

class ArticleContentSchema(ArticleSchema):
    content: str

    class Config:
        from_attributes = True

class DirectoryCreateSchema(BaseModel):
    name: str
    user_id: int

class DirectoryInfoSchema(DirectoryCreateSchema):
    parent_directory: str

    class Config:
        from_attributes = True
