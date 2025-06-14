import React from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneWrapperProps {
  onFileSelected: (file: File) => void;
  fileName?: string | null;
}

const DropzoneWrapper: React.FC<DropzoneWrapperProps> = ({ onFileSelected, fileName }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFileSelected(acceptedFiles[0]);
    },
    accept: { 'video/mp4': ['.mp4'] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-[#fffef0]/50 p-8 w-full text-center rounded-xl cursor-pointer hover:bg-[#fffef0]/10 transition-all duration-300 ease-in-out mb-6"
    >
      <input {...getInputProps()} />
      <p className="text-lg font-medium">
        {fileName ? fileName : '🫳 Drag & Drop your MP4 file here, or click to select a file.'}
      </p>
    </div>
  );
};

export default DropzoneWrapper;
