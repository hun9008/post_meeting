def userEntity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        # "verified": user["verified"],
        "password": user["password"],
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
    }


def userResponseEntity(user) -> dict:
    user["_id"] = str(user["_id"])
    return user
    return {
        # "id": str(user["_id"]),
        # "email": user["email"],
        # "postit": user["postit"],
        # "created_at": user["created_at"],
        # "updated_at": user["updated_at"],
        # "verified": user["verified"],
        # "chatRoom": user["chatRoom"],
        # "send_like": user["send_like"],
        # "recive_like": user["recive_like"],
    }


def embeddedUserResponse(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "photo": user["photo"],
    }


def userListEntity(users) -> list:
    return [userEntity(user) for user in users]
