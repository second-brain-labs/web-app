from datetime import datetime
from pydantic import BaseModel

class ArticleBase(BaseModel):
    title: str
    url: str

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    content: str
    summary: str
    time_created: str
    user_id: int
    time_created: datetime
    
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
