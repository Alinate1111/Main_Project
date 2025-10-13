import os

# 바탕화면 경로 및 저장 폴더 설정
DESKTOP_PATH = os.path.join(os.path.expanduser("~"), "Desktop")
TEXT_FOLDER = os.path.join(DESKTOP_PATH, "텍스트 변환 폴더")
JSON_FOLDER = os.path.join(DESKTOP_PATH, "json")

# 폴더 생성
os.makedirs(TEXT_FOLDER, exist_ok=True)
os.makedirs(JSON_FOLDER, exist_ok=True)

# PaddleOCR 설정
PADDLEOCR_CONFIG = {
    "lang": "korean",
    "use_doc_orientation_classify": False,
    "use_doc_unwarping": False,
    "use_textline_orientation": False,
}

# PDF to Image 설정
PDF_DPI = 300

# 서버 설정
HOST = "127.0.0.1"
PORT = 5000