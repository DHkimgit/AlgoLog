from bson.objectid import ObjectId
from typing import Union
from decouple import config
import motor.motor_asyncio
from fastapi import Depends, FastAPI, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

MONGO_DETAILS = config("MONGO_DETAILS")
ALGORITHM = "HS256"
JWT_SECRET_KEY = config("JWT_SECRET_KEY")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
db = client.algolog
comment_collection = db.get_collection("comment")
problem_collection = db.get_collection("problem")
user_collection = db.get_collection("user")
room_collection = db.get_collection("room")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

from app.battle.models import (
    Participant,
    RoomSchema,
    RoomPostSchema,
    room_helper
)

class TokenData(BaseModel):
    username: Union[str, None] = None


async def add_room(room_data: dict) -> dict:
    room = await room_collection.insert_one(room_data)
    new_room = await room_collection.find_one({"_id": room.inserted_id})
    return room_helper(new_room)

async def update_room_participants(_id: str, user: dict):
    get_room_data = await room_collection.find_one({"_id": ObjectId(_id)})
    if(get_room_data):
        update_room_participants = await room_collection.update_one(
            {"_id": ObjectId(_id)},
            {"$push" : {"participants" : user}}
        )
    
    updated_room = await room_collection.find_one({"_id": ObjectId(_id)})

    return room_helper(updated_room)

async def get_user_data(id: str):
    get_user_data = await user_collection.find_one({"userid": id})
    
    return {
        "name" : get_user_data['name'],
        "email" : get_user_data['email'],
        "userid" : get_user_data['userid']
    }

async def update_room_time(_id: str, time: int):
    get_room_data = await room_collection.find_one({"_id": ObjectId(_id)})
    if(get_room_data):
        update_time = await room_collection.update_one(
            {"_id": ObjectId(_id)},
            {"$set" : {"time_limit" : time}}
        )
    updated_room = await room_collection.find_one({"_id": ObjectId(_id)})

    return room_helper(updated_room)