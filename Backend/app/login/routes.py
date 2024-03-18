from fastapi import FastAPI, status, HTTPException, Depends, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse

from app.user.models import (
    TokenSchema,
    UserSchema,
    UserResponseSchema
)
from app.user.auth import (
    get_hashed_password,
    create_access_token,
    create_refresh_token,
    verify_password
)
from app.user.database import (
    check_out_existing_user,
    retrieve_user,
    retrieve_user_id,
    get_current_active_user,
    get_current_user
)

router = APIRouter()

# https://www.freecodecamp.org/news/how-to-add-jwt-authentication-in-fastapi/
@router.post('/', summary="Create access and refresh tokens for user", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    usercheck = await check_out_existing_user(form_data.username)
    print(usercheck)
    if usercheck is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect ID"
        )

    user = await retrieve_user_id(form_data.username)
    print(user)
    hashed_pass = user['password']

    if not verify_password(form_data.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    return {
        "access_token": create_access_token(user['userid']),
        "refresh_token": create_refresh_token(user['userid']),
    }

@router.get("/me")
async def read_users_me(current_user: UserResponseSchema = Depends(get_current_active_user)):
    print(current_user)
    return current_user

@router.get("/me/{token}")
async def get_user(token: str):
    user = await get_current_user(token)
    return user