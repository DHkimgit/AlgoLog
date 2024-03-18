from typing import Optional, Union, List
from pydantic import BaseModel, EmailStr, Field, validator

class UserSchema(BaseModel):
    name: str = Field(...)
    userid: str = Field(...)
    bojid: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    admin: bool = Field(...)

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

class UserPatchSchema(BaseModel):
    name: Union[str, None] = None
    userid: Union[str, None] = None
    bojid: Union[str, None] = None
    email: Union[EmailStr, None] = None 
    password: Union[str, None] = None
    admin: Union[bool, None] = None

    class config():
        schema_extra = {
            "example": {
                "UserName": "John Doe",
                "userid": "qwer1234",
                "bojid": "abcde",
                "Email": "8dnjfekf@gmail.com",
                "Password": "8dnjfekf!",
                "admin": True,
            }
        }

class UserResponseSchema(BaseModel):
    name: str = Field(...)
    userid: str = Field(...)
    bojid: str = Field(...)
    email: EmailStr = Field(...)
    admin: bool = Field(...)
    bojproblem: List[int] = Field(...)
    
    class config():
        schema_extra = {
            "example": {
                "UserName": "John Doe",
                "ServiceNumber": "22-76458458",
                "Email": "8dnjfekf@gmail.com",
                "Password": "8dnjfekf!",
                "AffiliatedUnit": "Ministy Of Military",
                "IsOfficer": True,
            }
        }

class UpdateUserModel(BaseModel):
    name: Optional[str]
    userid: Optional[str]
    bojid: Optional[str]
    email: Optional[EmailStr]
    password: Optional[str]
    admin: Optional[bool]

    class config():
        schema_extra = {
            "example": {
                "UserName": "John Doe",
                "id": "22-76458458",
                "Email": "8dnjfekf@gmail.com",
                "Password": "8dnjfekf!",
                "admin": True,
            }
        }

class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str

def ResponseModel(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }

def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}