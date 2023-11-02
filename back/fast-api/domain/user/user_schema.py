from pydantic import BaseModel
from typing import List, Optional


# class EmptyTimeSchema(BaseModel):
#     user_id: int
#     weekday: str  # e.g., 'Monday'
#     periods: List[str]  # List of periods e.g., ['A', 'B', 'C']


#     class Config:
#         orm_mode = True
class LoginUser(BaseModel):
    user_id: str
    user_pw: str


class InputUser(BaseModel):
    user_id: str
    user_pw: str
    user_email:str
    user_name:str


class CreateUser(BaseModel):
    user_id: str
    user_pw: str
    user_name:str



    class Config:
        from_attributes = True


class UserSchema(BaseModel):
    id: int
    user_id: str
    user_pw: str

    class Config:
        from_attributes = True


# class UserSchema(CreateUser):
#     id: int
#     # empty_times: List[EmptyTimeSchema]  # Updated to use EmptyTimeSchema

#     class Config:
#         orm_mode = True
