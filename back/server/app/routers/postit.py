from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.userSerializers import userResponseEntity
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException
from app.database import User
from datetime import datetime, timedelta
from .. import schemas, oauth2

router = APIRouter()


@router.post('/make')
def post_postit(payload: schemas.UserBaseSchema ,request: Request = Depends(oauth2.require_user)):
    User.find_one_and_update({"email": payload.email}, {
            "$set": {"postit": payload.postit.__dict__, "updated_at": datetime.utcnow()}})

@router.post('/remove')
def post_remove(payload: schemas.UserBaseSchema, request: Request =Depends(oauth2.require_user)):
    User.find_one_and_update({"email": payload.email}, {
            "$set": {"postit": [], "updated_at": datetime.utcnow()}})

@router.get('/all',response_model=schemas.PostitListSchema)
def get_postit_all():
    users =User.find({})
    postit_list = [ userResponseEntity(user)['postit'] for user in users if userResponseEntity(user)['postit'] is not None]
    return {"status": "success", "postits": postit_list}