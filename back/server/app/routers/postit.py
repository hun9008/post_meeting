from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.userSerializers import userResponseEntity
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from app.database import User
from datetime import datetime, timedelta
from .. import schemas, oauth2
import logging
router = APIRouter()


@router.post('/make')
def post_postit(payload: schemas.UserBaseSchema):
    user = User.find_one({"email": payload.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        User.find_one_and_update({"email": payload.email}, {
                "$set": {"postit": payload.postit.__dict__, "updated_at": datetime.utcnow()}})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update postit information: {str(e)}")

@router.post('/remove')
def post_remove(payload: schemas.PostitDeleteSchema, request:Request = Depends(oauth2.require_user)):
    User.find_one_and_update({"postit.id": payload.id}, {
            "$set": {"postit": None ,"updated_at": datetime.utcnow()}})

@router.get('/all')
def get_postit_all():
    users = User.find({})
    postit_list = [userResponseEntity(user)['postit'] for user in users if userResponseEntity(user)['postit'] is not None]
    return {"status": "success", "postits": postit_list}