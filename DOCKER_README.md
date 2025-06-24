# Vehicle Damage Detection - Docker Setup

This Docker setup provides a complete containerized solution for the Vehicle Damage Detection application with unified Flask backend serving both API and React frontend.

## 🏗️ Architecture

The application uses a **unified single-container architecture**:

### Unified Service:
1. **Flask Application Container**
   - Python 3.12.0 container
   - YOLO model inference engine  
   - REST API endpoints for damage detection
   - Serves React frontend as static files
   - Runs on port 5000 (standardized across all environments)

### Key Features:
- **Multi-stage Docker build** for optimal image size
- **Unified architecture**: Single container serving both API and frontend
- **Production-ready**: Flask serving static React files and API endpoints
- **YOLO Model**: Custom YOLOv8 model (`best.pt`) for damage detection
- **Standardized on port 5000** for all environments (local, Docker, Cloud)

## Prerequisites

- Docker
- At least 4GB RAM available for containers
- The `models/best.pt` file must be present

## Quick Start

1. **Build and run the container:**
   ```bash
   docker build -t vehicle-damage-detection .
   docker run -d -p 5000:5000 vehicle-damage-detection
   ```

2. **Access the application:**
   - **Web Application**: http://localhost:5000
   - **API Health Check**: http://localhost:5000/health
   - **API Endpoints**: http://localhost:5000/predict, /predict_img, etc.

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop the container:**
   ```bash
   docker stop $(docker ps -q --filter ancestor=vehicle-damage-detection)
   ```

## 🌐 Google Cloud Run Deployment

### Prerequisites for Cloud Deployment
1. **Google Cloud CLI** - Install from https://cloud.google.com/sdk/docs/install
2. **Docker** - Already installed
3. **Google Cloud Project** with billing enabled
4. **Container Registry API** enabled

### Step-by-Step Cloud Deployment

#### 1. Install Google Cloud CLI
**Windows:**
- Download from: https://cloud.google.com/sdk/docs/install-sdk#windows
- Or use chocolatey: `choco install gcloudsdk`

**Alternative (if gcloud unavailable):**
- Use Google Cloud Console's built-in Cloud Shell
- Or build locally and push via Docker Desktop

#### 2. Authenticate and Configure
```bash
# Login to Google Cloud
gcloud auth login

# Set your project (replace with your project ID)
gcloud config set project YOUR_PROJECT_ID

# Configure Docker to use gcloud as credential helper
gcloud auth configure-docker
```

#### 3. Tag and Push Docker Image
```bash
# Get your current project ID
PROJECT_ID=$(gcloud config get-value project)

# Tag the image for Google Container Registry
docker tag vehicle-damage-detection gcr.io/$PROJECT_ID/automated-vehicle-damage:latest

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/automated-vehicle-damage:latest
```

#### 4. Deploy to Cloud Run
```bash
# Deploy to Cloud Run
gcloud run deploy automated-vehicle-damage \
  --image gcr.io/$PROJECT_ID/automated-vehicle-damage:latest \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --port 5000 \
  --set-env-vars="PORT=5000"
```

#### 5. Alternative: Manual Console Deployment
If CLI isn't available:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **Cloud Run**
3. Click **Create Service**
4. Choose **Deploy one revision from an existing container image**
5. Use image: `gcr.io/YOUR_PROJECT_ID/automated-vehicle-damage:latest`
6. Set **Container port** to `5000`
7. Set **Memory** to `2 GiB`, **CPU** to `2`
8. Add environment variable: `PORT=5000`
9. Click **Create**

### Docker Desktop Push (Alternative Method)
If you have Docker Desktop with Google Cloud integration:
```bash
# Tag for Artifact Registry (newer alternative to Container Registry)
docker tag vehicle-damage-detection europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/vehicle-damage/automated-vehicle-damage:latest

# Push via Docker Desktop (if authenticated)
docker push europe-west1-docker.pkg.dev/YOUR_PROJECT_ID/vehicle-damage/automated-vehicle-damage:latest
```

### Verify Deployment
After deployment, test your Cloud Run service:
```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe automated-vehicle-damage --region=europe-west1 --format="value(status.url)")

# Test health endpoint
curl $SERVICE_URL/health

# Or open in browser
echo "Visit: $SERVICE_URL"
```

## 📦 Container Structure

### Backend Container (`vehicle-damage-api`)
- **Base**: Python 3.12.0-slim
- **Target**: Stage 2 of multi-stage build
- **Internal Port**: 5000
- **Purpose**: Flask API server with YOLO inference
- **Volumes**: 
  - `./data/uploads:/app/data/uploads` (upload storage)
  - `./data/processed:/app/data/processed` (processed results)
- **Health Check**: `/health` endpoint
- **Dependencies**: OpenCV, YOLO, video processing libraries

### Frontend Container (`vehicle-damage-frontend`)
- **Base**: nginx:alpine  
- **Target**: Stage 3 of multi-stage build
- **Ports**: 80, 3000
- **Purpose**: Serve React app, reverse proxy to API
- **Configuration**: Custom nginx.conf and default.conf
- **Features**: 
  - Static file serving with caching
  - React Router support (SPA routing)
  - API proxying to backend service
  - CORS handling

## API Endpoints

The Flask backend provides these main endpoints:

- `GET /health` - Health check
- `POST /predict` - Image damage detection
- `POST /predict_img` - Alternative prediction endpoint
- `GET /data/processed/<filename>` - Serve processed files
- `POST /video` - Video processing (if implemented)

## File Structure in Container

```
/app/
├── src/backend/          # Flask application
├── static/              # Built React app
├── models/              # YOLO model files
│   └── best.pt         # Custom trained model
├── data/
│   ├── uploads/        # Upload storage (mounted)
│   └── processed/      # Processing results (mounted)
└── requirements.txt    # Python dependencies
```

## Environment Variables

The containers use these environment variables:

- `FLASK_ENV=production`
- `PYTHONPATH=/app`
- `FLASK_APP=src/backend/app.py`

## Development vs Production

### Development
```bash
# Run with local code mounting
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production
```bash
# Use built images
docker-compose up -d
```

## Troubleshooting

### Container Health Checks
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs nginx
```

### Common Issues

1. **Model file not found**
   - Ensure `models/best.pt` exists before building
   - Check container logs: `docker-compose logs backend`

2. **Port conflicts**
   - Change ports in docker-compose.yml if 80/5000 are in use

3. **Memory issues**
   - YOLO models require significant RAM
   - Increase Docker memory allocation if needed

4. **Upload/Processing failures**
   - Check volume mounts are correctly configured
   - Verify file permissions on host directories

## Customization

### Changing Ports
Edit `docker-compose.yml`:
```yaml
services:
  nginx:
    ports:
      - "8080:80"  # Change host port
```

### Adding SSL/HTTPS
1. Add SSL certificates to `./nginx/ssl/`
2. Update `nginx/default.conf` with SSL configuration
3. Expose port 443 in docker-compose.yml

### Custom Model
Replace `models/best.pt` with your custom YOLO model file.

## Performance Optimization

- **Multi-stage build**: Optimizes image size
- **Nginx caching**: Static files cached for 1 day
- **Health checks**: Automatic container restart on failure
- **Gzip compression**: Enabled for text/JSON responses

## Security Features

- **CORS protection**: Configured for allowed origins
- **Security headers**: X-Frame-Options, XSS-Protection, etc.
- **File upload limits**: 100MB max upload size
- **Non-root user**: Containers run with minimal privileges

## Monitoring

Health check endpoints are available:
- Backend: `http://localhost/health`
- Nginx: Built-in health check

## Scaling

To scale the backend:
```bash
docker-compose up --scale backend=3
```

Note: You'll need to configure Nginx load balancing for multiple backend instances.
