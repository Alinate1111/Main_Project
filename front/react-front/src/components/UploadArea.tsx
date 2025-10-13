import React, { useRef } from "react";
import labelImageLogo from "../label-image-logo.svg";
import vector from "../vector.svg";

interface UploadAreaProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onFolderSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleBrowseFolderClick = () => {
    folderInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload PDF Files</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF files"
      >
        <img
          src={labelImageLogo}
          alt="PDF upload"
          className="w-16 h-16 mx-auto mb-4"
        />
        <p className="text-gray-600 mb-2">
          Drag & drop PDF files here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          or click to browse
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleBrowseFilesClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <img src={vector} alt="" className="w-4 h-4" />
            Choose Files
          </button>
          <button
            onClick={handleBrowseFolderClick}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            📁 Choose Folder
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        onChange={onFileSelect}
        className="hidden"
      />

      <input
        ref={folderInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        // @ts-ignore
        webkitdirectory=""
        directory=""
        onChange={onFolderSelect}
        className="hidden"
      />
    </div>
  );
};