from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from . import emptytime_crud, emptytime_schema
from database import get_db
from typing import Dict, List

router = APIRouter()


@router.post("/users/{user_id}/empty_time/")
def create_user_empty_time(
    user_id: int, weekday: str, periods: list, db: Session = Depends(get_db)
):
    return emptytime_crud.create_empty_time(
        db=db, user_id=user_id, weekday=weekday, periods=periods
    )


@router.get("/empty-times", response_model=List[emptytime_schema.EmptyTime])
def read_all_empty_times(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    empty_times = emptytime_crud.get_all_empty_times(db, skip=skip, limit=limit)
    return empty_times


@router.get(
    "/users/{user_id}/empty_times", response_model=List[emptytime_schema.EmptyTime]
)
def read_user_empty_times(user_id: int, db: Session = Depends(get_db)):
    db_empty_times = emptytime_crud.get_empty_times(db, user_id=user_id)
    if db_empty_times is None:
        raise HTTPException(status_code=404, detail="Empty times not found")
    return db_empty_times


@router.post("/find_overlap_users/")
def find_overlap_users(
    request: emptytime_schema.RequestSchema, db: Session = Depends(get_db)
):
    overlap_users_by_period = emptytime_crud.get_overlap_users_by_period(
        db, user_id=request.id, weekday=request.weekday
    )
    return overlap_users_by_period


@router.post("/find_common_empty_times/", response_model=Dict[str, List[str]])
def find_common_empty_times(user_ids: List[str], db: Session = Depends(get_db)):
    return emptytime_crud.find_common_empty_times(db, user_ids)
