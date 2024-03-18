from bson.objectid import ObjectId
from typing import Union
from decouple import config
import motor.motor_asyncio
from fastapi import Depends, FastAPI, HTTPException, status
from jose import JWTError, jwt
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from app.crawl.models import (
    TagSchema,
    ProblemSchema
)
from app.crawl.logic import (
    crawl_boj_name_tags,
    crawl_solved_problem_number
)

MONGO_DETAILS = config("MONGO_DETAILS")
ALGORITHM = "HS256"
JWT_SECRET_KEY = config("JWT_SECRET_KEY")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.algolog
user_collection = db.get_collection("user")
problem_collection = db.get_collection("problem")
problem_tag_collection = db.get_collection("tag")

def tag(user) -> dict:
    return {
        "id": str(user["_id"]),
        "userid": user["userid"],
        "bojid": user["bojid"],
        "name": user["name"],
        "email": user["email"],
        "password": user["password"],
        "admin": user["admin"],
    }

async def add_problem_data(problemid: int):
    check_already_added = await check_problem_data(problemid)
    if check_already_added == 1:
        print(f"{problemid} already exisist")
        return 0
    tagids = []
    title_tags_data = crawl_boj_name_tags(problemid)
    for tags in range(len(title_tags_data["tags"])):
        tag_existed_id = await retrive_tag_data(title_tags_data["tags"][tags])
        if tag_existed_id == 0:
            tagid = await add_tag_data(title_tags_data["tags"][tags])
            tagid_str = str(tagid)
            tagids.append(tagid_str)
        else:
            tagids.append(tag_existed_id)

    added_data = {
        "problemid": problemid,
        "title": title_tags_data["name"],
        "percentage": title_tags_data["percentage"],
        "tiers": title_tags_data["tiers"],
        "tags": title_tags_data["tags"],
        "tagid": tagids
    }

    print(added_data)
    added_data = jsonable_encoder(added_data)
    add_problem = await problem_collection.insert_one(added_data)
    new_problem = await problem_collection.find_one({"_id": add_problem.inserted_id})
    return new_problem["title"]

async def add_tag_data(tagname: str):
    data = {
        "tagname" : tagname
    }
    added_data = jsonable_encoder(data)
    tag = await problem_tag_collection.insert_one(added_data)
    new_tag = await problem_tag_collection.find_one({"_id": tag.inserted_id})
    return str(new_tag["_id"])

async def retrive_tag_data(tagname:str):
    tag = await problem_tag_collection.find_one({"tagname": tagname})
    if tag:
        return str(tag["_id"])
    else:
        return 0

async def retrive_problem_data(problemid: int):
    problem = await problem_collection.find_one({"problemid": problemid})
    response_data = {
        "problemid": problem["problemid"],
        "title": problem["title"],
        "percentage": problem["percentage"],
        "tiers": problem["tiers"],
        "tags": problem["tags"]
    }
    return response_data

async def check_problem_data(problemid:str):
    problem = await problem_collection.find_one({"problemid": problemid})
    if problem:
        return 1
    else:
        return 0
