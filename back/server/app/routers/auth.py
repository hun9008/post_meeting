from datetime import datetime, timedelta
import hashlib
from random import randbytes
from bson.objectid import ObjectId
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from pydantic import EmailStr
import random
from app import oauth2
from app.database import User
from app.email import Email
from app.serializers.userSerializers import userEntity
from .. import schemas, utils
from app.oauth2 import AuthJWT
from ..config import settings
from jinja2 import Environment, select_autoescape, PackageLoader
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from app.routers.user import make_user

env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(["html", "xml"]),
)


router = APIRouter()
ACCESS_TOKEN_EXPIRES_IN = settings.ACCESS_TOKEN_EXPIRES_IN
REFRESH_TOKEN_EXPIRES_IN = settings.REFRESH_TOKEN_EXPIRES_IN


@router.post("/register/email", status_code=status.HTTP_201_CREATED)
async def send_email(emailmodel: schemas.EmailSchema, request: Request):
    email = emailmodel.email
    user = User.find_one({"email": email.lower()})
    if user:
        User.delete_one({"email": email})
    token = randbytes(10)
    hashedCode = hashlib.sha256()
    hashedCode.update(token)
    verification_code = hashedCode.hexdigest()
    new_user = schemas.EmailRegisterSchema(
        email=email,
        verification_code=verification_code,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    insert_result = User.insert_one(new_user.dict())
    User.find_one_and_update(
        {"_id": insert_result.inserted_id},
        {
            "$set": {
                "verification_code": verification_code,
                "verified": False,
                "updated_at": datetime.utcnow(),
            }
        },
    )
    url = f"{settings.SERERVER_URL}/api/auth/verifyemail/{token.hex()}"
    try:
        await Email({"name": email}, url, [EmailStr(email)]).sendVerificationCode()
    except Exception as error:
        Delete_result = User.delete_one({"_id": insert_result.inserted_id})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"There was an error sending email {error}",
        )
    return {
        "status": "success",
        "message": "Verification token successfully sent to your email",
    }


@router.post("/register/vaildcheck", status_code=status.HTTP_201_CREATED)
def vaild_check(emailmodel: schemas.EmailSchema, request: Request):
    email = emailmodel.email
    user = User.find_one({"email": email.lower()})
    if user:
        if user["verified"]:
            return {"detatil": "suscces"}
        else:
            return {"detail": "email was not varified"}
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="there are no email to varify"
        )


@router.post("/register/final", status_code=status.HTTP_201_CREATED)
def create_user(payload: schemas.RegisterUserSchema, request: Request):
    user = User.find_one({"email": payload.email.lower()})
    # if payload.password != payload.passwordConfirm:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST, detail='Passwords do not match')
    # del payload.passwordConfirm
    #  Hash the password
    make_user(payload)

    return {"user": user["email"], "detail": "resgister success"}


@router.post("/deleteuser")
def delete_user(response: Response, Authorize: AuthJWT = Depends()):
    try:
        user_id = Authorize.get_jwt_subject()
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not refresh access token",
            )
        User.delete_one({"_id": ObjectId(str(user_id))})
        return {"status": "success"}
    except Exception as e:
        error = e.__class__.__name__
        if error == "MissingTokenError":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please login first",
            )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)


@router.post("/reviseinfo")
def revise_user(payload: schemas.ReviseUserSchema, Authorize: AuthJWT = Depends()):
    user_id = Authorize.get_jwt_subject()
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not refresh access token",
        )
    User.find_one_and_update(
        {"_id": ObjectId(str(user_id))},
        {
            "$set": {
                "postit.name": payload.name,
                "postit.militalyService": payload.militaryService,
                "postit.height": payload.height,
                "postit.body": payload.body,
                "postiteyelid": payload.eyelid,
                "postitfashion": payload.fashion,
                "postithobby": payload.hobby,
                "postitsocialID": payload.socialID,
                "postitemogi": payload.emogi,
            }
        },
    )


@router.post("/login")
def login(
    payload: schemas.LoginUserSchema, response: Response, Authorize: AuthJWT = Depends()
):
    # Check if the user exist

    db_user = User.find_one({"email": payload.email.lower()})
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Email or Password",
        )
    user = userEntity(db_user)

    # Check if user verified his email
    # if not user["verified"]:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Please verify your email address",
    #     )

    # Check if the password is valid
    if not user["password"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please sign up first",
        )
    if not utils.verify_password(payload.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Email or Password",
        )

    # Create access token
    access_token = Authorize.create_access_token(
        subject=str(user["id"]), expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN)
    )

    # Create refresh token
    refresh_token = Authorize.create_refresh_token(
        subject=str(user["id"]),
        expires_time=timedelta(minutes=REFRESH_TOKEN_EXPIRES_IN),
    )

    # Store refresh and access tokens in cookie
    response.set_cookie(
        "access_token",
        access_token,
        ACCESS_TOKEN_EXPIRES_IN * 60,
        ACCESS_TOKEN_EXPIRES_IN * 60,
        "/",
        None,
        False,
        True,
        "lax",
    )
    response.set_cookie(
        "refresh_token",
        refresh_token,
        REFRESH_TOKEN_EXPIRES_IN * 60,
        REFRESH_TOKEN_EXPIRES_IN * 60,
        "/",
        None,
        False,
        True,
        "lax",
    )
    response.set_cookie(
        "logged_in",
        "True",
        ACCESS_TOKEN_EXPIRES_IN * 60,
        ACCESS_TOKEN_EXPIRES_IN * 60,
        "/",
        None,
        False,
        False,
        "lax",
    )

    # Send both access
    return {
        "status": "success",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user_id": str(user["id"]),
    }


@router.get("/refresh")
def refresh_token(response: Response, Authorize: AuthJWT = Depends()):
    try:
        Authorize.jwt_refresh_token_required()

        user_id = Authorize.get_jwt_subject()
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not refresh access token",
            )
        user = userEntity(User.find_one({"_id": ObjectId(str(user_id))}))
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The user belonging to this token no logger exist",
            )
        access_token = Authorize.create_access_token(
            subject=str(user["id"]),
            expires_time=timedelta(minutes=ACCESS_TOKEN_EXPIRES_IN),
        )
    except Exception as e:
        error = e.__class__.__name__
        if error == "MissingTokenError":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide refresh token",
            )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error)

    response.set_cookie(
        "access_token",
        access_token,
        ACCESS_TOKEN_EXPIRES_IN * 60,
        ACCESS_TOKEN_EXPIRES_IN * 60,
        "/",
        None,
        False,
        True,
        "lax",
    )
    response.set_cookie(
        "logged_in",
        "True",
        ACCESS_TOKEN_EXPIRES_IN * 60,
        ACCESS_TOKEN_EXPIRES_IN * 60,
        "/",
        None,
        False,
        False,
        "lax",
    )
    return {"access_token": access_token}


@router.post("/find_password_email")
@router.post("/find_password")
def find_password(payload: schemas.LoginUserSchema, request: Request):
    email = payload.email
    user = User.find_one({"email": email.lower()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect Email or Password",
        )
    User.find_one_and_update(
        {"email": payload.email.lower()},
        {
            "$set": {
                "password": utils.hash_password(payload.password),
            }
        },
    )
    return {"status": "success"}


@router.get("/logout", status_code=status.HTTP_200_OK)
def logout(
    response: Response,
    Authorize: AuthJWT = Depends(),
):
    Authorize.unset_jwt_cookies()
    response.set_cookie("logged_in", "", -1)
    return {"status": "success"}


@router.get("/reset_password/{token}")
def reset_password():
    pass


@router.get("/test", response_class=HTMLResponse)
def test_html(request: Request):
    templateEnv = Environment(loader=PackageLoader("app", "templates"))
    template = templateEnv.get_template("success.html")
    template = template.render()
    return template


@router.get("/verifyemail/{token}", response_class=HTMLResponse)
def verify_me(token: str, request: Request):
    templateEnv = Environment(loader=PackageLoader("app", "templates"))
    template = templateEnv.get_template("success.html")
    template = template.render()
    hashedCode = hashlib.sha256()
    hashedCode.update(bytes.fromhex(token))
    verification_code = hashedCode.hexdigest()
    result = User.find_one_and_update(
        {"verification_code": verification_code},
        {
            "$set": {
                "verification_code": None,
                "verified": True,
                "updated_at": datetime.utcnow(),
            }
        },
        new=True,
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid verification code or account already verified",
        )
    return template
