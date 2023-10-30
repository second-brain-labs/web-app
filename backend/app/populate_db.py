# This file is used to populate the database with dummy data
# Run from backend directory with: python3 app/populate_db.py

import os
from app.models import UserModel, ArticleModel, Base
from app.db import get_db, engine

if os.path.exists("sql_app.db"):
    os.remove("sql_app.db")

Base.metadata.create_all(bind=engine)

    

# create users
def create_user(db, name, email, password):
    user = UserModel(name=name, email=email, password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# create articles
def create_article(db, title, content, summary, url, user_id):
    article = ArticleModel(title=title, content=content, summary=summary, url=url, user_id=user_id)
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

db = next(get_db())
user1 = create_user(db=db, name="John Doe", email="johndoe@gmail.com", password="password")
user2 = create_user(db=db, name="Jane Doe", email="janedoe@gmail.com", password="password")
create_article(db=db, title="Article 1", content="This is the content for article 1", summary="This is the summary for article 1", url="https://www.google.com", user_id=user1.id)
create_article(db=db, title="Article 2", content="This is the content for article 2", summary="This is the summary for article 2", url="https://www.google.com", user_id=user1.id)
create_article(db=db, title="Article 3", content="This is the content for article 3", summary="This is the summary for article 3", url="https://www.google.com", user_id=user2.id)
