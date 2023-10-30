from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from domain.user import user_router
# from domain.emptytime import emptytime_router
app = FastAPI()


origins = [
    "http://localhost:3000",  # React 애플리케이션의 URL
    "http://localhost:8080",  # 필요한 경우 추가 URL
    "http://localhost:5173",
    "172.30.1.77:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(user_router.router)

# app.include_router(emptytime_router.router)
