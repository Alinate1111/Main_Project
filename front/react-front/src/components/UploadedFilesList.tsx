import React from "react";
import { FileWithText, FolderGroup } from "../types";
import labelImageLogo from "../label-image-logo.svg";

interface UploadedFilesListProps {
  folderGroups: FolderGroup[];
  uploadedFiles: FileWithText[];
  onToggleFolderExpanded: (folderIndex: number) => void;
  onConvertFolder: (folderIndex: number) => void;
  onRemoveFolder: (folderIndex: number) => void;
  onConvertFolderFile: (folderIndex: number, fileIndex: number) => void;
  onRemoveFolderFile: (folderIndex: number, fileIndex: number) => void;
  onConvertFile: (fileIndex: number) => void;
  onRemoveFile: (fileIndex: number) => void;
}

export const UploadedFilesList: React.FC<UploadedFilesListProps> = ({
  folderGroups,
  uploadedFiles,
  onToggleFolderExpanded,
  onConvertFolder,
  onRemoveFolder,
  onConvertFolderFile,
  onRemoveFolderFile,
  onConvertFile,
  onRemoveFile,
}) => {
  return (
    <div className="space-y-6">
      {/* Folder List */}
      {folderGroups.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Folders ({folderGroups.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {folderGroups.map((folder, folderIndex) => (
              <div key={folderIndex} className="border rounded-lg">
                <div className="flex items-center justify-between p-3">
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => onToggleFolderExpanded(folderIndex)}
                  >
                    <span className="text-gray-600">
                      {folder.isExpanded ? '📂' : '📁'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {folder.folderName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {folder.files.length} PDF files
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!folder.isConverting && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onConvertFolder(folderIndex);
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Convert All
                      </button>
                    )}
                    {folder.isConverting && (
                      <div className="flex items-center gap-2 px-3 py-1">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <span className="text-blue-600 text-sm">
                          Converting {folder.convertedCount || 0}/{folder.totalCount || 0}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFolder(folderIndex);
                      }}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* 펼쳐진 상태일 때 파일 목록 표시 */}
                {folder.isExpanded && (
                  <div className="border-t bg-gray-50 p-3 space-y-2">
                    {folder.files.map((fileWithText, fileIndex) => (
                      <div key={fileIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <img src={labelImageLogo} alt="PDF" className="w-6 h-6" />
                          <div>
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
                            <span className="text-xs text-green-600">✅ Converted</span>
                          )}
                          {fileWithText.isConverting && (
                            <div className="flex items-center gap-1">
                              <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            </div>
                          )}
                          {!fileWithText.text && !fileWithText.isConverting && !fileWithText.isCancelled && (
                            <button
                              onClick={() => onConvertFolderFile(folderIndex, fileIndex)}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              Convert
                            </button>
                          )}
                          <button
                            onClick={() => onRemoveFolderFile(folderIndex, fileIndex)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File List */}
      {/*주석처리 2025-10-13수정 */}
      {/*
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uploadedFiles.map((fileWithText, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
                <div className="flex items-center gap-2">
                  {!fileWithText.text && !fileWithText.isConverting && (
                    <button
                      onClick={() => onConvertFile(index)}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Convert
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveFile(index)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}*/}
    </div>
  );
};