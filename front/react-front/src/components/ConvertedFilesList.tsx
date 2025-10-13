import React from "react";
import { FileWithText, FolderGroup } from "../types";
import labelImageLogo from "../label-image-logo.svg";
import JSZip from "jszip";

interface ConvertedFilesListProps {
  folderGroups: FolderGroup[];
  uploadedFiles: FileWithText[];
  expandedConvertedFolders: Set<number>;
  expandedConvertedFiles: Set<string>;
  selectedFileIndex: number | null;
  onToggleConvertedFolder: (folderIndex: number) => void;
  onToggleConvertedFile: (fileKey: string) => void;
  onCardClick: (index: number) => void;
}

export const ConvertedFilesList: React.FC<ConvertedFilesListProps> = ({
  folderGroups,
  uploadedFiles,
  expandedConvertedFolders,
  expandedConvertedFiles,
  selectedFileIndex,
  onToggleConvertedFolder,
  onToggleConvertedFile,
  onCardClick,
}) => {
  const downloadFile = async (fileName: string, text: string, format: 'txt' | 'json') => {
    const blob = format === 'json'
      ? new Blob([JSON.stringify({ fileName, text, convertedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
      : new Blob([text], { type: 'text/plain' });

    // File System Access API 사용 (Chrome, Edge 등 지원)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `${fileName.replace('.pdf', '')}.${format}`,
          types: [{
            description: format === 'json' ? 'JSON Files' : 'Text Files',
            accept: { [format === 'json' ? 'application/json' : 'text/plain']: [`.${format}`] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // 사용자가 취소
      }
    }

    // Fallback: 기본 다운로드
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace('.pdf', '')}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadFolder = async (folderName: string, files: FileWithText[], format: 'txt' | 'json') => {
    const convertedFiles = files.filter(f => f.text && !f.isCancelled);

    // ZIP 파일로 각 파일을 개별적으로 포함
    const zip = new JSZip();
    const folder = zip.folder(folderName);

    convertedFiles.forEach(f => {
      const baseName = f.file.name.replace('.pdf', '');
      if (format === 'txt') {
        folder?.file(`${baseName}.txt`, f.text || '');
      } else {
        folder?.file(`${baseName}.json`, JSON.stringify({
          fileName: f.file.name,
          text: f.text,
          size: f.file.size,
          convertedAt: new Date().toISOString()
        }, null, 2));
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });

    // File System Access API 사용
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `${folderName}_${format}.zip`,
          types: [{
            description: 'ZIP Files',
            accept: { 'application/zip': ['.zip'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: 기본 다운로드
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${folderName}_${format}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasConvertedFiles =
    uploadedFiles.filter(f => f.text || f.isConverting || f.error || f.isCancelled).length > 0 ||
    folderGroups.some(folder => folder.files.some(f => f.text || f.isConverting || f.error || f.isCancelled));

  if (!hasConvertedFiles) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Converted Files</h2>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <p className="text-gray-500">No converted files yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Upload and convert PDF files to see results here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Converted Files</h2>
      <div className="space-y-4">
        {/* 폴더별로 그룹화하여 표시 */}
        {folderGroups.map((folder, folderIndex) => {
          const hasConvertedFiles = folder.files.some(f => f.text || f.isConverting || f.error || f.isCancelled);
          if (!hasConvertedFiles) return null;

          const isFolderExpanded = expandedConvertedFolders.has(folderIndex);

          return (
            <div key={`converted-folder-${folderIndex}`} className="border rounded-lg">
              {/* 폴더 헤더 */}
              <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => onToggleConvertedFolder(folderIndex)}
                >
                  <span className="text-2xl">{isFolderExpanded ? '📂' : '📁'}</span>
                  <div>
                    <p className="font-medium text-gray-900">{folder.folderName}</p>
                    <p className="text-sm text-gray-500">
                      {folder.files.filter(f => f.text && !f.isCancelled).length} converted files
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFolder(folder.folderName, folder.files, 'txt');
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    title="Download folder as ZIP with TXT files"
                  >
                    📄 TXT ZIP
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFolder(folder.folderName, folder.files, 'json');
                    }}
                    className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                    title="Download folder as ZIP with JSON files"
                  >
                    📦 JSON ZIP
                  </button>
                </div>
              </div>

              {/* 폴더 내 파일들 */}
              {isFolderExpanded && (
                <div className="border-t bg-gray-50 p-3 space-y-2">
                  {folder.files.map((fileWithText, fileIndex) => {
                    if (!fileWithText.text && !fileWithText.isConverting && !fileWithText.error && !fileWithText.isCancelled) {
                      return null;
                    }

                    const fileKey = `${folderIndex}-${fileIndex}`;
                    const isFileExpanded = expandedConvertedFiles.has(fileKey);

                    return (
                      <div key={fileKey} className="bg-white border rounded-lg p-3">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => onToggleConvertedFile(fileKey)}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <img src={labelImageLogo} alt="PDF" className="w-6 h-6" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                                {fileWithText.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(fileWithText.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {fileWithText.isCancelled && (
                              <span className="text-xs text-yellow-600">⚠️ Cancelled</span>
                            )}
                            {fileWithText.text && !fileWithText.isCancelled && (
                              <>
                                <span className="text-xs text-green-600">✅</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(fileWithText.file.name, fileWithText.text || '', 'txt');
                                  }}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                  title="Download as TXT"
                                >
                                  TXT
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadFile(fileWithText.file.name, fileWithText.text || '', 'json');
                                  }}
                                  className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                                  title="Download as JSON"
                                >
                                  JSON
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(fileWithText.text || '');
                                  }}
                                  className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                                >
                                  Copy
                                </button>
                              </>
                            )}
                            {fileWithText.isConverting && (
                              <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            )}
                            {fileWithText.error && (
                              <span className="text-xs text-red-600">❌ Error</span>
                            )}
                          </div>
                        </div>

                        {/* 텍스트 내용 */}
                        {isFileExpanded && fileWithText.text && !fileWithText.isCancelled && (
                          <div className="mt-2 border-t pt-2">
                            <div className="bg-gray-50 rounded p-3 max-h-64 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-xs text-gray-800">
                                {fileWithText.text}
                              </pre>
                            </div>
                          </div>
                        )}

                        {isFileExpanded && fileWithText.error && (
                          <div className="mt-2 text-red-600 text-xs">
                            ❌ {fileWithText.error}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* 개별 파일들 표시 */}
        {uploadedFiles.map((fileWithText, index) => {
          if (!fileWithText.text && !fileWithText.isConverting && !fileWithText.error && !fileWithText.isCancelled) {
            return null;
          }

          return (
            <div
              key={index}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedFileIndex === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => fileWithText.text ? onCardClick(index) : null}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img src={labelImageLogo} alt="PDF" className="w-8 h-8" />
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-48">
                      {fileWithText.file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(fileWithText.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {fileWithText.text && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(fileWithText.file.name, fileWithText.text || '', 'txt');
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                      title="Download as TXT"
                    >
                      TXT
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(fileWithText.file.name, fileWithText.text || '', 'json');
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                      title="Download as JSON"
                    >
                      JSON
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(fileWithText.text || '');
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>

              {fileWithText.isConverting && (
                <div className="flex items-center gap-2 py-2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-blue-600 text-sm">Converting to text...</span>
                </div>
              )}

              {fileWithText.error && (
                <div className="text-red-600 text-sm py-2">
                  ❌ {fileWithText.error}
                </div>
              )}

              {fileWithText.isCancelled && (
                <div className="text-yellow-600 text-sm py-2">
                  ⚠️ Conversion cancelled
                </div>
              )}

              {fileWithText.text && !fileWithText.isCancelled && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                    ✅ Conversion completed • Click to {selectedFileIndex === index ? 'hide' : 'view'} text
                  </div>

                  {selectedFileIndex === index && (
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {fileWithText.text}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};