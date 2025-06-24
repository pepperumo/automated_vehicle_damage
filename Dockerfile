# Unified Dockerfile for Vehicle Damage Detection Application
# Single image with both React frontend and Flask backend

# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder

# Build arguments for production
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

WORKDIR /app/frontend

# Copy package files
COPY react-frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY react-frontend/ ./

# Build the React app
RUN npm run build && \
    npm cache clean --force

# Stage 2: Python Backend with Frontend served by Flask
FROM python:3.12.0-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    libjpeg62-turbo \
    libpng16-16 \
    libgl1-mesa-glx \
    curl \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt && \
    apt-get purge -y --auto-remove gcc g++ && \
    pip cache purge && \
    find /usr/local/lib/python3.12 -name "*.pyc" -delete && \
    find /usr/local/lib/python3.12 -name "__pycache__" -delete

# Create necessary directories
RUN mkdir -p data/uploads data/processed models src/backend static

# Copy the custom trained YOLO model
COPY models/best.pt models/

# Copy backend source code
COPY src/backend/ src/backend/

# Copy React build files from frontend-builder stage
COPY --from=frontend-builder /app/frontend/build/ ./static/

# Set environment variables
ENV FLASK_APP=src/backend/app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Create necessary directories
RUN mkdir -p data/uploads data/processed

# Expose port 5000 (standardized across all environments)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
    CMD python -c "import requests, os; requests.get(f'http://localhost:{os.getenv(\"PORT\", \"5000\")}/health', timeout=10)"

# Run the Flask application
CMD ["python", "src/backend/app.py"]
