from pydantic import BaseModel
from typing import List, Optional


class RequestSchema(BaseModel):
    id: int
    weekday: str


class EmptyTimeBase(BaseModel):
    weekday: str  # e.g., '월'
    periods: List[str]  # List of periods e.g., ['A', 'B', 'C']


class EmptyTimeCreate(EmptyTimeBase):
    pass


class EmptyTime(EmptyTimeBase):
    user_id: int

    class Config:
        from_attributes = True
