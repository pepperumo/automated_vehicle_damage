import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { useImageDetection } from '../hooks/useDetection';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const ImageDetection: React.FC = () => {
  const { loading, result, error, detectImage, reset } = useImageDetection();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    detectImage(file);
  };

  const handleReset = () => {
    setSelectedFile(null);
    reset();
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header and Upload Section - Combined */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Damage Detection</h1>
          <p className="text-gray-700 mt-2">
            Upload an image of your vehicle to detect and analyze damage using our AI-powered system.
          </p>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Upload Image</h2>
          {!result && !loading && (
          <>
            <FileUpload
              accept="image/*"
              onFileSelect={handleFileSelect}
              loading={loading}
              fileType="image"
            />
            {selectedFile && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Selected file:</span> {selectedFile.name}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
              <span className="text-lg font-medium text-gray-900">Analyzing image...</span>
            </div>
            <p className="text-gray-600 mt-2">
              Our AI is detecting and analyzing vehicle damage. This may take a few moments.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Processing Image</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>        )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Detection Results</h2>
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Analyze Another Image
            </button>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Analysis Complete</h3>
                <p className="text-sm text-green-700 mt-1">
                  Vehicle damage detection has been completed successfully.
                </p>
              </div>
            </div>
          </div>

          {/* Processed Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Processed Image</h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <img
                src={`data:image/png;base64,${result.image}`}
                alt="Processed vehicle with damage detection"
                className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
              />
            </div>
          </div>

          {/* Metadata */}
          {(result.confidence || result.processingTime) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.confidence && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900">Confidence Score</h4>
                  <p className="text-2xl font-bold text-primary-600 mt-1">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              )}
              {result.processingTime && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900">Processing Time</h4>
                  <p className="text-2xl font-bold text-gray-600 mt-1">
                    {result.processingTime.toFixed(2)}s
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Predictions */}
          {result.predictions && result.predictions.length > 0 && (            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Detected Damage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.predictions.map((prediction, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{prediction.class}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Confidence: {(prediction.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        Box: [{prediction.bbox.map((b: number) => b.toFixed(0)).join(', ')}]
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">How to use:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Upload a clear image of the vehicle (JPG, JPEG, or PNG format)</li>
          <li>Wait for the AI system to process and analyze the image</li>
          <li>Review the detection results with highlighted damage areas</li>
          <li>Check the confidence scores and damage classifications</li>
        </ol>
      </div>
    </div>
  );
};

export default ImageDetection;
