# Vehicle Damage Detection - Docker Setup

This Docker setup provides a complete containerized solution for the Vehicle Damage Detection application with separated React frontend and Flask API backend services.

## 🏗️ Architecture

The application uses a **separated multi-service architecture**:

### Services:
1. **Flask API Backend** (`backend` service)
   - Python 3.12.0 container
   - YOLO model inference engine  
   - REST API endpoints for damage detection
   - Runs on port 5000 (internal)

2. **React Frontend** (`frontend` service)
   - Nginx container serving React build
   - TypeScript-based UI
   - Runs on port 80/3000

3. **Service Communication**
   - Nginx reverse proxy routes `/api/*` and specific endpoints to Flask backend
   - React frontend served directly by nginx
   - CORS configured for cross-service communication

### Key Features:
- **Multi-stage Docker build** for optimal image size
- **Separated concerns**: API backend independent of frontend
- **Production-ready**: Nginx serving static files, Flask handling API only
- **YOLO Model**: Custom YOLOv8 model (`best.pt`) for damage detection

## Prerequisites

- Docker
- Docker Compose
- At least 4GB RAM available for containers
- The `models/best.pt` file must be present

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - **React Frontend**: http://localhost (port 80) or http://localhost:3000
   - **API Health Check**: http://localhost/health (proxied through nginx)
   - **Direct API Access**: http://localhost:5000/health (development only)
   - **API Base URL**: http://localhost/api/ (for React app API calls)

3. **Stop all services:**
   ```bash
   docker-compose down
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
