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



@router.get('/all')
def get_all():
    users =User.find({})
    user_list = [ userResponseEntity(user) for user in users ]
    return {"status": "success", "user": user_list}


@router.post('/makeVaildTrue')
def make_vaild_true():
    users = User.find({})
    for user in users:
        User.find_one_and_update({"email": user['email']}, {
            "$set": {"verified": True, "updated_at": datetime.utcnow()}})


