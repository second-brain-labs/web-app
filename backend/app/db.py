from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

if os.getenv("APP_ENV", "").lower() == "production":
    POSTGRES_HOST = os.getenv("POSTGRES_HOST_PROD")
    POSTGRES_PORT = os.getenv("POSTGRES_PORT_PROD")
    POSTGRES_USER = os.getenv("POSTGRES_USER_PROD")
    POSTGRES_PASSWORD = os.getenv("POSTGRES_PASS_PROD")
    SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/postgres"
else:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
