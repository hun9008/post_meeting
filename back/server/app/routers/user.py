from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.userSerializers import userResponseEntity
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from app.database import User
from datetime import datetime, timedelta
from .. import schemas, oauth2

router = APIRouter()


@router.get('/me', response_model=schemas.UserResponse)
def get_me(user_id: str = Depends(oauth2.require_user)):
    user = userResponseEntity(User.find_one({'_id': ObjectId(str(user_id))}))
    return {"status": "success", "user": user}

@router.post('/postit')
def post_postit(payload: schemas.UserBaseSchema ,request: Request = Depends(oauth2.require_user)):
    User.find_one_and_update({"email": payload.email}, {
            "$set": {"postit": payload.postit, "updated_at": datetime.utcnow()}})

@router.get('/all')
def get_all(user_id: str = Depends(oauth2.require_user)):
    users =User.find({})
    user_list = [ userResponseEntity(user) for user in users ]
    return {"status": "success", "user": user_list}