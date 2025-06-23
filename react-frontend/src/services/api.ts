import axios from 'axios';
import { DetectionResult, UploadResponse } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

export const apiService = {
  // Image detection
  detectImage: async (file: File): Promise<DetectionResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Video detection
  detectVideo: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/predict_img', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get live video feed
  getLiveVideoFeed: (): string => {
    return `${API_BASE_URL}/video_feed`;
  },

  // Stop live video feed
  stopLiveVideoFeed: async (): Promise<void> => {
    await api.post('/stop');
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get('/');
      return true;
    } catch (error) {
      return false;
    }
  },
};
