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


@router.post("/addrole/info")
def add_column():

    User.update_many(
        {},
        {
            "$set": {
                "postit": {"role": "user"},
            }
        },
    )
    return {"value": "success"}


@router.post("/addpostit/info")
def add_column():
    users = User.find({})
    for user in users:
        print(user)
        User.find_one_and_update(
            {"email": str(user["email"])},
            {
                "$set": {
                    "postit": make_random_post(user["_id"]),
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


@router.post("/remove/email")
def revise_user(payload: schemas.EmailSchema):
    User.delete_one({"email": payload.email.lower()})


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


def make_random_post(user_id: str):
    mbti = utils.MBTI
    sex = utils.SEX
    hobby = utils.HOBBY
    name = utils.NAME
    postit = (
        {
            "user_id": str(user_id),
            "x": (random.random() * 3001) + 200,
            "y": (random.random() * 3001) + 50,
            "name": random.choice(name),
            "mbti": random.choice(mbti),
            "hobby": random.sample(hobby, 3),
            "socialID": f"usertestmember{int(random.random() * 100000) + 1}",
            "emogi": int(random.random() * 10) + 1,
            "height": 190,
            "militaryService": True,
            "bodyType": "thin",
            "eyelid": True,
            "fashion": ["street"],
            "role": "students",
            "sex": random.choice(sex),
        },
    )
    return postit


@router.post("/makeUser")
def make_random_user(payload: schemas.CreateUserSchema):
    new_user = payload.__dict__
    new_user["password"] = utils.hash_password(payload.password)
    new_user["created_at"] = datetime.utcnow()
    new_user["updated_at"] = datetime.utcnow()
    new_user["verified"] = True
    new_user = schemas.UserBaseSchema(**new_user)
    insert_result = User.insert_one(new_user.dict())
    User.find_one_and_update(
        {"_id": insert_result.inserted_id},
        {
            "$set": {
                "postit.user_id": str(insert_result.inserted_id),
                "postit.x": (random.random() * 3001) + 200,
                "postit.y": (random.random() * 3001) + 50,
            }
        },
    )

    return {"status": "success"}


def create_postit(payload: schemas.PostitSchema, user_id: str):
    new_postit = payload
    new_postit.x = (random.random() * 3001) + 200
    new_postit.y = (random.random() * 3001) + 50
    new_postit.user_id = user_id
    return new_postit.__dict__


def make_user(payload: schemas.RegisterUserSchema):
    new_user = schemas.RegisterUserSchema(**(payload.__dict__))
    new_user.password = utils.hash_password(new_user.password)
    result = User.find_one({"email": new_user.email.lower()})
    new_user.postit = create_postit(payload.postit, str(result["_id"]))

    print(new_user.__dict__)
    result = User.find_one_and_update(
        {"_id": result["_id"]},
        {
            "$set": {
                **(new_user.__dict__),
            }
        },
    )


@router.post("/makepassword")
def make_password():
    User.update_many(
        {},
        {
            "$set": {
                "password": utils.hash_password("4321qwer"),
            }
        },
    )
