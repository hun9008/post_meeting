from datetime import datetime
from pydantic import BaseModel, EmailStr, Json, constr
from typing import Optional, Union, List


class PostitSchema(BaseModel):
    x: int
    y: int
    user_id: str
    name: str
    mbti: str
    hobby: List[str]
    socialID: str
    emogi: int
    height: Optional[str]
    militaryService: Optional[bool]
    bodyType: str
    eyelid: bool
    fashion: List[str]
    role: str
    sex: str


class PostitDeleteSchema(BaseModel):
    id: int


class EmailSchema(BaseModel):
    email: str


class EmailRegisterSchema(EmailSchema):
    verified: bool = False
    verification_code: str = ""
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


class ChatSchema(BaseModel):
    chat_id: int
    sender_id: str
    content: str
    created_at: Optional[datetime]


class ChatRoomSchema(BaseModel):
    room_id: int
    room_name: str
    chat_list: List[Optional[ChatSchema]]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_contribute = True


class UserBaseSchema(EmailRegisterSchema):
    password: str
    postit: PostitSchema
    chatRoom: List[Optional[str]] = []
    send_like: List[Optional[str]] = []
    recive_like: List[Optional[str]] = []

    class Config:
        from_contribute = True


class PostitMakeSchema(BaseModel):
    postit: Optional[PostitSchema]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    class Config:
        from_contribute = True


class PostitMoveSchema(BaseModel):
    user_id: str
    x: float
    y: float


class PostitRemoveSchema(BaseModel):
    user_id: str


class PostitListSchema(BaseModel):
    status: str
    postits: List[Optional[PostitSchema]]


class ReviseUserSchema(BaseModel):
    email: Optional[str]
    hobby: List[str] = []
    fashion: List[str] = []
    mbti: str
    socialID: str
    emogi: int
    height: Optional[str]
    militaryService: Optional[bool]
    bodyType: str
    eyelid: bool


class CreateUserSchema(UserBaseSchema):
    password: constr(min_length=8)
    verified: bool = False


class RegisterUserSchema(UserBaseSchema):
    email: str
    password: str
    postit: PostitSchema
    verified: bool = True
    chatRoom: List[Optional[str]] = ["string"]
    send_like: List[Optional[str]] = ["string"]
    recive_like: List[Optional[str]] = ["string"]


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class UserResponseSchema(UserBaseSchema):
    id: str
    pass


class UserResponse(BaseModel):
    status: str
    user: UserResponseSchema
