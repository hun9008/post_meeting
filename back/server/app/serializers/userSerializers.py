def userEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "sex": user["sex"],
        "verified": user["verified"],
        "password": user["password"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"]
    }


def userResponseEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "sex": user["sex"],
        "postit": user["postit"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
        "verified":user['verified']
    }


def ChatRomeResponseEntity(chatroom) -> dict:
    return {
        "room_id": str(chatroom["room_id"]),
        "user_ids": chatroom["user_ids"],
        "chat_list": chatroom["chat_list"],
        "created_at": chatroom["created_at"],
        "updated_at": chatroom["updated_at"]
    }

def ChatResponseEntity(chat) -> dict:
    return {
        "chat_id": str(chat["chat_id"]),
        "sender_id": chat["sender_id"],
        "content": chat["content"],
        "created_at": str(chat["created_at"])
    }


def embeddedUserResponse(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "photo": user["photo"]
    }


def userListEntity(users) -> list:
    return [userEntity(user) for user in users]
