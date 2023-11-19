from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv
from app import models
from app.db import engine
from app.routers import users, articles
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

load_dotenv()

api = FastAPI()

api.include_router(users.router)
api.include_router(articles.router)

origins = [
    "http://localhost:3000",
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
    return {"msg": "API is Online!"}

if __name__ == "__main__":
    if os.environ.get("APP_ENV") == "development":
        uvicorn.run("app.main:api", host="0.0.0.0", port=3500, workers=4, reload=True)
    else:
        pass
