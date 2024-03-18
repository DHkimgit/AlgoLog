from typing import Optional, Union, List
from pydantic import BaseModel, EmailStr, Field, validator

class TagSchema(BaseModel):
    tagname: str = Field(...)

class ProblemSchema(BaseModel):
    problemid: str = Field(...)
    title: str = Field(...)
    percentage: str = Field(...)
    tiers: str = Field(...)
    tags: List[str] = Field(...)
    tagid: List[str] = Field(...)

    class config():
        schema_extra = {
            "example": {
                "problemid": "6588",
                "title": "골드바흐 추측",
                "percentage": "69.343%",
                "tags": [
                    "수학", "구현"
                    ],
                "tagid": [
                    "631f0b5101819b3e885d81b7",
                    "658f0b4851814e3e887d81b8"
                ]
            }
        }