from fastapi import APIRouter, Body, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from app.comment.database import (
    add_comment,
    get_comment,
    get_comment_page_data
)

from app.user.models import (
    TokenSchema,
    UserSchema,
    UserResponseSchema
)

from app.comment.models import (
    CommentAddSchema,
)

from app.user.database import (
    check_out_existing_user,
    retrieve_user,
    retrieve_user_id,
    get_current_active_user,
    get_current_user
)

from app.crawl.database import (
    retrive_problem_data,
    check_problem_data
)

router = APIRouter()

@router.post("/{problem_id}", response_description="Add comment data")
async def add_comment_data(problem_id:int, comment: CommentAddSchema = Body(...), current_user: UserResponseSchema = Depends(get_current_active_user)):
    comment = jsonable_encoder(comment)
    userid = current_user['_id']
    comment['userid'] = userid
    check_problem = await check_problem_data(problem_id)
    if check_problem == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Problem data dosen't exist"
        )

    findid = await retrive_problem_data(problem_id)
    problemid = findid["_id"]
    comment['problemid'] = problemid
    new_comment = await add_comment(comment)
    
    return new_comment

@router.get("/{problem_id}", response_description="Get comment data")
async def get_comment_data(problem_id:int):
    findid = await retrive_problem_data(problem_id)
    problemid = findid["_id"]
    result = await get_comment(problemid)
    return result

@router.get("/page/{problem_id}", response_description="Get comment page data")
async def get_comment_data(problem_id:int):
    findid = await retrive_problem_data(problem_id)
    problemid = findid["_id"]
    print(problemid)
    result = await get_comment_page_data(problemid)
    return result