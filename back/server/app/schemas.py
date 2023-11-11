from datetime import datetime
from pydantic import BaseModel, EmailStr, Json ,constr
from typing import Optional ,Union ,List

class PostitSchema(BaseModel):
    id: int
    x:float
    y:float
    content_mbti: str
    content_hobby: str
    content_insta: str
    sex: str

class PostitDeleteSchema(BaseModel):
    id: int

class EmailSchema(BaseModel):
    email:str


class UserBaseSchema(BaseModel):
    name: Optional[str]
    email: str
    role :Optional[str]
    sex: Optional[str]
    postit: Optional[PostitSchema]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_contribute = True

class PostitListSchema(BaseModel):
    status: str
    postits: List[Optional[PostitSchema]]

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
