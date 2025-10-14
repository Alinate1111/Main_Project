from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from typing import List
import traceback
from pdf_service import pdf_service

router = APIRouter()

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