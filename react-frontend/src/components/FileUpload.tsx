import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, Video } from 'lucide-react';

interface FileUploadProps {
  accept: string;
  onFileSelect: (file: File) => void;
  loading?: boolean;
  maxSize?: number;
  fileType: 'image' | 'video';
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  onFileSelect,
  loading = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  fileType
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      [accept]: []
    },
    maxSize,
    multiple: false,
    disabled: loading
  });

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {fileType === 'image' ? (
            <FileImage className="h-12 w-12 text-gray-400" />
          ) : (
            <Video className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? (
                `Drop the ${fileType} here...`
              ) : (
                `Drag & drop a ${fileType} here, or click to select`
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {fileType === 'image' ? 'JPG, JPEG, PNG up to 10MB' : 'MP4 up to 10MB'}
            </p>
          </div>

          {!isDragActive && !loading && (
            <Upload className="h-6 w-6 text-gray-400" />
          )}

          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          )}
        </div>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name}>
                <strong>{file.name}</strong>:
                <ul className="mt-1 ml-4">
                  {errors.map((error) => (
                    <li key={error.code} className="list-disc">
                      {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected File */}
      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {fileType === 'image' ? (
                <FileImage className="h-5 w-5 text-gray-400" />
              ) : (
                <Video className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={loading}
              title="Remove file"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
