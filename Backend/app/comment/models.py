from typing import Optional, Union, List
from pydantic import BaseModel, EmailStr, Field, validator
from app.crawl.models import (
    ProblemSchema
)
class CommentSchema(BaseModel):
    problemid: str = Field(...)
    userid: str = Field(...)
    comment: str = Field(...)
    up: int = Field(...)
    down: int = Field(...)

    class config():
        schema_extra = {
            "example": {
                "name": "John Doe",
                "userid": "22-76458458",
                "bojid": "abcde",
                "email": "8dnjfekf@gmail.com",
                "password": "8dnjfekf!",
                "admin": True,
            }
        }

class CommentAddSchema(BaseModel):
    comment: str = Field(...)
    up: int = Field(...)
    down: int = Field(...)

    class config():
        schema_extra = {
            "example": {
                "name": "John Doe",
                "userid": "22-76458458",
                "bojid": "abcde",
                "email": "8dnjfekf@gmail.com",
                "password": "8dnjfekf!",
                "admin": True,
            }
        }

class ProblemWithCommentsSchema(BaseModel):
    problem: ProblemSchema
    comments: list[CommentSchema]

def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }

def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}