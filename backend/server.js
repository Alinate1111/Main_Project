const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // ✅ 1. CORS 모듈 불러오기

const app = express();
app.use(cors()); // ✅ 2. CORS 미들웨어 등록 (모든 출처 허용)

const upload = multer({ dest: 'uploads/' }); // 임시 저장 폴더

const desktopFolder = path.join(process.env.USERPROFILE, 'Desktop', '텍스트 변환 폴더');

if (!fs.existsSync(desktopFolder)) {
    fs.mkdirSync(desktopFolder, { recursive: true });
}

app.use(express.json());

// PDF 업로드 API
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    const pdfPath = req.file.path; // 임시 pdf 경로
    const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
    const txtFilename = path.parse(originalName).name + '.txt';
    const txtFilePath = path.join(desktopFolder, txtFilename);

    // Python 스크립트 실행 (pdf -> 텍스트 변환)
    const pythonProcess = spawn('python', ['pdf_to_text.py', pdfPath, txtFilePath]);

    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        // 변환 완료 후 텍스트 읽어서 응답
        if (code === 0) {
            fs.readFile(txtFilePath, 'utf8', (err, data) => {
                if (err) {
                    return res.status(500).json({ error: '텍스트 파일 읽기 실패' });
                }
                // 업로드한 파일 이름, 변환된 텍스트 전달
                res.json({ filename: txtFilename, text: data });
                
                // 임시 pdf 파일 삭제
                fs.unlink(pdfPath, () => {});
            });
        } else {
            res.status(500).json({ error: 'PDF 변환 실패' });
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
