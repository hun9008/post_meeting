from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.userSerializers import userResponseEntity
from app.serializers.userSerializers import userEntity
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from app.database import User
from app.oauth2 import AuthJWT
from datetime import datetime, timedelta
from .. import schemas, oauth2
import logging

router = APIRouter()


@router.post("/sendlike/{sender_id}/{receiver_id}")
def send_like(sender_id: str, receiver_id: str):

    sender = User.find_one({"_id": ObjectId(sender_id)})
    receiver = User.find_one({"_id": ObjectId(receiver_id)})
    if not sender or not receiver:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        User.find_one_and_update(
            {"_id": ObjectId(sender_id)},
            {"$push": {"send_like": receiver_id}},
        )

        User.find_one_and_update(
            {"_id": ObjectId(receiver_id)},
            {"$push": {"recive_like": sender_id}},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to update like information: {str(e)}"
        )
    return "success"


@router.post("/removelike/{sender_id}/{receiver_id}")
def remove_like(sender_id: str, receiver_id: str):

    sender = User.find_one({"_id": ObjectId(sender_id)})
    receiver = User.find_one({"_id": ObjectId(receiver_id)})
    if not sender or not receiver:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        User.find_one_and_update(
            {"_id": ObjectId(sender_id)},
            {"$pull": {"send_like": receiver_id}},
        )

        User.find_one_and_update(
            {"_id": ObjectId(receiver_id)},
            {"$pull": {"recive_like": sender_id}},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to update like information: {str(e)}"
        )
    return "success"


@router.get("/getlike/{user_id}")
def getlike(user_id: str, Authorize: AuthJWT = Depends()):
    user = User.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "status": "success",
        "send_like": user["send_like"],
        "recive_like": user["recive_like"],
    }
