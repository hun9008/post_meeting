from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.routers import auth, user, postit, chat, like
from app.routers.chat import ConnectionManager

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
origins = [settings.CLIENT_ORIGIN, "http://localhost:3000"]


app.add_middleware(
    # 모든 도메인으로부터의 요청 허용
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"],
)

manager = ConnectionManager()

app.include_router(auth.router, tags=["Auth"], prefix="/api/auth")
app.include_router(user.router, tags=["Users"], prefix="/api/users")
app.include_router(postit.router, tags=["Postit"], prefix="/api/postit")
app.include_router(chat.router, tags=["Chat"], prefix="/api/chat")
app.include_router(like.router, tags=["Like"], prefix="/api/like")


@app.get("/api/healthchecker")
def root():
    return {"message": "Welcome to FastAPI with MongoDB"}
