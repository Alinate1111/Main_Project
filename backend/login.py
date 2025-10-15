from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
from oracle_connect import get_connection
from passlib.context import CryptContext

app = FastAPI()

# ✅ 세션 미들웨어 추가 (세션 쿠키 암호화에 사용되는 secret_key)
app.add_middleware(SessionMiddleware, secret_key="your_super_secret_key")

# ✅ CORS 설정 (React 등 프론트엔드에서 호출할 수 있도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트 주소에 맞게 설정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 암호화 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    id: str
    password: str


@app.post("/login")
def login(data: LoginRequest, request: Request):
    print(f"Login attempt for ID: {data.id}")
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT user_id, id, password, name, user_role
        FROM member 
        WHERE id = :id
    """, {"id": data.id})
    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user_id, user_login_id, hashed_password, name, user_role = row

    if not pwd_context.verify(data.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # ✅ 세션에 로그인 정보 저장
    request.session["user"] = {
        "user_id": int(user_id),
        "id": user_login_id,
        "name": name,
        "user_role": user_role
    }

    return {
        "message": f"Welcome {name}",
        "user": request.session["user"]
    }


@app.get("/logout")
def logout(request: Request):
    # ✅ 세션에서 사용자 정보 제거
    request.session.clear()
    return {"message": "Logged out successfully"}


@app.get("/files")
def get_files(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")

    user_id = user["user_id"]

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT file_name FROM file_history WHERE user_id = :user_id
    """, [user_id])
    files = cursor.fetchall()

    cursor.close()
    conn.close()

    return {"files": [f[0] for f in files]}


@app.get("/me")
def get_current_user(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Not logged in")
    return user
