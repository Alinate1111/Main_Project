import React, { useState } from "react";
import { UploadArea } from "./components/UploadArea";
import { UploadedFilesList } from "./components/UploadedFilesList";
import { ConvertedFilesList } from "./components/ConvertedFilesList";
import { Category } from "./components/Category";
import { usePDFConverter } from "./hooks/usePDFConverter";

export const Section = (): React.JSX.Element => {
  const [isDragOver, setIsDragOver] = useState(false);
  //여기 리스트안에 넣어주세요 (카테고리 목록변수)
  const categoryList = ["회의록", "보고서", "기획안","테스트문자","값이 늘면 추가로"];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {
    uploadedFiles,
    setUploadedFiles,
    folderGroups,
    setFolderGroups,
    selectedFileIndex,
    expandedConvertedFolders,
    expandedConvertedFiles,
    removeFile,
    convertToText,
    handleCardClick,
    convertFolderToText,
    convertFolderFileToText,
    toggleFolderExpanded,
    removeFolder,
    removeFolderFile,
    toggleConvertedFolder,
    toggleConvertedFile,
  } = usePDFConverter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf",
    );
    const newFiles = files.map(file => ({ file }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf",
      );
      const newFiles = pdfFiles.map(file => ({ file }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf",
      );

      const folderMap: { [key: string]: File[] } = {};

      pdfFiles.forEach(file => {
        const pathParts = (file as any).webkitRelativePath?.split('/') || [];
        if (pathParts.length > 0) {
          const folderName = pathParts[0];
          if (!folderMap[folderName]) {
            folderMap[folderName] = [];
          }
          folderMap[folderName].push(file);
        }
      });

      const newFolderGroups = Object.keys(folderMap).map(folderName => ({
        folderName,
        files: folderMap[folderName].map(file => ({ file })),
        isExpanded: false,
      }));

      setFolderGroups(prev => [...prev, ...newFolderGroups]);
    }
    e.target.value = '';
  };

  const hasUploadedFiles = uploadedFiles.length > 0 || folderGroups.length > 0;

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            인공지는 AI분류
          </h1>
          <p className="text-gray-600">
            글로벌1조
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <UploadArea
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
              onFolderSelect={handleFolderSelect}
            />
{/*
            {hasUploadedFiles && (
              <UploadedFilesList
                folderGroups={folderGroups}
                uploadedFiles={uploadedFiles}
                onToggleFolderExpanded={toggleFolderExpanded}
                onConvertFolder={convertFolderToText}
                onRemoveFolder={removeFolder}
                onConvertFolderFile={convertFolderFileToText}
                onRemoveFolderFile={removeFolderFile}
                onConvertFile={convertToText}
                onRemoveFile={removeFile}
              />
            )}*/ }
          </div>
          <div className="space-y-2">
              <Category
                categoryList={categoryList}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
              />
          </div>
          <div>
            <ConvertedFilesList
              folderGroups={folderGroups}
              uploadedFiles={uploadedFiles}
              expandedConvertedFolders={expandedConvertedFolders}
              expandedConvertedFiles={expandedConvertedFiles}
              selectedFileIndex={selectedFileIndex}
              onToggleConvertedFolder={toggleConvertedFolder}
              onToggleConvertedFile={toggleConvertedFile}
              onCardClick={handleCardClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
};