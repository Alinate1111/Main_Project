import React, { useState } from "react";
import { UploadArea } from "./components/UploadArea";
import { UploadedFilesList } from "./components/UploadedFilesList";
import { ConvertedFilesList } from "./components/ConvertedFilesList";
import { Category } from "./components/Category";
import { Toplogin } from "./components/Toplogin";
import { Totalcount } from "./components/Totalcount";
import { LoginModal } from "./components/LoginModal";
import { usePDFConverter } from "./hooks/usePDFConverter";

export const Section = (): React.JSX.Element => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
      <Toplogin
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      <div className="max-w-7xl mx-auto">

    
          <div className="grid grid-cols-6 gap-1 mt-5">
            <div className="grid grid-cols-2 col-start-2 col-span-4">
              <h1 className="text-right text-3xl font-bold text-gray-900 mb-2 py-5">
              인공지능 AI분류
            </h1>
            <Totalcount />
            </div>
            
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
            )}
          </div>
          <div className="h-md bg-white rounded-xl  rounded-xl flex flex-col space-y-2">
              <Category
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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </section>
  );
};