from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from oracle_connect import get_connection
from passlib.context import CryptContext

app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class LoginRequest(BaseModel):
    id: str
    password: str

@app.post("/login")
def login(data: LoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password, user_role, name FROM member WHERE id = :id", [data.id])
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    hashed_password, user_role, name = row

    if not pwd_context.verify(data.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {
        "message": f"Welcome {name}",
        "role": user_role
    }
