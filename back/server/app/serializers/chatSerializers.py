def chatEntity(chat) -> dict:
    return {
        "chat_id": chat["chat_id"],
        "sender_id": chat["sender_id"],
        "content": chat["content"],
        "created_at": str(chat["created_at"]),
    }


def ChatRomeResponseEntity(chatroom) -> dict:
    return {
        "room_id": str(chatroom["room_id"]),
        "room_name": chatroom["room_name"],
        "chat_list": [chatEntity(c) for c in chatroom["chat_list"]],
        "created_at": str(chatroom["created_at"]),
        "updated_at": str(chatroom["updated_at"]),
    }


def ChatResponseEntity(chat) -> dict:
    return {
        "chat_id": str(chat["chat_id"]),
        "sender_id": chat["sender_id"],
        "content": chat["content"],
        "created_at": str(chat["created_at"]),
    }
