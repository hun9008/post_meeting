from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import user_crud, user_schema
from database import get_db
from typing import List
from ..crowler.main import run_crowler
from ..email.send_email import send_email_async, send_email_background
from fastapi import FastAPI, BackgroundTasks

router = APIRouter()


@router.get('/send-email/asynchronous')
async def send_email_asynchronous(email name):
    await send_email_async('Hello World',email,{'title':'Hello World','name': name})
    return 'Success'

@router.get('/send-email/backgroundtasks')
def send_email_backgroundtasks(background_tasks: BackgroundTasks):
    send_email_background(background_tasks, 'Hello World',
    'sdfg8931@ajou.ac.kr', {'title': 'Hello World', 'name': 'John Doe'})
    return 'Success'




@router.post('/register', status_code=status.HTTP_201_CREATED)
async def create_user(payload: schemas.CreateUserSchema, request: Request):
    # Check if user already exist
    user = User.find_one({'email': payload.email.lower()})
    if user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail='Account already exist')
    # Compare password and passwordConfirm
    if payload.password != payload.passwordConfirm:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Passwords do not match')
    #  Hash the password
    payload.password = utils.hash_password(payload.password)
    del payload.passwordConfirm
    payload.role = 'user'
    payload.verified = False
    payload.email = payload.email.lower()
    payload.created_at = datetime.utcnow()
    payload.updated_at = payload.created_at

    result = User.insert_one(payload.dict())
    new_user = User.find_one({'_id': result.inserted_id})
    try:
        token = randbytes(10)
        hashedCode = hashlib.sha256()
        hashedCode.update(token)
        verification_code = hashedCode.hexdigest()
        User.find_one_and_update({"_id": result.inserted_id}, {
            "$set": {"verification_code": verification_code, "updated_at": datetime.utcnow()}})

        url = f"{request.url.scheme}://{request.client.host}:{request.url.port}/api/auth/verifyemail/{token.hex()}"
        await Email(userEntity(new_user), url, [EmailStr(payload.email)]).sendVerificationCode()
    except Exception as error:
        User.find_one_and_update({"_id": result.inserted_id}, {
            "$set": {"verification_code": None, "updated_at": datetime.utcnow()}})
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='There was an error sending email')
    return {'status': 'success', 'message': 'Verification token successfully sent to your email'}

@router.get('/verifyemail/{token}')
def verify_me(token: str):
    hashedCode = hashlib.sha256()
    hashedCode.update(bytes.fromhex(token))
    verification_code = hashedCode.hexdigest()
    result = User.find_one_and_update({"verification_code": verification_code}, {
        "$set": {"verification_code": None, "verified": True, "updated_at": datetime.utcnow()}}, new=True)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail='Invalid verification code or account already verified')
    return {
        "status": "success",
        "message": "Account verified successfully"
    }




@router.post("/register", response_model=user_schema.UserSchema)
def create_user(user: user_schema.InputUser, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id=user.user_id)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    new_user = user_schema.CreateUser(
        user_id=user.user_id,
        user_pw=user.user_pw,
    )

    db_user = user_crud.create_user(db, user=new_user)
    return db_user


@router.get("/users/", response_model=List[user_schema.UserSchema])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    users = user_crud.get_users(db, skip=skip, limit=limit)
    return users


@router.post("/login", response_model=user_schema.UserSchema)
def login_user(user: user_schema.LoginUser, db: Session = Depends(get_db)):
    db_user = user_crud.authenticate_user(
        db, user_id=user.user_id, user_pw=user.user_pw
    )
    if db_user is None:
        raise HTTPException(
            status_code=400, detail="Incorrect user ID or password")
    return db_user


@router.delete("/delete/{user_id}", response_model=user_schema.UserSchema)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = user_crud.delete_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/get/{user_id}", response_model=user_schema.UserSchema)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = user_crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.post("/overlapping-users/")
async def get_overlapping_users(user_id: int, day: str, db: Session = Depends(get_db)):
    overlapping_users = user_crud.get_overlapping_users(
        db, user_id=user_id, day=day)
    if overlapping_users is None:
        raise HTTPException(status_code=404, detail="User not found")
    return overlapping_users
