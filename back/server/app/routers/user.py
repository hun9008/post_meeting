from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.userSerializers import userResponseEntity
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from app.database import User
from datetime import datetime, timedelta
from .. import schemas, oauth2
from bson.objectid import ObjectId
import logging
from app.oauth2 import AuthJWT
import random
from app import utils


logger = logging.getLogger("main")
router = APIRouter()


@router.get("/me/{user_id}")
def get_me(user_id: str, Authorize: AuthJWT = Depends()):
    user = userResponseEntity(User.find_one({"_id": ObjectId(str(user_id))}))
    return {"status": "success", "user": user}


@router.get("/all")
def get_all():
    users = User.find({})
    logging.warning(f"=====================++{users}")
    user_list = [userResponseEntity(user) for user in users]
    return {"status": "success", "user": user_list}


@router.post("/makeVaildTrue")
def make_vaild_true():
    users = User.find({})
    for user in users:
        User.find_one_and_update(
            {"email": user["email"]},
            {"$set": {"verified": True, "updated_at": datetime.utcnow()}},
        )


@router.post("/addall/info")
def add_column(col: str, value: str):
    users = User.find({})
    if value == "list":
        User.update_many(
            {},
            {
                "$set": {
                    col: [],
                }
            },
        )
    else:
        User.update_many(
            {},
            {
                "$set": {
                    col: "",
                }
            },
        )
    return {"value": "success"}


@router.post("/removeall/info")
def remove_cloumn(col: str):
    users = User.find({})
    User.update_many(
        {},
        {
            "$unset": {
                col: True,
            }
        },
    )
    return {"value": "success"}


@router.post("/makeUser")
def make_user(payload: schemas.CreateUserSchema):
    new_user = schemas.UserBaseSchema(email=payload.email, password="@")
    insert_result = User.insert_one(new_user.dict())
    User.find_one_and_update(
        {"_id": insert_result.inserted_id},
        {
            "$set": {
                "verified": True,
                "updated_at": datetime.utcnow(),
            }
        },
    )
    new_posit = schemas.PostitSchema(
        x=(random.random() * 3001) + 200,
        y=(random.random() * 3001) + 50,
        user_id=str(insert_result.inserted_id),
        sex=payload.sex,
        hobby=payload.hobby,
        mbti=payload.mbti,
        name=payload.name,
        socialID=payload.socialID,
        emogi=payload.emogi,
        height=payload.height,
        militaryService=payload.militaryService,
        bodyType=payload.bodyType,
        eyelid=payload.eyelid,
        fashion=payload.fashion,
    )
    User.find_one_and_update(
        {"email": payload.email.lower()},
        {
            "$set": {
                "password": utils.hash_password(payload.password),
                "role": payload.role,
                "name": payload.name,
                "sex": payload.sex,
                "postit": new_posit.__dict__,
                "send_like": [],
                "recive_like": [],
                "chatRoom": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            }
        },
    )
    return {"status": "success"}
