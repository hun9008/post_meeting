from sqlalchemy.orm import Session
import models
from . import emptytime_router, emptytime_schema
from typing import Dict, List
from ..user.user_schema import UserSchema


def create_empty_time(db: Session, user_id: int, weekday: str, periods: list):
    db_empty_time = models.EmptyTime(
        user_id=user_id, weekday=weekday, periods=periods)
    db.add(db_empty_time)
    db.commit()
    db.refresh(db_empty_time)
    return db_empty_time


def get_all_empty_times(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.EmptyTime).offset(skip).limit(limit).all()


def get_user_empty_times(db: Session, user_id: int):
    db_empty_times = db.query(models.EmptyTime).filter(
        models.EmptyTime.user_id == user_id).all()
    if db_empty_times is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_empty_times


def get_empty_times(db: Session, user_id: int):
    return db.query(models.EmptyTime).filter(models.EmptyTime.user_id == user_id).all()


def get_overlap_users_by_period(db: Session, user_id: int, weekday: str) -> Dict[str, List[UserSchema]]:
    user_empty_time = db.query(models.EmptyTime).filter(
        models.EmptyTime.user_id == user_id,
        models.EmptyTime.weekday == weekday
    ).first()

    if not user_empty_time:
        return {}

    response_data = {}
    for period in user_empty_time.periods:
        matching_empty_times = db.query(models.EmptyTime).filter(
            models.EmptyTime.weekday == weekday,
            # Assumes periods is a JSON array
            models.EmptyTime.periods.contains(period)
        ).all()

        user_ids = [
            empty_time.user_id for empty_time in matching_empty_times if empty_time.user_id != user_id]
        overlap_users = db.query(models.User).filter(
            models.User.id.in_(user_ids)).all()
        response_data[period] = [UserSchema.from_orm(
            user) for user in overlap_users]

    return response_data


def find_common_empty_times(db: Session, user_ids: List[str]) -> Dict[str, List[str]]:
    weekdays = ['월', '화', '수',
                '목', '금']  # Adjust as needed
    common_empty_times = {}

    for weekday in weekdays:
        user_empty_times = {
            user_id: db.query(models.EmptyTime).filter(
                models.EmptyTime.user_id == (db.query(models.User).filter(
                    models.User.user_id == user_id).first()).id,
                models.EmptyTime.weekday == weekday
            ).first()
            for user_id in user_ids
        }

        common_periods = set(
            user_empty_times[user_ids[0]].periods) if user_empty_times[user_ids[0]] else set()
        for user_id, empty_time in user_empty_times.items():
            if empty_time:
                common_periods.intersection_update(empty_time.periods)

        common_empty_times[weekday] = list(common_periods)

    return common_empty_times
