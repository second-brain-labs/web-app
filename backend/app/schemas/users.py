from pydantic import BaseModel
from app.schemas.articles import ArticleSchema

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
    articles: list[ArticleSchema] = []

    class Config:
        from_attributes = True
