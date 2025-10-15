from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import traceback
from pdf_service import pdf_service
from oracle_connect import get_connection
from passlib.context import CryptContext
from pydantic import BaseModel

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ✅ 로그인 요청 모델
class LoginRequest(BaseModel):
    id: str
    password: str

# ✅ 로그인 API
@router.post("/login")
def login(data: LoginRequest):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT user_id, password, user_role, name 
            FROM member 
            WHERE id = :id
        """, [data.id])
        row = cursor.fetchone()

        cursor.close()
        conn.close()

        if not row:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        user_id, hashed_password, user_role, name = row

        # 비밀번호 검증
        if not pwd_context.verify(data.password, hashed_password):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        # 로그인 성공 응답
        return {
            "message": f"Welcome {name}",
            "user": {
                "user_id": int(user_id),
                "name": name,
                "user_role": user_role
            }
        }

    except Exception as e:
        print("로그인 에러:", str(e))
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="서버 내부 오류")


# 파일 조회하는 api
@router.get("/files/{user_id}")
def get_files(user_id: int):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT file_name FROM file_history WHERE user_id = :user_id
        """, {"user_id": user_id})  # 딕셔너리 바인딩

        files = cursor.fetchall()

        cursor.close()
        conn.close()

        return {"files": [f[0] for f in files]}

    except Exception as e:
        print("파일 조회 에러:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail="파일 조회 중 서버 오류")


@router.post("/upload")
async def upload_pdf(pdfFile: UploadFile = File(...)):
    """단일 PDF 파일 업로드 및 변환"""
    try:
        filename = pdfFile.filename
        if not filename.lower().endswith(".pdf"):
            return JSONResponse(
                status_code=400,
                content={"error": "PDF 파일만 업로드할 수 있습니다."}
            )

        result = pdf_service.process_single_pdf(pdfFile)
        return result

    except Exception as e:
        print(f"에러 발생: {str(e)}")
        print(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"error": f"PDF 처리 실패: {str(e)}"}
        )


@router.post("/upload-multiple")
async def upload_multiple_pdfs(pdfFiles: List[UploadFile] = File(...)):
    """여러 PDF 파일 업로드 및 변환"""
    results = []

    for pdfFile in pdfFiles:
        try:
            filename = pdfFile.filename
            if not filename.lower().endswith(".pdf"):
                results.append({
                    "filename": filename,
                    "success": False,
                    "error": "PDF 파일만 업로드할 수 있습니다."
                })
                continue

            result = pdf_service.process_single_pdf(pdfFile)
            results.append(result)

        except Exception as e:
            print(f"에러 발생 ({pdfFile.filename}): {str(e)}")
            print(traceback.format_exc())
            results.append({
                "filename": pdfFile.filename,
                "success": False,
                "error": str(e)
            })

    return {"results": results}