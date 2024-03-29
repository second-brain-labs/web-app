import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from app import models
from app.db import engine, get_static_file_path
from app.routers import articles, directories, external, users

models.Base.metadata.create_all(bind=engine)

load_dotenv()

api = FastAPI()

api.include_router(users.router)
api.include_router(articles.router)
api.include_router(directories.router)
api.include_router(external.router)

get_static_file_path()
api.mount("/static", StaticFiles(directory="app/static"), name="static")


origins = [
    "*",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@api.get("/")
async def root():
    return RedirectResponse("/docs")


if __name__ == "__main__":
    uvicorn.run("app.main:api", host="0.0.0.0", port=3500, workers=4, reload=True)
