import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { useVideoDetection } from '../hooks/useDetection';
import { AlertCircle, CheckCircle, RefreshCw, Play } from 'lucide-react';

const VideoDetection: React.FC = () => {
  const { loading, error, success, detectVideo, reset } = useVideoDetection();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const handleFileSelect = async (file: File) => {
    const result = await detectVideo(file);
    if (result?.video_url) {
      // Use the API base URL to construct the full video URL
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const fullVideoUrl = `${API_BASE_URL}${result.video_url}`;
      console.log('Video URL constructed:', fullVideoUrl);
      console.log('Backend response:', result);
      setVideoUrl(fullVideoUrl);
    }
  };

  const handleReset = () => {
    reset();
    setVideoUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Video Damage Detection</h1>
        <p className="text-gray-600">
          Upload a video file to analyze vehicle damage frame by frame using our AI system.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Video</h2>
        
        {!success && !loading && (
          <FileUpload
            accept="video/mp4"
            onFileSelect={handleFileSelect}
            loading={loading}
            fileType="video"
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 animate-spin text-primary-600" />
              <span className="text-lg font-medium text-gray-900">Processing video...</span>
            </div>
            <p className="text-gray-600 mt-2">
              Our AI is analyzing each frame for vehicle damage. This may take several minutes depending on video length.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Processing Video</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Video Processing Complete</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your video has been processed successfully. The processed video with damage detection is ready.
                  </p>
                </div>
              </div>
            </div>            {/* Processed Video Player */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Processed Video</h3>              <div className="bg-gray-900 rounded-lg p-4">
                {videoUrl ? (
                  <video
                    controls
                    className="w-full max-h-96 rounded"
                    key={videoUrl} // Force re-render when URL changes
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-800 rounded">
                    <div className="text-center">
                      <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400 text-sm">
                        Video will appear here after processing
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Process Another Video
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">How to use:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Upload a clear video file of the vehicle (MP4 format recommended)</li>
          <li>Wait for the AI system to process each frame of the video</li>
          <li>View the processed video with damage detection overlays</li>
          <li>Download or share the processed video for further analysis</li>
        </ol>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <Play className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Frame-by-Frame Analysis</h4>
            <p className="text-sm text-gray-600 mt-1">
              Every frame is analyzed for comprehensive damage detection
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">High Accuracy</h4>
            <p className="text-sm text-gray-600 mt-1">
              Advanced YOLO model ensures precise damage identification
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Real-time Processing</h4>
            <p className="text-sm text-gray-600 mt-1">
              Efficient processing pipeline for quick results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDetection;
