import json
from .user_schema import UserSchema
from models import User
from sqlalchemy.orm import Session
import models


def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.user_id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: UserSchema):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    # Delete associated empty_time records
    db.query(models.EmptyTime).filter(
        models.EmptyTime.user_id == user_id).delete()
    # Now delete the user
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db.delete(db_user)
    db.commit()
    return db_user


def authenticate_user(db: Session, user_id: str, user_pw: str):
    db_user = db.query(User).filter(
        User.user_id == user_id).first()
    if db_user and db_user.user_pw == user_pw:
        return db_user
    return None


def get_overlapping_users(db: Session, user_id: int, day: str):
    target_user = db.query(User).filter(
        User.id == user_id).first()
    if not target_user:
        return None  # or raise an exception

    # Assuming empty_times is a list of dict with day and period keys
    target_periods = day
    for et in json.loads(target_user.empty_times):
        if et['day'] in days:
            target_periods[et['day']].append(et['period'])

    overlapping_users = db.query(User).filter(
        User.id != user_id,
        User.empty_times.op('@>')(json.dumps(target_periods))
    ).all()

    return overlapping_users
