from datetime import datetime
from pydantic import BaseModel, EmailStr, Json ,constr
from typing import Optional

class PostitSchema(BaseModel):
    id: int
    x:float
    y:float
    content_mbti: str
    content_hobby: str
    content_insta: str

class EmailSchema(BaseModel):
    email:str


class UserBaseSchema(BaseModel):
    name: Optional[str]
    email: str
    role :Optional[str]
    postit: Optional[PostitSchema]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_contribute = True

class PostitListSchema(BaseModel):
    status: str
    postits: list[PostitSchema]

class CreateUserSchema(UserBaseSchema):
    password: constr(min_length=8)
    verified: bool = False


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class UserResponseSchema(UserBaseSchema):
    id: str
    pass


class UserResponse(BaseModel):
    status: str
    user: UserResponseSchema
