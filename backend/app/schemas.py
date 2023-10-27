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
    
    
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    articles: list = []

    class Config:
        orm_mode = True