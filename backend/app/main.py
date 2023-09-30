from fastapi import FastAPI, Request
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

api = FastAPI()


@api.get("/")
async def root():
    return {"msg": "API is Online!"}


if __name__ == "__main__":
    if os.environ.get("APP_ENV") == "development":
        uvicorn.run("app.main:api", host="0.0.0.0", port=3500, workers=4, reload=True)
    else:
        pass