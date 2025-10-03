
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    onFileChange(selectedFile || null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-center">1. Upload Your Document</h3>
        <div 
            className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-sky-500 dark:hover:border-sky-500 transition-colors"
            onClick={handleButtonClick}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf"
            />
            <div className="flex flex-col items-center justify-center space-y-2 text-slate-500 dark:text-slate-400">
                <UploadIcon />
                {file ? (
                    <p className="font-semibold text-sky-600 dark:text-sky-400">{file.name}</p>
                ) : (
                    <>
                        <p className="font-semibold">Click to upload or drag & drop</p>
                        <p className="text-sm">PDF only, max 20MB</p>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};
