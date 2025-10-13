# PDF to Text Converter with PaddleOCR

PaddleOCR을 활용한 한국어 PDF 문서를 텍스트로 변환하는 웹 애플리케이션입니다.

## 📁 프로젝트 구조

```
pdf_txt_project/
├── backend/                    # FastAPI 백엔드
│   ├── app.py                 # 메인 애플리케이션 진입점
│   ├── config.py              # 설정 및 상수 정의
│   ├── ocr_service.py         # PaddleOCR 처리 로직
│   ├── pdf_service.py         # PDF 파일 처리 로직
│   └── routes.py              # API 엔드포인트 정의
│
└── front/react-front/         # React 프론트엔드
    └── src/
        ├── Section.tsx        # 메인 컴포넌트
        ├── types.ts           # TypeScript 타입 정의
        ├── components/        # UI 컴포넌트
        │   ├── UploadArea.tsx           # 파일/폴더 업로드 영역
        │   ├── UploadedFilesList.tsx    # 업로드된 파일 목록
        │   └── ConvertedFilesList.tsx   # 변환 완료된 파일 목록
        └── hooks/
            └── usePDFConverter.ts       # PDF 변환 비즈니스 로직
```

## 🚀 주요 기능

### 1. PDF 변환
- **개별 파일 변환**: PDF 파일을 개별적으로 업로드하여 텍스트 추출
- **폴더 일괄 변환**: 폴더 전체를 업로드하여 모든 PDF 파일 일괄 처리
- **진행률 표시**: 폴더 변환 시 "Converting X/Y" 실시간 진행률 표시
- **한국어 OCR**: PaddleOCR 한국어 모델을 사용한 정확한 텍스트 인식

### 2. 파일 관리
- **드래그 앤 드롭**: 파일/폴더를 드래그하여 업로드
- **변환 취소**: 진행 중인 변환 취소 기능
- **선택적 삭제**: 개별 파일 또는 폴더 단위 삭제
- **상태 관리**: 변환 중, 완료, 에러, 취소 상태 구분

### 3. 다운로드 기능
- **개별 파일 다운로드**:
  - TXT 형식: 순수 텍스트 파일
  - JSON 형식: 메타데이터 포함 (파일명, 텍스트, 크기, 변환 시간)
- **폴더 일괄 다운로드**:
  - TXT ZIP: 모든 파일을 .txt로 포함한 ZIP
  - JSON ZIP: 모든 파일을 .json으로 포함한 ZIP
- **저장 위치 선택**: File System Access API를 통한 저장 경로 지정 (Chrome, Edge 지원)

### 4. UI/UX
- **폴더 계층 구조**: 폴더별 그룹화 및 확장/축소 기능
- **실시간 미리보기**: 변환된 텍스트 즉시 확인
- **클립보드 복사**: 변환된 텍스트 원클릭 복사
- **반응형 디자인**: 데스크톱 및 모바일 최적화

## 🛠️ 기술 스택

### Backend
- **FastAPI**: Python 웹 프레임워크
- **PaddleOCR**: 한국어 OCR 엔진
- **pdf2image**: PDF를 이미지로 변환
- **CORS**: 크로스 오리진 리소스 공유 설정

### Frontend
- **React**: UI 라이브러리
- **TypeScript**: 타입 안정성
- **TailwindCSS**: 스타일링
- **JSZip**: ZIP 파일 생성

## 📦 설치 및 실행

### 필수 요구사항

#### 1. CUDA 설정 (PaddleOCR GPU 가속용)
- **CUDA 11.8** 설치 필요
- **cuDNN 8.9** (CUDA 11.8 호환 버전)

CUDA 11.8 다운로드:
```
https://developer.nvidia.com/cuda-11-8-0-download-archive
```

#### 2. Python 환경
- Python 3.8 이상
- pip 최신 버전

### Backend 설치

1. **가상환경 생성 및 활성화**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

2. **PaddlePaddle 설치 (CUDA 11.8 버전)**
```bash
# CUDA 11.8 + cuDNN 8.6 버전
python -m pip install paddlepaddle-gpu==2.6.0 -i https://mirror.baidu.com/pypi/simple
```

또는 공식 사이트에서 선택:
```
https://www.paddlepaddle.org.cn/install/quick
```

3. **의존성 설치**
```bash
pip install -r requirements.txt
```

requirements.txt:
```
fastapi==0.104.1
uvicorn==0.24.0
paddleocr==2.7.0
pdf2image==1.16.3
python-multipart==0.0.6
Pillow==10.1.0
```

4. **추가 시스템 요구사항**
- **Poppler** (pdf2image 사용)
  - Windows: https://github.com/oschwartz10612/poppler-windows/releases
  - 다운로드 후 PATH에 bin 폴더 추가
  - Linux: `sudo apt-get install poppler-utils`

5. **서버 실행**
```bash
python app.py
```
서버가 `http://127.0.0.1:5000`에서 실행됩니다.

### Frontend 설치

1. **의존성 설치**
```bash
cd front/react-front
npm install
```

주요 패키지:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

2. **개발 서버 실행**
```bash
npm start
```
프론트엔드가 `http://localhost:3000`에서 실행됩니다.

## 🔑 핵심 코드 구조

### Backend 핵심 변수 및 함수

#### `config.py`
```python
DESKTOP_PATH = os.path.join(os.path.expanduser("~"), "Desktop")
TEXT_FOLDER = os.path.join(DESKTOP_PATH, "텍스트 변환 폴더")
JSON_FOLDER = os.path.join(DESKTOP_PATH, "json")

PADDLEOCR_CONFIG = {
    "lang": "korean",
    "use_doc_orientation_classify": False,
    "use_doc_unwarping": False,
    "use_textline_orientation": False,
}

PDF_DPI = 300  # PDF 이미지 변환 해상도
HOST = "127.0.0.1"
PORT = 5000
```

#### `ocr_service.py` - OCRService 클래스
```python
class OCRService:
    def __init__(self):
        self.ocr = PaddleOCR(**PADDLEOCR_CONFIG)

    def process_pdf(self, pdf_path: str) -> str:
        """PDF 파일을 OCR 처리하여 텍스트 추출"""
        # 1. PDF를 이미지로 변환 (pdf2image)
        # 2. 각 페이지를 PaddleOCR로 처리
        # 3. 텍스트 결합 후 반환
```

**중요**: PaddleOCR 결과 접근 방법
```python
# 올바른 접근 방법
result = self.ocr.predict(image_path)
for res in result:
    texts = res.str['res']['rec_texts']  # 텍스트 배열
```

#### `routes.py` - API 엔드포인트
- `POST /upload`: 단일 PDF 파일 변환
- `POST /upload-multiple`: 다중 PDF 파일 변환

### Frontend 핵심 상태 및 타입

#### `types.ts`
```typescript
interface FileWithText {
  file: File;              // 업로드된 파일 객체
  text?: string;           // 변환된 텍스트
  isConverting?: boolean;  // 변환 진행 중
  error?: string;          // 에러 메시지
  folderName?: string;     // 폴더명
  isCancelled?: boolean;   // 취소 여부
}

interface FolderGroup {
  folderName: string;      // 폴더명
  files: FileWithText[];   // 폴더 내 파일 목록
  isExpanded: boolean;     // 확장 상태
  isConverting?: boolean;  // 폴더 변환 중
  convertedCount?: number; // 변환 완료 파일 수
  totalCount?: number;     // 전체 파일 수
}
```

#### `usePDFConverter.ts` - 핵심 Hook
```typescript
// 주요 상태
const [uploadedFiles, setUploadedFiles] = useState<FileWithText[]>([]);
const [folderGroups, setFolderGroups] = useState<FolderGroup[]>([]);
const [expandedConvertedFolders, setExpandedConvertedFolders] = useState<Set<number>>(new Set());
const [expandedConvertedFiles, setExpandedConvertedFiles] = useState<Set<string>>(new Set());

// 주요 함수
convertToText(fileIndex)           // 개별 파일 변환
convertFolderToText(folderIndex)   // 폴더 일괄 변환
convertFolderFileToText(folderIndex, fileIndex)  // 폴더 내 파일 변환
removeFile(index)                  // 파일 삭제
removeFolder(folderIndex)          // 폴더 삭제
```

#### `ConvertedFilesList.tsx` - 다운로드 함수
```typescript
// 개별 파일 다운로드
downloadFile(fileName, text, format: 'txt' | 'json')

// 폴더 ZIP 다운로드
downloadFolder(folderName, files, format: 'txt' | 'json')
// - TXT: 각 파일마다 .txt 파일 생성
// - JSON: 각 파일마다 .json 파일 생성 (메타데이터 포함)
```

## 🔧 주요 설정 및 주의사항

### 1. CORS 설정
```python
# backend/app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. PaddleOCR 초기화 시간
- 첫 번째 요청 시 모델 로딩으로 인해 10-20초 소요될 수 있음
- 이후 요청은 빠르게 처리됨

### 3. 파일 크기 제한
- FastAPI의 기본 파일 크기 제한 확인 필요
- 대용량 PDF 처리 시 타임아웃 설정 조정 권장

### 4. GPU 메모리
- PaddleOCR은 GPU 메모리를 약 2-4GB 사용
- 여러 요청 동시 처리 시 메모리 부족 주의

### 5. webkitdirectory 속성
```typescript
// 폴더 업로드를 위한 input 속성
<input
  type="file"
  webkitdirectory=""  // Chrome, Edge에서 폴더 선택 가능
  directory=""
  multiple
/>
```

## 🐛 트러블슈팅

### 1. PaddleOCR 설치 오류
```bash
# CUDA 버전 확인
nvidia-smi

# PaddlePaddle GPU 버전 재설치
pip uninstall paddlepaddle-gpu
python -m pip install paddlepaddle-gpu==2.6.0 -i https://mirror.baidu.com/pypi/simple
```

### 2. "Cannot find module '*.svg'" 오류
- `src/custom.d.ts` 파일이 있는지 확인
- TypeScript 컴파일러 재시작

### 3. pdf2image 오류
- Poppler 설치 확인
- Windows: PATH 환경변수에 poppler/bin 경로 추가

### 4. CORS 오류
- Backend와 Frontend가 모두 실행 중인지 확인
- Backend의 CORS 설정 확인

## 📝 API 문서

### POST /upload
단일 PDF 파일 변환

**Request:**
```
Content-Type: multipart/form-data
pdfFile: <PDF 파일>
```

**Response:**
```json
{
  "text": "추출된 텍스트 내용...",
  "filename": "example.pdf"
}
```

### POST /upload-multiple
다중 PDF 파일 변환

**Request:**
```
Content-Type: multipart/form-data
pdfFiles: <PDF 파일들>
```

**Response:**
```json
{
  "results": [
    {
      "filename": "file1.pdf",
      "text": "추출된 텍스트...",
      "success": true
    },
    {
      "filename": "file2.pdf",
      "error": "에러 메시지",
      "success": false
    }
  ]
}
```

## 🌟 개발 히스토리

1. **초기 버전**: Tesseract OCR 기반
2. **PaddleOCR 전환**: 한국어 인식 정확도 개선
3. **폴더 업로드**: 일괄 처리 기능 추가
4. **진행률 표시**: 사용자 피드백 개선
5. **다운로드 기능**: TXT/JSON 형식 지원
6. **ZIP 다운로드**: 폴더 단위 다운로드
7. **코드 리팩토링**: 모듈화 및 유지보수성 개선

# pdf2text
