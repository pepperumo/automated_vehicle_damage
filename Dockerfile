# Multi-stage Dockerfile for Vehicle Damage Detection Application - Optimized

# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY react-frontend/package*.json ./

# Install dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY react-frontend/ ./

# Build the React app
RUN npm run build

# Stage 2: Python API Backend - Optimized for Size
FROM python:3.12.0-slim AS python-backend

# Set working directory
WORKDIR /app

# Install only essential system dependencies and clean up in same layer
RUN apt-get update && apt-get install -y \
    # Essential libraries for OpenCV and basic image processing
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    libjpeg62-turbo \
    libpng16-16 \
    # OpenGL libraries for OpenCV headless
    libgl1-mesa-glx \
    libglib2.0-0 \
    # Network tools for health checks
    curl \
    # Build tools (will be removed after pip install)
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies in single layer
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt && \
    # Remove build dependencies to reduce image size
    apt-get purge -y --auto-remove gcc g++ && \
    # Clean pip cache
    pip cache purge && \
    # Remove unnecessary files
    find /usr/local/lib/python3.12 -name "*.pyc" -delete && \
    find /usr/local/lib/python3.12 -name "__pycache__" -delete

# Create necessary directories for data processing
RUN mkdir -p data/uploads data/processed models src/backend

# Copy the YOLO model files
COPY models/best.pt models/
COPY models/yolov8n.pt models/

# Copy API backend source code only
COPY src/backend/ src/backend/

# Set environment variables
ENV FLASK_APP=src/backend/app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Expose API port
EXPOSE 5000

# Health check for API endpoint
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run the Flask API application
CMD ["python", "src/backend/app.py", "--port", "5000"]

# Stage 3: Nginx with React Frontend
FROM nginx:alpine AS nginx-frontend

# Copy React build files from frontend-builder stage
COPY --from=frontend-builder /app/frontend/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
