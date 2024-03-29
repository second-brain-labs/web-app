from dotenv import load_dotenv

load_dotenv()

import os
import pathlib

from llama_index import ServiceContext
from llama_index.query_engine import RetrieverQueryEngine
from llama_index.response_synthesizers import ResponseMode
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from vespa.application import Vespa

from app.llm import LocalLLM, MixtralModalLLM
from app.vespa_retriever import VespaArticleRetriever

VESPA_URL = os.getenv("VESPA_URL", "https://secondbrainlabs.xyz/vespa")

vespa_app = Vespa(VESPA_URL)

retriever = VespaArticleRetriever(app=vespa_app, user="")
llm = MixtralModalLLM()

service_context = ServiceContext.from_defaults(llm=llm, embed_model=None)
query_engine_rag = RetrieverQueryEngine.from_args(
    retriever,
    service_context=service_context,
    response_mode=ResponseMode.SIMPLE_SUMMARIZE,
    verbose=True,
)


def get_static_file_path():
    STATIC_FILE_PATH = pathlib.Path(__file__).parent / "static"
    STATIC_FILE_PATH.mkdir(parents=True, exist_ok=True)
    assert STATIC_FILE_PATH.exists(), "Static file path does not exist, failing startup"
    return STATIC_FILE_PATH


# Only generation
query_engine = LocalLLM()

# Note: we don't actually ever use Postgres, but if we want to...
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
