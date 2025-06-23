# Multi-stage Dockerfile for Vehicle Damage Detection Application
# Supports both Docker Compose (separate containers) and single container deployment

# Build argument to determine deployment type
ARG DEPLOYMENT_TYPE=compose

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

# Stage 2: Python API Backend
FROM python:3.12.0-slim AS python-backend

# Build argument to determine deployment type
ARG DEPLOYMENT_TYPE=compose

# Set working directory
WORKDIR /app

# Install system dependencies based on deployment type
RUN apt-get update && apt-get install -y \
    # Essential libraries for OpenCV and basic image processing
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    libjpeg62-turbo \
    libpng16-16 \
    libgl1-mesa-glx \
    # Network tools for health checks
    curl \
    # Build tools (will be removed after pip install)
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install nginx and supervisor for single container deployment
RUN if [ "$DEPLOYMENT_TYPE" = "single" ]; then \
        apt-get update && apt-get install -y nginx supervisor && \
        rm -rf /var/lib/apt/lists/*; \
    fi

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

# Copy the custom trained YOLO model (required for inference)
COPY models/best.pt models/

# Copy API backend source code
COPY src/backend/ src/backend/

# For single container deployment, also copy frontend files and configs
COPY --from=frontend-builder /app/frontend/build /var/www/html/
COPY nginx/render.conf /etc/nginx/sites-available/render.conf

# Create startup script that handles both deployment modes
RUN echo '#!/bin/bash\n\
if [ "$DEPLOYMENT_TYPE" = "single" ]; then\n\
    # Setup nginx for single container\n\
    rm -f /etc/nginx/sites-enabled/default\n\
    ln -sf /etc/nginx/sites-available/render.conf /etc/nginx/sites-enabled/\n\
    # Create supervisor config\n\
    cat > /etc/supervisor/conf.d/supervisord.conf << EOF\n\
[supervisord]\n\
nodaemon=true\n\
\n\
[program:nginx]\n\
command=nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
\n\
[program:flask]\n\
command=python src/backend/app.py\n\
directory=/app\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
EOF\n\
    # Start supervisor\n\
    exec /usr/bin/supervisord\n\
else\n\
    # Compose mode - just run Flask API\n\
    exec python src/backend/app.py\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Set environment variables
ENV FLASK_APP=src/backend/app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Expose ports
EXPOSE 5000 80

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || curl -f http://localhost/health || exit 1

# Use startup script that handles both modes
CMD ["/app/start.sh"]

# Stage 3: Nginx with React Frontend (for Docker Compose)
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
