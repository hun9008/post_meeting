from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, user, postit

app = FastAPI()

origins = [
    settings.CLIENT_ORIGIN,
]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"]  # 모든 도메인으로부터의 요청 허용

)


app.include_router(auth.router, tags=['Auth'], prefix='/api/auth')
app.include_router(user.router, tags=['Users'], prefix='/api/users')
app.include_router(postit.router, tags=['Postit'], prefix='/api/postit')

@app.get("/api/healthchecker")
def root():
    return {"message": "Welcome to FastAPI with MongoDB"}
