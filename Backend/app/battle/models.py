from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class Participant(BaseModel):
    username: str
    userid: str
    email: str
    problem_solved: bool
    solved_count: int
    solved_problem: List[Dict[str, str]]
    room_admin: bool

class RoomSchema(BaseModel):
    room_name: str
    problem_number: List[int]
    problem_count: int
    creator: Dict[str, str]
    created_at: datetime
    difficulty: str
    time_limit: int
    participants: List[Participant]

class RoomPostSchema(BaseModel):
    room_name: str
    problem_number: List[int]
    difficulty: str
    time_limit: int

def room_helper(room):
    room_data = {
        "id": str(room["_id"]),
        "room_name": room["room_name"],
        "problem_number": room["problem_number"],
        "problem_count": room["problem_count"],
        "creator": {
            "username": room["creator"]["username"],
            "email": room["creator"]["email"]
        },
        "created_at": room["created_at"],
        "difficulty": room["difficulty"],
        "time_limit": room["time_limit"],
        "participants": [
            {
                "username": participant["username"],
                "email": participant["email"],
                "problem_solved": participant["problem_solved"],
                "solved_count": participant["solved_count"],
                "solved_problem": participant["solved_problem"],
                "room_admin": participant["room_admin"]
            } for participant in room["participants"]
        ]
    }
    return room_data