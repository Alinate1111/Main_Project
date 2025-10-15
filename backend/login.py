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
    print(f"Login attempt for ID: {data.id}")
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT user_id, id, password, name, user_role
        FROM member 
        WHERE id = :id
    """, {"id": data.id})
    row = cursor.fetchone()
    print("DB returned row:", row)

    cursor.close()
    conn.close()

    if not row:
        print("No user found with given ID.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user_id, user_login_id, hashed_password, name, user_role = row

    # bcrypt 검사
    if not pwd_context.verify(data.password, hashed_password):
        print("Password mismatch for user:", data.id)
        raise HTTPException(status_code=401, detail="Invalid username or password")

    response_data = {
        "message": f"Welcome {name}",
        "user": {
            "user_id": int(user_id),
            "id": user_login_id,
            "name": name,
            "user_role": user_role
        }
    }

    print("✅ Final login response:", response_data)
    return response_data


@app.get("/files/{user_id}")
def get_files(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT file_name FROM file_history WHERE user_id = :user_id
    """, [user_id])
    files = cursor.fetchall()
    cursor.close()
    conn.close()

    return {"files": [f[0] for f in files]}
