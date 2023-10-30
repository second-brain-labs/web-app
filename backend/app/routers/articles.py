from app.db import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from app.models import ArticleModel, DirectoryModel
from app.schemas import ArticleSchema, ArticleCreateSchema, ArticleContentSchema, DirectoryInfoSchema, DirectoryCreateSchema

router = APIRouter(prefix="/articles")

@router.get("/")
async def article_info():
    return {"msg": "Article API"}

@router.get("/user/{user_id}", response_model=list[ArticleSchema])
async def get_articles(user_id: int, db=Depends(get_db)):
    print(db.query(ArticleModel).all())
    articles : list[ArticleModel] = db.query(ArticleModel).filter(ArticleModel.user_id == user_id).all()
    return articles

@router.get("/article/{article_id}", response_model=ArticleSchema)
async def get_article(article_id: int, db=Depends(get_db)):
    article : ArticleModel = db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    return article

@router.get("/article/{article_id}/content", response_model=ArticleContentSchema)
async def get_article_content(article_id: int, db=Depends(get_db)):
    article : ArticleModel = db.query(ArticleModel).filter(ArticleModel.id == article_id).first()
    return article

@router.get("/directory/articles", response_model=list[ArticleSchema])
async def get_articles_by_directory(name: str, user_id: str, db=Depends(get_db)):
    articles : list[ArticleModel] = db.query(ArticleModel).filter(ArticleModel.directory == name, ArticleModel.user_id == user_id).all()
    print(articles)
    return articles

@router.get("/directory/subdirectories", response_model=list[DirectoryInfoSchema])
async def get_folders(name: str, user_id: str, db=Depends(get_db)):
    directories : list[DirectoryModel] = db.query(DirectoryModel).filter(DirectoryModel.parent_directory == name, DirectoryModel.user_id == user_id).all()
    return directories


def _get_parent_directory(directory: str):
    tree = directory.split("/")
    return "/".join(tree[:-1])

@router.post("/directory/create", response_model=DirectoryInfoSchema)
async def create_directory(directory: DirectoryCreateSchema, db=Depends(get_db)):
    """
    Create a directory a/b/c/d
    """
    directory = DirectoryModel(name=directory.name, user_id=directory.user_id, parent_directory=_get_parent_directory(directory.name))
    db.add(directory)
    db.commit()
    db.refresh(directory)
    return directory

@router.post("/article/upload", response_model=ArticleSchema)
async def create_article(article: ArticleCreateSchema, db=Depends(get_db)):
    # check if directory exists

    # assumes text and not file
    directory = db.query(DirectoryModel).filter(DirectoryModel.name == article.directory, DirectoryModel.user_id == article.user_id).first()
    if directory is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Directory not found")
    article = ArticleModel(title=article.title, url=article.url, user_id=article.user_id, directory=article.directory, content=article.content)
    db.add(article)
    db.commit()
    db.refresh(article)
    return article
