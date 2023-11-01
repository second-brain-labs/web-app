from datetime import datetime
from fastapi import Form, UploadFile
from pydantic import BaseModel


class ArticleBaseSchema(BaseModel):
    title: str = Form(...)
    user_uuid: str = Form(...)
    directory: str = Form(...)

class ArticleCreatePDFSchema(ArticleBaseSchema):
    uploaded_file: UploadFile = Form(...)

class ArticleCreateHTMLSchema(ArticleBaseSchema):
    url: str = Form(...)

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
    user_uuid: str

class DirectoryInfoSchema(DirectoryCreateSchema):
    parent_directory: str

    class Config:
        from_attributes = True