from pydantic import BaseModel
from app.schemas.articles import ArticleSchema


class UserBaseSchema(BaseModel):
    email: str
    name: str


class UserCreateSchema(UserBaseSchema):
    pass


class UserSchema(UserBaseSchema):
    uuid: str

    class Config:
        from_attributes = True


class UserArticlesSchema(UserSchema):
    articles: list[ArticleSchema] = []

    class Config:
        from_attributes = True
