from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import user_crud, user_schema
from database import get_db
from typing import List
from ..crowler.main import run_crowler
# from ..emptytime.emptytime_crud import create_empty_time


router = APIRouter()


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
