import oracledb

oracledb.init_oracle_client(
    lib_dir=r"C:\oracle\instantclient-basic-windows.x64-19.28.0.0.0dbru\instantclient_19_28"   # Oracle Instant Client 압축 해제 경로
)

def get_connection():
    return oracledb.connect(
        user="hr",                   # 유저 아이디 
        password="1234",             # 유저 비밀번호
        dsn="localhost:1521/xe"
    )
