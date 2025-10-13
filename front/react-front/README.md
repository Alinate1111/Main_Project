# PDF to Text Converter

React 기반의 PDF to Text 변환 웹 애플리케이션입니다.

## 🚀 빠른 시작

```bash
npm install
npm start
```

애플리케이션이 `http://localhost:3000`에서 실행됩니다.

## 📋 주요 기능

- ✅ 드래그 앤 드롭으로 PDF 파일 업로드
- ✅ 다중 파일 업로드 지원
- ✅ 개별/일괄 PDF to Text 변환
- ✅ 실시간 변환 진행 상태 표시
- ✅ 변환된 텍스트 미리보기 및 복사
- ✅ 반응형 디자인 (모바일/태블릿 지원)

## 🔧 API 연결 가이드

### 1. API 연결 위치

`src/Section.tsx` 파일의 **70번째 줄** `convertToText` 함수에서 API를 연결하세요:

```typescript
const convertToText = async (fileIndex: number) => {
  const fileWithText = uploadedFiles[fileIndex];
  if (!fileWithText) return;

  // 변환 상태 업데이트
  setUploadedFiles(prev => prev.map((item, i) =>
    i === fileIndex ? { ...item, isConverting: true, error: undefined } : item
  ));

  try {
    // 🔥 여기에 실제 API 호출 코드 작성 (현재는 시뮬레이션)
    // TODO: 실제 API 호출로 대체
    // await new Promise(resolve => setTimeout(resolve, 2000)); // 이 줄 삭제

    const formData = new FormData();
    formData.append('file', fileWithText.file);

    const response = await fetch('YOUR_API_ENDPOINT_HERE', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const extractedText = result.text; // API 응답에 따라 조정

    // 성공 상태 업데이트
    setUploadedFiles(prev => prev.map((item, i) =>
      i === fileIndex ? { ...item, text: extractedText, isConverting: false } : item
    ));

  } catch (error) {
    // 에러 상태 업데이트
    setUploadedFiles(prev => prev.map((item, i) =>
      i === fileIndex ? {
        ...item,
        error: error.message || 'Failed to convert PDF',
        isConverting: false
      } : item
    ));
  }
};
```

### 2. API 엔드포인트 설정

환경변수를 사용해서 API URL을 관리하는 것을 권장합니다:

**프로젝트 루트에 `.env` 파일 생성:**
```bash
REACT_APP_API_URL=http://localhost:8000
```

**API 호출 예시:**
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const response = await fetch(`${API_URL}/convert-pdf`, {
  method: 'POST',
  body: formData,
});
```

### 3. 예상되는 API 스펙

**요청:**
- **Method:** `POST`
- **URL:** `/convert-pdf` (또는 실제 엔드포인트)
- **Content-Type:** `multipart/form-data`
- **Body:** PDF 파일 (FormData의 'file' 필드)

**성공 응답:**
```json
{
  "success": true,
  "text": "추출된 텍스트 내용...",
  "filename": "example.pdf"
}
```

**에러 응답:**
```json
{
  "success": false,
  "error": "에러 메시지"
}
```

### 4. CORS 설정

개발 환경에서 CORS 문제가 발생할 수 있습니다. FastAPI 백엔드에서 다음 설정을 추가하세요:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🛠️ 개발 설정

### 필요한 의존성

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17"
  }
}
```

### 사용 가능한 스크립트

- `npm start` - 개발 서버 시작
- `npm run build` - 프로덕션 빌드
- `npm test` - 테스트 실행
- `npm run eject` - Create React App 설정 추출

## 📁 프로젝트 구조

```
src/
├── App.css          # 메인 앱 스타일
├── App.js           # 메인 앱 컴포넌트
├── index.css        # 전역 스타일 (Tailwind CSS)
├── index.js         # React 앱 엔트리 포인트
├── Section.tsx      # 🔥 메인 PDF 변환 컴포넌트 (API 연결 지점)
├── label-image-logo.svg  # PDF 아이콘
└── vector.svg       # UI 아이콘
```

## 🎨 UI 구성

### 왼쪽 컬럼
- **업로드 영역**: 드래그앤드롭 또는 파일 선택
- **파일 목록**: 업로드된 파일들과 개별 변환 버튼

### 오른쪽 컬럼
- **변환 결과**: 변환 완료된 파일 카드들
- **텍스트 미리보기**: 카드 클릭으로 텍스트 보기/숨기기
- **복사 기능**: 변환된 텍스트 클립보드 복사

## 🚀 배포 준비사항

1. **환경변수 설정**
   ```bash
   # .env 파일
   REACT_APP_API_URL=https://your-api-domain.com
   ```

2. **빌드 실행**
   ```bash
   npm run build
   ```

3. **빌드 파일 배포**
   - `build/` 폴더의 내용을 웹서버에 업로드

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. **API 연결 확인**: 개발자 도구 Network 탭에서 API 요청 상태 확인
2. **CORS 설정**: 백엔드에서 프론트엔드 도메인이 허용되었는지 확인
3. **환경변수**: `.env` 파일이 올바르게 설정되었는지 확인
4. **파일 형식**: PDF 파일만 업로드 가능 (자동 필터링됨)

## ⚠️ 현재 상태

- **시뮬레이션 모드**: 현재는 2초 대기 후 더미 텍스트를 반환합니다
- **실제 사용**: 위의 API 연결 가이드를 따라 `src/Section.tsx` 파일을 수정하세요

---

💡 **핵심 포인트**: `src/Section.tsx`의 70번째 줄 `convertToText` 함수만 수정하면 됩니다!
