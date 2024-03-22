import asyncio
from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from typing import Any, Dict, List, Optional
from app.serializers.userSerializers import userResponseEntity
from app.serializers.chatSerializers import (
    chatEntity,
    ChatRomeResponseEntity,
    ChatResponseEntity,
)
from app.serializers.userSerializers import userEntity
from fastapi import (
    APIRouter,
    Request,
    Response,
    status,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
)
from starlette.endpoints import WebSocketEndpoint
from app.database import User, ChatRoom
from datetime import datetime, timedelta
from .. import schemas, oauth2
import logging
import hashlib
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, select_autoescape, PackageLoader
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import time
from starlette.types import ASGIApp, Receive, Scope, Send
from bson.objectid import ObjectId
import logging

router = APIRouter()
# router.mount("/app", StaticFiles(directory="templates"), name="templates")
templates = Jinja2Templates(directory="../../templates")


env = Environment(
    loader=PackageLoader("app", "templates"),
    autoescape=select_autoescape(["html", "xml"]),
)

logging.basicConfig(
    filename="update_logs.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


@router.get("/client", response_class=HTMLResponse)
async def client(request: Request):
    # /templates/client.html파일을 response함
    return env.get_template("client.html").render(request=request)


# @router.websocket('/chat/{user_ids}')


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print(f"client connected : {websocket.client}")
    await websocket.accept()  # client의 websocket접속 허용
    await websocket.send_text(f"Welcome client : {websocket.client}")
    while True:
        data = await websocket.receive_text()  # client 메시지 수신대기
        print(f"message received : {data} from : {websocket.client}")
        await websocket.send_text(f"Message text was: {data}")  # client에 메시지 전달


CLIENTS = {}
import logging

# 1. logger 생성
logger = logging.getLogger("main")





@router.get("/remove")
def remove_all_chatrooms():
    ChatRoom.delete_many({})
    return {"status": "success"}


@router.get("/all")
def get_all_chatrooms():
    chatrooms = ChatRoom.find({})
    chatroom_list = [ChatRomeResponseEntity(chatroom) for chatroom in chatrooms]
    return {"status": "success", "chatrooms": chatroom_list}


log = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, websocket: WebSocket, user_id: str):
        del self.active_connections[user_id]

    async def check_connections(self, user_id: str):
        if user_id in self.active_connections.keys():
            return True
        else:
            return False

    async def send_personal_message(self, message: dict, user_id: str):
        try:
            if await self.check_connections(user_id):
                await self.active_connections[user_id].send_json(message)
            else:
                raise Exception("User is not connected.")
        except Exception as e:
            # Handle the exception here
            print(f"Error: {e}")

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_json(message)


manager = ConnectionManager()


@router.websocket("/chatroom/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    user = User.find_one({"_id": ObjectId(user_id)})
    chat_room = user["chatRoom"]
    chat_room_data = [ChatRoom.find_one({"room_name": key}) for key in chat_room]
    data = chat_room_data
    await manager.send_personal_message(
        {"value": [ChatRomeResponseEntity(c) for c in data]}, user_id
    )
    try:
        while True:
            data = await websocket.receive_json()
            # parshing
            sender = str(data["sender"])
            receiver = str(data["receiver"])
            text = data["text"]
            room_name = max(sender + receiver, receiver + sender)

            # append_or_message
            user = User.find_one({"_id": ObjectId(user_id)})
            chat_room = user["chatRoom"]
            chat_room_data = [
                ChatRoom.find_one({"room_name": key}) for key in chat_room
            ]
            data = chat_room_data
            chat = schemas.ChatSchema(
                chat_id=int(hashlib.sha256(text.encode("utf-8")).hexdigest(), 16)
                % 10**8,
                sender_id=sender,
                room_id=int(hashlib.sha256(room_name.encode("utf-8")).hexdigest(), 16)
                % 10**8,
                content=text,
                created_at=datetime.utcnow(),
            )
            if ChatRoom.find_one({"room_name": room_name}) is None:
                new_room = schemas.ChatRoomSchema(
                    room_id=int(
                        hashlib.sha256(room_name.encode("utf-8")).hexdigest(), 16
                    )
                    % 10**8,
                    room_name=room_name,
                    chat_list=[],
                )
                filter_criteria = {
                    "$or": [
                        {"_id": ObjectId(user_id)},
                        {"_id": ObjectId(receiver)},
                        # Add more conditions as needed
                    ]
                }
                result = User.update_many(
                    filter_criteria, {"$push": {"chatRoom": room_name}}
                )
                logging.warning(
                    f"Updated {result.modified_count} documents for room {room_name}"
                )
                ChatRoom.insert_one(new_room.dict())

            ChatRoom.update_one(
                {"room_name": room_name}, {"$push": {"chat_list": chat.dict()}}
            )

            await manager.send_personal_message(
                {"value": chatEntity(chat.dict())}, receiver
            )
            await manager.send_personal_message(
                {"value": chatEntity(chat.dict())}, user_id
            )
            # await manager.broadcast({"value": f"Client #{user_id} says: {data}"})
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        await manager.broadcast({"value": f"Client left#{user_id}"})


@router.post("/add/chatroom")
def create_chatroom(room_name: str, sender, reciver):
    filter_criteria = {
        "$or": [
            {"_id": ObjectId(sender)},
            {"_id": ObjectId(reciver)},
            # Add more conditions as needed
        ]
    }
    User.update_many(filter_criteria, {"$push": {"chatRoom": room_name}})
    return {"value": "success"}


@router.post("/addall/chatroom")
def create_chatroom():
    users = User.find({})
    User.update_many({}, {"$set": {"chatRoom": []}})
    return {"value": "success"}
