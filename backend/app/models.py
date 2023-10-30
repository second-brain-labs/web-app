from sqlalchemy import Column, DateTime, Integer, ForeignKey, String
from app.db import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    articles = relationship("ArticleModel", back_populates="user")
    directories = relationship("DirectoryModel", back_populates="user")
class ArticleModel(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    summary = Column(String)
    url = Column(String, nullable=False)
    directory = Column(String, ForeignKey("directories.name"))
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    user = relationship("UserModel", back_populates="articles")

class DirectoryModel(Base):
    __tablename__ = "directories"

    name = Column(String, nullable=False, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    parent_directory = Column(String, ForeignKey("directories.name"))
    user = relationship("UserModel", back_populates="directories")
    