import { useState } from "react";
import { FileWithText, FolderGroup } from "../types";

export const usePDFConverter = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithText[]>([]);
  const [folderGroups, setFolderGroups] = useState<FolderGroup[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [expandedConvertedFolders, setExpandedConvertedFolders] = useState<Set<number>>(new Set());
  const [expandedConvertedFiles, setExpandedConvertedFiles] = useState<Set<string>>(new Set());

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (selectedFileIndex === index) {
      setSelectedFileIndex(null);
    }
  };

  const convertToText = async (fileIndex: number) => {
    const fileWithText = uploadedFiles[fileIndex];
    if (!fileWithText) return;

    setUploadedFiles(prev => prev.map((item, i) =>
      i === fileIndex ? { ...item, isConverting: true, error: undefined } : item
    ));

    try {
      const formData = new FormData();
      formData.append('pdfFile', fileWithText.file);

      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const data = await response.json();

      setUploadedFiles(prev => prev.map((item, i) =>
        i === fileIndex ? { ...item, text: data.text, isConverting: false } : item
      ));
    } catch (error: any) {
      setUploadedFiles(prev => prev.map((item, i) =>
        i === fileIndex ? { ...item, error: error.message || 'Failed to convert PDF', isConverting: false } : item
      ));
    }
  };

  const handleCardClick = (index: number) => {
    setSelectedFileIndex(selectedFileIndex === index ? null : index);
  };

  const convertFolderToText = async (folderIndex: number) => {
    const folder = folderGroups[folderIndex];
    if (!folder) return;

    const filesToConvert = folder.files.filter(f => !f.text && !f.error);
    if (filesToConvert.length === 0) return;

    setFolderGroups(prev => prev.map((f, i) =>
      i === folderIndex ? { ...f, isConverting: true, convertedCount: 0, totalCount: filesToConvert.length } : f
    ));

    setFolderGroups(prev => prev.map((f, i) => {
      if (i === folderIndex) {
        const updatedFiles = f.files.map(file => {
          if (file.isCancelled && !file.text) {
            return { ...file, isCancelled: false };
          }
          return file;
        });
        return { ...f, files: updatedFiles };
      }
      return f;
    }));

    let completedCount = 0;

    for (let fileIndex = 0; fileIndex < folder.files.length; fileIndex++) {
      const fileWithText = folder.files[fileIndex];

      if (fileWithText.text || fileWithText.error) {
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('pdfFile', fileWithText.file);

        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Conversion failed');
        }

        const data = await response.json();

        completedCount++;
        setFolderGroups(prev => prev.map((f, i) => {
          if (i === folderIndex) {
            const updatedFiles = f.files.map((item, j) =>
              j === fileIndex ? { ...item, text: data.text, isConverting: false } : item
            );
            return { ...f, files: updatedFiles, convertedCount: completedCount };
          }
          return f;
        }));
      } catch (error: any) {
        completedCount++;
        setFolderGroups(prev => prev.map((f, i) => {
          if (i === folderIndex) {
            const updatedFiles = f.files.map((item, j) =>
              j === fileIndex ? { ...item, error: error.message || 'Failed to convert PDF', isConverting: false } : item
            );
            return { ...f, files: updatedFiles, convertedCount: completedCount };
          }
          return f;
        }));
      }
    }

    setFolderGroups(prev => prev.map((f, i) =>
      i === folderIndex ? { ...f, isConverting: false } : f
    ));
  };

  const convertFolderFileToText = async (folderIndex: number, fileIndex: number) => {
    const folder = folderGroups[folderIndex];
    if (!folder) return;

    const fileWithText = folder.files[fileIndex];
    if (!fileWithText) return;

    setFolderGroups(prev => prev.map((f, i) => {
      if (i === folderIndex) {
        const updatedFiles = f.files.map((item, j) =>
          j === fileIndex ? { ...item, isConverting: true, error: undefined } : item
        );
        return { ...f, files: updatedFiles };
      }
      return f;
    }));

    try {
      const formData = new FormData();
      formData.append('pdfFile', fileWithText.file);

      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const data = await response.json();

      setFolderGroups(prev => prev.map((f, i) => {
        if (i === folderIndex) {
          const updatedFiles = f.files.map((item, j) =>
            j === fileIndex ? { ...item, text: data.text, isConverting: false } : item
          );
          return { ...f, files: updatedFiles };
        }
        return f;
      }));
    } catch (error: any) {
      setFolderGroups(prev => prev.map((f, i) => {
        if (i === folderIndex) {
          const updatedFiles = f.files.map((item, j) =>
            j === fileIndex ? { ...item, error: error.message || 'Failed to convert PDF', isConverting: false } : item
          );
          return { ...f, files: updatedFiles };
        }
        return f;
      }));
    }
  };

  const toggleFolderExpanded = (folderIndex: number) => {
    setFolderGroups(prev => prev.map((f, i) =>
      i === folderIndex ? { ...f, isExpanded: !f.isExpanded } : f
    ));
  };

  const removeFolder = (folderIndex: number) => {
    const folder = folderGroups[folderIndex];

    if (folder.isConverting || folder.files.some(f => f.isConverting)) {
      setFolderGroups(prev => prev.map((f, i) => {
        if (i === folderIndex) {
          const updatedFiles = f.files.map(file => {
            if (file.text) {
              return file;
            } else {
              return {
                ...file,
                isCancelled: true,
                isConverting: false
              };
            }
          });
          return { ...f, files: updatedFiles, isConverting: false };
        }
        return f;
      }));
    } else {
      setFolderGroups(prev => prev.filter((_, i) => i !== folderIndex));
    }
  };

  const removeFolderFile = (folderIndex: number, fileIndex: number) => {
    const folder = folderGroups[folderIndex];
    const fileWithText = folder.files[fileIndex];

    if (fileWithText && (fileWithText.isConverting || fileWithText.text)) {
      setFolderGroups(prev => prev.map((f, i) => {
        if (i === folderIndex) {
          const updatedFiles = f.files.map((file, j) =>
            j === fileIndex ? { ...file, isCancelled: true, isConverting: false } : file
          );
          return { ...f, files: updatedFiles };
        }
        return f;
      }));
    } else {
      setFolderGroups(prev => prev.map((f, i) => {
        if (i === folderIndex) {
          return { ...f, files: f.files.filter((_, j) => j !== fileIndex) };
        }
        return f;
      }).filter(f => f.files.length > 0));
    }
  };

  const toggleConvertedFolder = (folderIndex: number) => {
    const newExpanded = new Set(expandedConvertedFolders);
    if (expandedConvertedFolders.has(folderIndex)) {
      newExpanded.delete(folderIndex);
    } else {
      newExpanded.add(folderIndex);
    }
    setExpandedConvertedFolders(newExpanded);
  };

  const toggleConvertedFile = (fileKey: string) => {
    const newExpanded = new Set(expandedConvertedFiles);
    if (expandedConvertedFiles.has(fileKey)) {
      newExpanded.delete(fileKey);
    } else {
      newExpanded.add(fileKey);
    }
    setExpandedConvertedFiles(newExpanded);
  };

  return {
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
  };
};