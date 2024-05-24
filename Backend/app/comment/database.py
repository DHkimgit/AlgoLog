from bson.objectid import ObjectId
from typing import Union
from decouple import config
import motor.motor_asyncio
from fastapi import Depends, FastAPI, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.comment.models import (
    ProblemWithCommentsSchema
)
from app.crawl.models import (
    ProblemSchema
)

MONGO_DETAILS = config("MONGO_DETAILS")
ALGORITHM = "HS256"
JWT_SECRET_KEY = config("JWT_SECRET_KEY")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.algolog
comment_collection = db.get_collection("comment")
problem_collection = db.get_collection("problem")
user_collection = db.get_collection("user")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

class TokenData(BaseModel):
    username: Union[str, None] = None

async def comment_helper(user) -> dict:
    print("sdsd")
    print(user["userid"])
    user_name = await user_collection.find_one({"_id": ObjectId(user["userid"])})
    if user_name == None:
        return {
            "_id": str(user["_id"]),
            "problemid": user["problemid"],
            "userid": user["userid"],
            "username": "탈퇴한 사용자",
            "comment": user["comment"],
            "up": user["up"],
            "down": user["down"]
        }
    print(user_name)
    return {
        "_id": str(user["_id"]),
        "problemid": user["problemid"],
        "userid": user["userid"],
        "username": user_name["name"],
        "comment": user["comment"],
        "up": user["up"],
        "down": user["down"]
    }

async def add_comment(comment_data: dict) -> dict:
    comment = await comment_collection.insert_one(comment_data)
    new_comment = await comment_collection.find_one({"_id": comment.inserted_id})
    return await comment_helper(new_comment)

async def get_comment(comment_id: str):
    comments = []
    #comment = await comment_collection.find_all({"_id": comment_id})
    async for comment in comment_collection.find({"problemid": comment_id}):
        comments.append(comment_helper(comment))
    print(comments)
    return comments

# Delete a comment from the database
async def delete_comment(id: str):
    comment = await comment_collection.find_one({"_id": ObjectId(id)})
    if comment:
        await comment_collection.delete_one({"_id": ObjectId(id)})
        return True

async def get_comment_page_data(problem_id: str) -> dict:

    problem_data = await problem_collection.find_one({"_id": ObjectId(problem_id)})
    print(problem_data)
    if problem_data is None:
        raise HTTPException(status_code=404, detail="Problem not found")

    response_problem_data = {
        "_id": str(problem_data["_id"]),
        "problemid": problem_data["problemid"],
        "title": problem_data["title"],
        "percentage": problem_data["percentage"],
        "tiers": problem_data["tiers"],
        "tags": problem_data["tags"]
    }

    comments = []
    async for comment in comment_collection.find({"problemid": problem_id}):
        comments.append(await comment_helper(comment))
    

    return {"problem": response_problem_data, "comments" : comments}

