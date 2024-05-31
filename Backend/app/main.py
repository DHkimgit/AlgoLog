from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.user.routes import router as UserRouter
from app.crawl.routes import router as CrawlRouter
from app.login.routes import router as LoginRouter
from app.comment.routes import router as CommentRouter
from app.battle.routes import router as BottleRouter

app = FastAPI()

origins = [
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# source /home/alogolog/algolog/bin/activate
# deactivate
# cd Back
# uvicorn app.main:app --reload --host 0.0.0.0

app.include_router(UserRouter, tags=["User"], prefix="/user")
app.include_router(CrawlRouter, tags=["Crawl"], prefix="/crawl")
app.include_router(LoginRouter, tags=["Login"], prefix="/login")
app.include_router(CommentRouter, tags=["Comment"], prefix="/comment")
app.include_router(BottleRouter, tags=["Battle"], prefix="/battle")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to this fantastic app!"}