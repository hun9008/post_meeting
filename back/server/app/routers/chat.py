from fastapi import APIRouter, Depends
from bson.objectid import ObjectId
from app.serializers.userSerializers import userResponseEntity ,ChatRomeResponseEntity ,ChatResponseEntity
from app.serializers.userSerializers import userEntity
from fastapi import APIRouter, Request, Response, status, Depends, HTTPException ,WebSocket
from app.database import User ,ChatRoom
from datetime import datetime, timedelta
from .. import schemas, oauth2
import logging
import hashlib
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, select_autoescape, PackageLoader
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
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

@router.websocket('/chatroom/{user_ids}')
# request:Request,payload: schemas.ChatSchema ,
async def send_message(user_ids: str ,websocket: WebSocket):
  chat_room = ChatRoom.find_one({"user_ids": user_ids})
  if not chat_room:
    new_room=schemas.ChatRoomSchema(room_id = int(hashlib.sha256(user_ids.encode('utf-8')).hexdigest(), 16) % 10**8 ,user_ids = user_ids ,chat_list=[])
    ChatRoom.insert_one(new_room.dict())
    chat_room = new_room.dict()
  print(f"client connected : {websocket.client}")
  await websocket.accept() # client의 websocket접속 허용
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
        await websocket.send_json( {'value':chatroom_list}) # client에 메시지 전달


@router.get('/remove')
def remove_all_chatrooms():
  ChatRoom.delete_many({})
  return {"status": "success"}


@router.get('/all')
def get_all_chatrooms():
  chatrooms = ChatRoom.find({})
  chatroom_list = [ChatRomeResponseEntity(chatroom) for chatroom in chatrooms]
  return {"status": "success", "chatrooms": chatroom_list}

@router.post('/move')
def move_postit(payload: schemas.PostitMoveSchema):

    user = User.find_one({"_id": ObjectId(payload.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    try:
        new_postit = user['postit']
        new_postit['x'] = payload.x
        new_postit['y']= payload.y
        User.find_one_and_update({"_id": ObjectId(payload.user_id)}, {
                "$set": {"postit": new_postit, "updated_at": datetime.utcnow()}})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update postit information: {str(e)}")
    return 'success'



