#!/bin/bash

# Google Cloud Run Deployment Script
# Make sure you have gcloud CLI installed and authenticated

# Configuration
PROJECT_ID="accidentdetector"
SERVICE_NAME="automated-vehicle-damage"
REGION="europe-west1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "=== Google Cloud Run Deployment ==="
echo "Project: $PROJECT_ID"
echo "Service: $SERVICE_NAME"
echo "Region: $REGION"
echo ""

# Build and push Docker image
echo "Building Docker image..."
docker build --build-arg REACT_APP_API_URL=https://automated-vehicle-damage-accidentdetector.europe-west1.run.app -t $IMAGE_NAME .

echo "Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 300 \
  --set-env-vars="REACT_APP_API_URL=https://automated-vehicle-damage-accidentdetector.europe-west1.run.app,PORT=8080" \
  --port 8080 \
  --project $PROJECT_ID

echo ""
echo "Deployment complete!"
echo "Your service URL: https://automated-vehicle-damage-accidentdetector.europe-west1.run.app"
