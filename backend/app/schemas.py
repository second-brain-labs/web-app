from datetime import datetime
from pydantic import BaseModel

class ArticleBaseSchema(BaseModel):
    title: str
    url: str
    user_id: int
    directory: str

class ArticleCreateSchema(ArticleBaseSchema):
    content : str

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

class UserBaseSchema(BaseModel):
    email: str
    name: str

class UserCreateSchema(UserBaseSchema):
    password: str

class UserSchema(UserBaseSchema):
    id: int

    class Config:
        from_attributes = True

class UserArticlesSchema(UserSchema):
    articles: list = []

    class Config:
        from_attributes = True


class DirectoryCreateSchema(BaseModel):
    name: str
    user_id: int

class DirectoryInfoSchema(DirectoryCreateSchema):
    parent_directory: str

    class Config:
        from_attributes = True 