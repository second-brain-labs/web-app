from sqlalchemy import Column, DateTime, Integer, ForeignKey, String
from app.db import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid as uuid_pkg


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    uuid = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
        default=lambda x: str(uuid_pkg.uuid4()),
    )
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    articles = relationship("ArticleModel", back_populates="user")
    directories = relationship("DirectoryModel", back_populates="user")


class ArticleModel(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String)
    summary = Column(String)
    url = Column(String)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    user_uuid = Column(String, ForeignKey("users.uuid"), index=True)
    user = relationship("UserModel", back_populates="articles")
    directory = Column(
        Integer, ForeignKey("directories.id", ondelete="CASCADE"), index=True
    )


class DirectoryModel(Base):
    __tablename__ = "directories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_uuid = Column(String, ForeignKey("users.uuid"))
    parent_directory = Column(Integer, ForeignKey("directories.id"))
    user = relationship("UserModel", back_populates="directories")
