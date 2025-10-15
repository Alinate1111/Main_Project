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
      {/*주석처리 2025-10-13수정*/}
      {/* Folder List */}
      {/* File List */}
      

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
      )}
    </div>
  );
};