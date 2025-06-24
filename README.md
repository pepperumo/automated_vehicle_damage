### 🌐 Live Demo
Try the deployed application: **[https://automated-vehicle-damage-400484112127.europe-west1.run.app/](https://automated-vehicle-damage-400484112127.europe-west1.run.app/)**

# Vehicle Damage Detection System

A comprehensive system for automated vehicle damage detection and severity estimation using deep learning, featuring a modern React TypeScript frontend and Flask backend API.

## 🚗 Overview

This system provides an AI-powered solution for detecting and analyzing vehicle damage through:
- **Image Analysis**: Upload vehicle photos for instant damage detection
- **Video Processing**: Frame-by-frame analysis of video files
- **Live Detection**: Real-time damage detection using camera feeds
- **Performance Analytics**: Comprehensive metrics and system statistics

## 🏗️ Architecture

### Frontend (React TypeScript)
- Modern, responsive user interface built with React 18 and TypeScript
- Tailwind CSS for styling and responsive design
- Real-time file upload with drag & drop functionality
- Live video streaming capabilities
- Performance dashboard with analytics

### Backend (Flask API)
- RESTful API built with Flask and Python
- YOLOv8-based deep learning model for damage detection
- Real-time video processing with OpenCV
- CORS-enabled for frontend integration
- Comprehensive error handling and logging

### AI/ML Components
- Custom-trained YOLOv8 model for vehicle damage detection
- Support for multiple damage types and severity levels
- Real-time inference with GPU acceleration support
- Confidence scoring and bounding box detection

## 🚀 Quick Start



### Prerequisites
- **Node.js** (v16+)
- **Python** (v3.8+)
- **Git**

### One-Command Setup

**Windows:**
```bash
start_dev.bat
```

**macOS/Linux:**
```bash
chmod +x start_dev.sh
./start_dev.sh
```

This will automatically:
1. Create virtual environments
2. Install all dependencies
3. Start both backend and frontend servers
4. Open the application in your browser

### Manual Setup

See the detailed [Setup Guide](SETUP_GUIDE.md) for manual installation instructions.
├── data/                      # Data storage
│   ├── external/             # External data sources
│   ├── processed/            # Processed data and outputs
│   ├── raw/                  # Raw data files
│   ├── training/             # ML training dataset
│   │   ├── images/           # Training and validation images
│   │   ├── labels/           # YOLO format labels
│   │   └── data.yaml         # Dataset configuration
│   └── uploads/              # User uploaded files
├── docs/                      # Documentation
├── models/                    # Model storage
│   ├── best.pt               # Custom trained model
│   ├── yolov8n.pt            # YOLOv8 nano model
│   ├── pretrained/           # Pre-trained models
│   └── trained/              # Custom trained models
├── notebooks/                 # Jupyter notebooks for experimentation
│   └── Yolov8_object_detection_on_custom_dataset.ipynb
├── other/                     # Additional project files and documentation
├── src/                       # Source code
│   ├── backend/              # Backend Flask application
│   │   ├── app.py            # Main Flask application
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic services
│   │   └── utils/            # Utility functions
│   ├── frontend/             # Frontend assets
│   │   ├── static/           # CSS, JS, images, fonts
│   │   └── templates/        # HTML templates
│   └── requirements.txt      # Python dependencies (src level)
└── tests/                     # Test files
```

## Features

- **Image Upload & Analysis**: Upload vehicle images for damage detection
- **Video Processing**: Process video files for damage analysis
- **Real-time Detection**: Live webcam feed with real-time damage detection
- **Performance Metrics**: View model accuracy and performance statistics
- **User Interface**: Clean, responsive web interface

## Installation

1. Clone the repository
2. Create a virtual environment: `python -m venv .venv`
3. Activate the environment:
   - Windows: `activate_env.bat`
   - Unix/Linux: `source activate_venv.sh`
4. Install dependencies: `pip install -r requirements.txt`

## Usage

Run the application from the backend directory:

```bash
cd src/backend
python app.py
```

Or specify a custom port:

```bash
cd src/backend
python app.py --port 8000
```

The application will be available at `http://localhost:5000` (or your specified port)

## API Endpoints

- `/` or `/first` - Home page
- `/login` - Login page
- `/image` - Image upload and detection
- `/video` - Video processing
- `/webcam` - Real-time webcam detection
- `/performance` - Performance metrics
- `/chart` - Analysis charts

## Model Information

The system uses YOLOv8 (You Only Look Once) for real-time object detection, specifically trained for vehicle damage detection. The trained model (`models/best.pt`) can identify various types of vehicle damage including:

- Dents
- Scratches
- Broken parts
- Windshield damage
- Body damage

## Technical Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **ML Framework**: YOLOv8 (Ultralytics)
- **Computer Vision**: OpenCV
- **Image Processing**: PIL (Pillow)

## Development

The project follows a modular structure with clear separation between frontend, backend, and ML components. All static assets and templates are properly organized for maintainability.
