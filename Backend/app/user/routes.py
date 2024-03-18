from fastapi import APIRouter, Body, HTTPException, status, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from app.user.database import (
    add_user,
    retrieve_users,
    retrieve_user,
    update_user,
    delete_user,
    check_out_existing_user,
    retrieve_users_forgrid,
    retrieve_user_nohelper,
    get_current_active_user,
    get_current_user,
    get_current_user_bojdata
)
from app.user.models import (
    ErrorResponseModel,
    ResponseModel,
    UserSchema,
    UpdateUserModel,
    UserResponseSchema,
    UserPatchSchema
)

from app.user.auth import (
    get_hashed_password,
    verify_password
)

from app.crawl.database import(
    add_problem_data,
    add_tag_data,
    retrive_tag_data,
    retrive_problem_data
)

from app.crawl.logic import crawl_solved_problem_number

router = APIRouter()

@router.post("/", response_description="User data added into the database")
async def add_student_data(user: UserSchema = Body(...)):
    users = jsonable_encoder(user)

    # 데이터베이스에서 이미 가입된 사용자인지 확인
    check_user = await check_out_existing_user(users["userid"])
    if check_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User id already exist"
        )

    # 입력된 비밀번호 암호화
    users["password"] = get_hashed_password(users["password"])

    # 백준 온라인 저지에서 사용자가 푼 문제들의 리스트를 확인 (문제 번호가 저장된 배열을 반환)
    user_boj_solved_problem = await crawl_solved_problem_number(users["bojid"])

    # 데이터베이스에 저장될 유저 데이터에 사용자가 푼 문제 리스트를 추가
    users["bojproblem"] = user_boj_solved_problem

    # 데이터베이스에 사용자가 푼 문제들의 정보를 저장(시간 소요)
    for i in range(len(user_boj_solved_problem)):
        k = await add_problem_data(user_boj_solved_problem[i])

    # 데이터베이스 유저 테이블에 사용자의 데이터 추가
    new_user = await add_user(users)
    
    return ResponseModel(new_user, "User added successfully.")

@router.get("/", response_description="Users retrieved")
async def get_users():
    users = await retrieve_users()
    if users:
        return users
    return ResponseModel(users, "Empty list returned")

@router.get("/problems")
async def get_user_problems(current_user_bojdata: UserResponseSchema = Depends(get_current_user_bojdata)):
    print(current_user_bojdata)
    result_lists = []
    for i in range(len(current_user_bojdata)):
        problem_data = await retrive_problem_data(current_user_bojdata[i])
        result_lists.append(problem_data)
    
    return result_lists

@router.get("/grid", response_description="Users retrieved_helpme")
async def get_users():
    users = await retrieve_users_forgrid()
    if users:
        return users
    return ResponseModel(users, "Empty list returned")

@router.get("/{id}", response_description="User data retrieved")
async def get_user_data(id):
    user = await retrieve_user(id)
    if user:
        return ResponseModel(user, "User data retrieved successfully")
    return ErrorResponseModel("An error occurred.", 404, "User doesn't exist.")

@router.put("/{id}", response_model=UserSchema)
async def update_user_data(id: str, req: UpdateUserModel = Body(...)):
    req = {k: v for k, v in req.dict().items() if v is not None}
    updated_user = await update_user(id, req)
    if updated_user:
        return ResponseModel(
            "User with ID: {} name update is successful".format(id),
            "User name updated successfully",
        )
    return ErrorResponseModel(
        "An error occurred",
        404,
        "There was an error updating the user data.",
    )

@router.patch("/{id}", response_model=UserPatchSchema)
async def patch_user_data(id: str, item: UserPatchSchema):
    stored_item_data = await retrieve_user_nohelper(id)
    stored_item_model = UserSchema(**stored_item_data)
    update_data = item.dict(exclude_unset=True)
    updated_item = stored_item_model.copy(update=update_data)
    updated_item_json = jsonable_encoder(updated_item)
    updated_user = await update_user(id, updated_item_json)
    if updated_user:
        return ResponseModel(
            "User with ID: {} name update is successful".format(id),
            "User name updated successfully",
        )
    return ErrorResponseModel(
        "An error occurred",
        404,
        "There was an error updating the user data.",
    )

@router.delete("/{id}", response_description="User data deleted from the database")
async def delete_user_data(id: str):
    deleted_user = await delete_user(id)
    if deleted_user:
        return ResponseModel(
            "User with ID: {} removed".format(id), "User deleted successfully"
        )
    else:
        return ErrorResponseModel(
        "An error occurred", 404, "User with id {0} doesn't exist".format(id)
        )

