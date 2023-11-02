from datetime import datetime
from pydantic import BaseModel, EmailStr, Json ,constr
from typing import Optional

class PostitSchema(BaseModel):
    x:float
    y:float
    text: str

class UserBaseSchema(BaseModel):
    name: Optional[str]
    email: str
    role :Optional[str]
    postit: Optional[PostitSchema]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_contribute = True


class CreateUserSchema(UserBaseSchema):
    password: constr(min_length=8)
    passwordConfirm: str
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
