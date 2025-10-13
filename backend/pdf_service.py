import os
import json
import shutil
from tempfile import NamedTemporaryFile
from fastapi import UploadFile
from typing import List
from ocr_service import ocr_service
from config import TEXT_FOLDER, JSON_FOLDER


class PDFService:
    """PDF 파일 처리를 담당하는 서비스 클래스"""

    def process_single_pdf(self, pdf_file: UploadFile) -> dict:
        """
        단일 PDF 파일 처리

        Args:
            pdf_file: 업로드된 PDF 파일

        Returns:
            처리 결과 딕셔너리
        """
        filename = pdf_file.filename

        # 파일명에서 경로 제거 (폴더 업로드 시 경로가 포함될 수 있음)
        filename = os.path.basename(filename)

        base_filename = os.path.splitext(filename)[0]
        txt_filename = base_filename + ".txt"
        json_filename = base_filename + ".json"
        txt_path = os.path.join(TEXT_FOLDER, txt_filename)
        json_path = os.path.join(JSON_FOLDER, json_filename)

        # 임시 파일 저장
        with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(pdf_file.file, tmp)
            temp_path = tmp.name

        try:
            # OCR 처리
            full_text, page_data = ocr_service.extract_text_from_pdf(temp_path)

            # 텍스트 파일 저장
            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(full_text)

            # JSON 파일 저장
            json_output = {
                "filename": filename,
                "text": full_text,
                "pages": page_data
            }

            with open(json_path, "w", encoding="utf-8") as jf:
                json.dump(json_output, jf, ensure_ascii=False, indent=2)

            return {
                "filename": filename,
                "success": True,
                "filename_txt": txt_filename,
                "filename_json": json_filename,
                "text": full_text
            }
        finally:
            # 임시 파일 삭제
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def process_multiple_pdfs(self, pdf_files: List[UploadFile]) -> List[dict]:
        """
        여러 PDF 파일 처리

        Args:
            pdf_files: 업로드된 PDF 파일 리스트

        Returns:
            처리 결과 리스트
        """
        results = []

        for pdf_file in pdf_files:
            try:
                result = self.process_single_pdf(pdf_file)
                results.append(result)
            except Exception as e:
                results.append({
                    "filename": os.path.basename(pdf_file.filename),
                    "success": False,
                    "error": str(e)
                })

        return results


# 싱글톤 인스턴스
pdf_service = PDFService()