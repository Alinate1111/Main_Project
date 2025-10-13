import os
from tempfile import NamedTemporaryFile
from paddleocr import PaddleOCR
from pdf2image import convert_from_path
from config import PADDLEOCR_CONFIG, PDF_DPI


class OCRService:
    """PDF OCR 처리를 담당하는 서비스 클래스"""

    def __init__(self):
        """PaddleOCR 초기화"""
        self.ocr = PaddleOCR(**PADDLEOCR_CONFIG)

    def extract_text_from_pdf(self, pdf_path: str) -> tuple[str, list[dict]]:
        """
        PDF 파일에서 텍스트 추출

        Args:
            pdf_path: PDF 파일 경로

        Returns:
            (전체 텍스트, 페이지별 데이터 리스트)
        """
        full_text = ""
        page_data = []

        # PDF를 이미지로 변환
        images = convert_from_path(pdf_path, dpi=PDF_DPI)

        # 각 페이지별로 OCR 실행
        for page_num, image in enumerate(images, 1):
            ocr_text = self._extract_text_from_image(image)

            # 결과 저장
            full_text += f"[Page {page_num}]\n{ocr_text}\n\n"
            page_data.append({
                "page": page_num,
                "text": ocr_text
            })

        return full_text, page_data

    def _extract_text_from_image(self, image) -> str:
        """
        이미지에서 텍스트 추출

        Args:
            image: PIL Image 객체

        Returns:
            추출된 텍스트
        """
        # 임시 이미지 파일 저장
        with NamedTemporaryFile(delete=False, suffix=".png") as tmp_img:
            image.save(tmp_img.name)
            image_path = tmp_img.name

        try:
            # PaddleOCR 실행
            result = self.ocr.predict(image_path)

            # 텍스트 추출
            ocr_text = ""
            if result:
                for res in result:
                    # res.str['res']['rec_texts']에서 텍스트 리스트 추출
                    if 'res' in res.str and 'rec_texts' in res.str['res']:
                        texts = res.str['res']['rec_texts']
                        ocr_text += "\n".join(texts) + "\n"

            return ocr_text
        finally:
            # 임시 이미지 파일 삭제
            if os.path.exists(image_path):
                os.remove(image_path)


# 싱글톤 인스턴스
ocr_service = OCRService()