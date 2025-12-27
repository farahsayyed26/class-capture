import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

const FileUpload = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4 tracking-tight">
          Class<span className="text-brand-main">Capture</span>
        </h1>
        <p className="text-brand-muted text-lg max-w-lg mx-auto">
          Upload your whiteboard photo to get <br />
          <span className="font-semibold text-brand-main">Clean Notes & Quizzes</span>.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`w-full max-w-xl p-12 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300 group
          ${isDragActive 
            ? 'border-brand-main bg-brand-light/20 scale-105 shadow-xl' 
            : 'border-brand-light/50 hover:border-brand-main hover:bg-white bg-white/50'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-md group-hover:scale-110 transition-transform">
            <UploadCloud className="w-12 h-12 text-brand-main" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-brand-dark">
              {isDragActive ? "Drop it here!" : "Click to Upload"}
            </p>
            <p className="text-brand-light font-medium mt-2">Supports JPG, PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;