from fastapi import APIRouter, Body, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from fastapi.websockets import WebSocket
from passlib.context import CryptContext
from datetime import datetime
from redis import asyncio as aioredis
from typing import Annotated
import asyncio
import json

from app.battle.models import (
    Participant,
    RoomSchema,
    RoomPostSchema,
    room_helper
)
from app.user.database import (
    check_out_existing_user,
    retrieve_user,
    retrieve_user_id,
    get_current_active_user,
    get_current_user
)
from app.user.models import (
    TokenSchema,
    UserSchema,
    UserResponseSchema
)

from app.battle.database import (
    add_room,
    update_room_participants,
    get_user_data,
    update_room_time,
)

router = APIRouter()

async def get_redis_pool():
    return await aioredis.from_url("redis://172.17.0.5:6379/0")

@router.post("/rooms", response_description="Create Room")
async def create_room_session(redis: Annotated[aioredis.Redis, Depends(get_redis_pool)], room: RoomPostSchema = Body(...), current_user: UserResponseSchema = Depends(get_current_active_user)):
    """
    DB에 방 정보 저장
    """
    room = jsonable_encoder(room)

    userid = current_user['userid']
    user_name = current_user['name']
    user_email = current_user['email']

    room['created_at'] = datetime.now()
    room['creator'] = {
        "username": user_name,
        "email": user_email,
        "userid":userid
    }
    room['problem_count'] = len(room['problem_number'])
    room['participants'] = [
        {
            "username": user_name,
            "email": user_email,
            "userid":userid,
            "problem_solved": False,
            "solved_count": 0,
            "solved_problem": [],
            "room_admin": True
        }
    ]

    new_room = await add_room(room)

    """
    Session 생성
    - 사용자가 세션 생성
    """
    session_id = str(new_room['id'])
    set_data = jsonable_encoder(new_room)

    await redis.set(session_id, json.dumps(set_data))
    
    return {"url": f"/{session_id}/"}

@router.websocket("/{session_id}/{user_id}/")
async def room_websocket(websocket: WebSocket, session_id: str, user_id:str, redis: Annotated[aioredis.Redis, Depends(get_redis_pool)]):
    # Redis에서 방 정보 가져오기
    room_data = await redis.get(session_id)

    if not room_data:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    room = json.loads(room_data)

    current_user = await get_user_data(user_id)

    user_data = {
        "username": current_user["name"],
        "email": current_user["email"],
        "userid": current_user["userid"],
        "problem_solved": False,
        "solved_count": 0,
        "solved_problem": [],
        "room_admin": False
    }

    update_room_data = await update_room_participants(session_id, user_data)

    room["participants"].append(user_data)

    await redis.set(session_id, json.dumps(room))

    await websocket.accept()

    await websocket.send_json(room)

@router.websocket("/{session_id}/{user_id}/timer")
async def timer_handler(websocket: WebSocket, user_id:str, redis: Annotated[aioredis.Redis, Depends(get_redis_pool)], session_id: str):
    # Redis에서 방 정보 가져오기
    room_data = await redis.get(session_id)
    
    if not room_data:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    room = json.loads(room_data)
    room["time_limit"] = 50
    await redis.set(session_id, json.dumps(room))
    # 타이머 시작
    time_limit = int(room["time_limit"])
    await websocket.accept()

    while time_limit > 0:
        await asyncio.sleep(1)
        time_limit -= 1
        room["time_limit"] = time_limit
        # update_room_time = await update_room_time(session_id, time_limit)
        await redis.set(session_id, json.dumps(room))

        await websocket.send_json({"time_remaining": time_limit})