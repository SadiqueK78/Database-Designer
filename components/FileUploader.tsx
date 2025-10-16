
import React, { useCallback, useState } from 'react';
import { ERFile } from '../types';

interface FileUploaderProps {
  onFileSelect: (file: ERFile) => void;
  clearFile: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, clearFile }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.type.startsWith('image/')) {
          const base64Content = content.split(',')[1];
          onFileSelect({ name: file.name, type: file.type, content: base64Content });
        } else {
          onFileSelect({ name: file.name, type: file.type, content });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setFileName(null);
    clearFile();
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if(input) input.value = '';
  };

  return (
    <div className="w-full">
      <label htmlFor="file-upload" className="cursor-pointer bg-primary-500 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-600 transition-colors w-full text-center inline-block">
        {fileName ? 'Change File' : 'Upload ER Diagram'}
      </label>
      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, .json, .txt, .md" />
      {fileName && (
        <div className="mt-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
          <span>{fileName}</span>
          <button onClick={handleClear} className="text-red-500 hover:text-red-700 font-semibold">
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
