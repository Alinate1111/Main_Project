from passlib.context import CryptContext
from oracle_connect import get_connection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def truncate_password(plain_password: str, max_bytes=72) -> str:
    encoded = plain_password.encode('utf-8')
    if len(encoded) <= max_bytes:
        return plain_password
    truncated = encoded[:max_bytes]
    while True:
        try:
            return truncated.decode('utf-8')
        except UnicodeDecodeError:
            truncated = truncated[:-1]  # 1바이트씩 줄여서 올바른 UTF-8 문자열 만들기

def insert_dummy_user(user_id: str, plain_password: str, user_role: str, name: str):
    # bcrypt 제한 72바이트 기준으로 비밀번호 자르기
    safe_password = truncate_password(plain_password, 72)
    hashed_password = pwd_context.hash(safe_password)
    
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO HR.MEMBER 
            (USER_ID, ID, PASSWORD, NAME, EMAIL, PHONE, CREATE_DATE, UPDATE_DATE, USER_ROLE)
            VALUES 
            (member_seq.NEXTVAL, :id, :password, :name, :email, :phone, SYSDATE, NULL, :user_role)
            """,
            {
                "id": user_id,
                "password": hashed_password,
                "name": name,
                "email": f"{user_id}@example.com",  # 임시 이메일 생성
                "phone": "010-0000-0000",           # 임시 전화번호
                "user_role": user_role
            }
        )
        conn.commit()
        print(f"User '{user_id}' inserted successfully.")
    except Exception as e:
        print(f"Error inserting user '{user_id}':", e)
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    insert_dummy_user("aaaa", "1234", "user", "홍길동")
    insert_dummy_user("bbbb", "1234", "user", "김철수")
