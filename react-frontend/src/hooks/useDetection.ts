import { useState, useCallback } from 'react';
import { apiService } from '../services/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DetectionResult, UploadResponse } from '../types/api';

export const useImageDetection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const detectImage = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await apiService.detectImage(file);
      setResult(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process image');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    result,
    error,
    detectImage,
    reset,
  };
};

export const useVideoDetection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const detectVideo = useCallback(async (file: File): Promise<UploadResponse | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setResult(null);

    try {
      const response = await apiService.detectVideo(file);
      setResult(response);
      setSuccess(true);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process video');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSuccess(false);
    setError(null);
    setLoading(false);
    setResult(null);
  }, []);

  return {
    loading,
    error,
    success,
    result,
    detectVideo,
    reset,
  };
};
