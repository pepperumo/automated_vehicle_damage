#!/bin/bash

# Deployment script for Vehicle Damage Detection App

echo "Building React frontend for production..."

# Set production environment
export NODE_ENV=production
export REACT_APP_API_URL=https://accidentdetector-0naw.onrender.com

# Navigate to frontend directory
cd react-frontend

# Install dependencies
npm install

# Build for production
npm run build

echo "Build completed successfully!"
echo "Built files are in: react-frontend/build/"
echo ""
echo "To serve the built files, copy them to your backend's static folder:"
echo "cp -r build/* ../src/backend/static/"
echo ""
echo "Backend API endpoints:"
echo "- POST /predict (for images)"
echo "- POST /image (fallback for images)"
echo "- POST /predict_img (for videos)"
echo "- GET /health (health check)"
