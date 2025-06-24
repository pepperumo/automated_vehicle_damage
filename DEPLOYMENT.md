# Deployment Guide

## Single Dockerfile for Multiple Platforms

The main `Dockerfile` now supports both:
- **Render** (port 5000)
- **Google Cloud Run** (port 8080)

## Environment Variables

### For Google Cloud Run:
- `REACT_APP_API_URL=https://automated-vehicle-damage-400484112127.europe-west1.run.app`
- `PORT=8080`

### For Render:
- `REACT_APP_API_URL=https://accidentdetector-0naw.onrender.com`
- `PORT=5000` (default)

## Deployment Commands

### Google Cloud Run:
```bash
# Build with Google Cloud Run API URL
docker build --build-arg REACT_APP_API_URL=https://automated-vehicle-damage-400484112127.europe-west1.run.app -t gcr.io/400484112127/automated-vehicle-damage .

# Push to registry
docker push gcr.io/400484112127/automated-vehicle-damage

# Deploy to Cloud Run
gcloud run deploy automated-vehicle-damage \
  --image gcr.io/400484112127/automated-vehicle-damage \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --set-env-vars="REACT_APP_API_URL=https://automated-vehicle-damage-400484112127.europe-west1.run.app,PORT=8080" \
  --port 8080
```

### Render:
```bash
# Build with Render API URL
docker build --build-arg REACT_APP_API_URL=https://accidentdetector-0naw.onrender.com -t automated-vehicle-damage .

# Deploy through Render's Docker registry
```

## Port Configuration

The Dockerfile now:
- Exposes both ports 5000 and 8080
- Uses environment variable `PORT` to determine which port to run on
- Has flexible health check that adapts to the port being used
