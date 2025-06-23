export interface DetectionResult {
  image: string; // base64 encoded image
  predictions?: Array<{
    class: string;
    confidence: number;
    bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  }>;
  confidence?: number;
  processingTime?: number;
}

export interface UploadResponse {
  success: boolean;
  message?: string;
  data?: DetectionResult;
  output_path?: string;
  video_url?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
