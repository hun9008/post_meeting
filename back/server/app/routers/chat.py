import asyncio
from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from typing import Any, Dict, List, Optional
from app.serializers.userSerializers import userResponseEntity ,ChatRomeResponseEntity ,ChatResponseEntity
from app.serializers.userSerializers import userEntity
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException ,WebSocket ,WebSocketDisconnect
from starlette.endpoints import WebSocketEndpoint
from app.database import User ,ChatRoom
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


router = APIRouter()
# router.mount("/app", StaticFiles(directory="templates"), name="templates")
templates = Jinja2Templates(directory="../../templates")


env = Environment(
    loader=PackageLoader('app', 'templates'),
    autoescape=select_autoescape(['html', 'xml'])
)

@router.get("/client" ,response_class=HTMLResponse)
async def client(request: Request):
    # /templates/client.html파일을 response함
    return env.get_template('client.html').render(request=request)

# @router.websocket('/chat/{user_ids}')

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print(f"client connected : {websocket.client}")
    await websocket.accept() # client의 websocket접속 허용
    await websocket.send_text(f"Welcome client : {websocket.client}")
    while True:
        data = await websocket.receive_text()  # client 메시지 수신대기
        print(f"message received : {data} from : {websocket.client}")
        await websocket.send_text(f"Message text was: {data}") # client에 메시지 전달

CLIENTS={}
import logging

# 1. logger 생성
logger = logging.getLogger("main")

# @router.websocket('/chatroom/{user_ids}')
async def send_message(user_ids: str ,websocket: WebSocket):


  chat_room = ChatRoom.find_one({"user_ids": user_ids})
  if not chat_room:
    new_room=schemas.ChatRoomSchema(room_id = int(hashlib.sha256(user_ids.encode('utf-8')).hexdigest(), 16) % 10**8 ,user_ids = user_ids ,chat_list=[])
    ChatRoom.insert_one(new_room.dict())
    chat_room = new_room.dict()
  await websocket.accept()
  CLIENTS[user_ids] = websocket
  # CLIENTS.add(websocket)
  if not 'chat_list'in chat_room.keys():
            chat_room['chat_list'] = []
  old_chat_list =  [ChatResponseEntity(chat) for chat in chat_room['chat_list']]
  await websocket.send_json({'value':old_chat_list})
  while True:
        data = await websocket.receive_json()  # client 메시지 수신대기
        chat = schemas.ChatSchema(chat_id = int(hashlib.sha256(data['text'].encode('utf-8')).hexdigest(), 16) % 10**8 ,sender_id = data['userId'],room_id = int(hashlib.sha256(user_ids.encode('utf-8')).hexdigest(), 16) % 10**8 ,content = data['text'],created_at=datetime.utcnow())
        print(chat_room)
        chat_room['chat_list'].append(chat.dict())
        ChatRoom.find_one_and_update({"user_ids": user_ids}, {"$set": {"chat_list": chat_room['chat_list']}})
        chatroom_list = [ChatResponseEntity(chat) for chat in chat_room['chat_list']]
        print(f"message received : {data} from : {websocket.client}")
        message= {'value':chatroom_list}
        # handler(websocket) 0m9
        broadcast(message)
        logging.warning("==========================",CLIENTS)

        # await websocket.send_json( {'value':chatroom_list}) # client에 메시지 전달
        # for client in websocket.app['websockets']:
        #     await client.send_json({'value': chatroom_list})

@router.get('/remove')
def remove_all_chatrooms():
  ChatRoom.delete_many({})
  return {"status": "success"}


@router.get('/all')
def get_all_chatrooms():
  chatrooms = ChatRoom.find({})
  chatroom_list = [ChatRomeResponseEntity(chatroom) for chatroom in chatrooms]
  return {"status": "success", "chatrooms": chatroom_list}





log = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@router.websocket('/chatroom/{client_ids}')
async def websocket_endpoint(websocket: WebSocket, client_ids: str):
    await manager.connect(websocket)
    user = User.find_one({"_id": ObjectId(client_ids)})
    chat_room = user["chatRoom"]
    chat_room_data = [ChatRoom.find_one({"room_name": key}) for key in chat_room]
    data =chat_room_data
    await manager.send_personal_message({"value":f"{data}"}, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            #parshing
            sender = str(data['sender'])
            reciver= str(data['reciver'])
            text = data['text']
            room_name = max(sender+reciver ,reciver+sender)

            #append_or_message
            user = User.find_one({"_id": ObjectId(client_ids)})
            chat_room = user["chatRoom"]
            chat_room_data = [ChatRoom.find_one({"room_name": key}) for key in chat_room]
            data =chat_room_data
            chat = schemas.ChatSchema(chat_id = int(hashlib.sha256(text.encode('utf-8')).hexdigest(), 16) % 10**8 ,sender_id = sender,room_id = int(hashlib.sha256(room_name.encode('utf-8')).hexdigest(), 16) % 10**8 ,content = text,created_at=datetime.utcnow())
            if ChatRoom.find_one({"room_name": room_name}) is None:
                new_room=schemas.ChatRoomSchema(room_id = int(hashlib.sha256(room_name.encode('utf-8')).hexdigest(), 16) % 10**8 ,room_name = room_name ,chat_list=[])
                filter_criteria = {
                            "$or": [
                                {"_id": ObjectId(sender)},
                                {"_id": ObjectId(reciver)},
                                # Add more conditions as needed
                            ]
                        }
                User.update_one(filter_criteria, {"$push": {"chatRoom": room_name}})
                ChatRoom.insert_one(new_room.dict())

            ChatRoom.update_one({"room_name": room_name}, {"$push": {"chat_list": chat.dict()}})
            await manager.send_personal_message({"value":f"{data}"}, websocket)
            await manager.broadcast({"value":f"Client #{client_ids} says: {data}"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({"value":f"Client left#{client_ids}"})


@router.post('/add/chatroom')
def create_chatroom(room_name: str,sender ,reciver):
    filter_criteria = {
                            "$or": [
                                {"_id": ObjectId(sender)},
                                {"_id": ObjectId(reciver)},
                                # Add more conditions as needed
                            ]
                        }
    User.update_many(filter_criteria, {"$push": {"chatRoom": room_name}})
    return  {'value': 'success'}


@router.post('/addall/chatroom')
def create_chatroom():
    users = User.find({})
    User.update_many({}, {"$set": {"chatRoom": []}})
    return {'value': 'success'}




