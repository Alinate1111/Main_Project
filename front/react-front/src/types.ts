export interface FileWithText {
  file: File;
  text?: string;
  isConverting?: boolean;
  error?: string;
  folderName?: string;
  isCancelled?: boolean;
}

export interface FolderGroup {
  folderName: string;
  files: FileWithText[];
  isExpanded: boolean;
  isConverting?: boolean;
  convertedCount?: number;
  totalCount?: number;
}