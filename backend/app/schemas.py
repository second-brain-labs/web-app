from datetime import datetime
from pydantic import BaseModel


class Article(BaseModel):
    title: str
    url: str

    id: int
    summary: str
    time_created: str
    user_id: int
    time_created: datetime
    directory: str
    class Config:
        from_attributes = True

class ArticleWithContent(Article):
    content: str

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserWithArticles(User):
    articles: list = []

    class Config:
        from_attributes = True
