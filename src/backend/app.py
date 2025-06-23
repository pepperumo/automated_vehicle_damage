# Vehicle Damage Detection API
# Version: 1.0.1 - Added CORS fixes and fallback endpoints for deployment
# Updated: 2025-06-24

import argparse
import io
import cv2
import json
from re import DEBUG, sub
from flask import Flask, request, send_file, Response, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename, send_from_directory
import os
from ultralytics import YOLO
from PIL import Image
import base64
import torch

# Monkey patch torch.load to use weights_only=False for YOLO models
original_torch_load = torch.load

def patched_torch_load(f, map_location=None, pickle_module=None, **kwargs):
    # Force weights_only=False for model loading
    kwargs['weights_only'] = False
    return original_torch_load(f, map_location=map_location, pickle_module=pickle_module, **kwargs)

# Apply the patch
torch.load = patched_torch_load

# Get the absolute path to the models directory
basepath = os.path.dirname(__file__)
models_dir = os.path.abspath(os.path.join(basepath, '../../models'))
best_model_path = os.path.join(models_dir, 'best.pt')

# Load the custom trained model for vehicle damage detection
if os.path.exists(best_model_path):
    print(f"Loading custom vehicle damage detection model from: {best_model_path}")
    model = YOLO(best_model_path)
else:
    raise FileNotFoundError(f"Required custom model not found at {best_model_path}. Please ensure best.pt is available.")

ALLOWED_EXTENSIONS = set(['jpg', 'jpeg', 'png'])
PORT_NUMBER = 5000

# Configure Flask app with static files for React frontend
app = Flask(__name__, static_folder='../../static', static_url_path='/')

# Enable CORS for React frontend and Docker environment  
CORS(app, origins=[
    'http://localhost:3000', 
    'http://localhost', 
    'http://127.0.0.1:3000', 
    'http://nginx',
    'https://vehicle-damage-app.onrender.com',
    'https://*.onrender.com'
])

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = Response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Configure upload folder
upload_dir = os.path.abspath(os.path.join(basepath, '../../data/uploads'))
app.config['UPLOAD_FOLDER'] = upload_dir
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS


def generate():
    cap = cv2.VideoCapture(0)
    while cap.isOpened():
        success, frame = cap.read()

        if success:
            # Run YOLOv8 inference on the frame
            results = model(frame)

            # Visualize the results on the frame
            annotated_frame = results[0].plot()

            # Encode the frame as JPEG
            ret, jpeg = cv2.imencode('.jpg', annotated_frame)

            # Yield the JPEG data to Flask
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')

            key = cv2.waitKey(50) & 0xFF
            if key == 27 or key == ord("q"):  # Terminate the loop on 'q' key
                break

    # Release the webcam and redirect to another page
    cap.release()
    cv2.destroyAllWindows()
    return {'status': 'stream_ended'}  # Return JSON instead of redirect
         
@app.route('/')
def serve_react_app():
    """Serve the React application"""
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_react_routes(path):
    """Serve React routes - fallback to index.html for client-side routing"""
    if path.startswith('api/'):
        # Don't handle API routes here
        return "API endpoint not found", 404
    try:
        return app.send_static_file(path)
    except:
        # Fallback to React app for client-side routing
        return app.send_static_file('index.html')

# Removed template-based routes - using React frontend only


@app.route('/image', methods=['POST'])
def image_fallback():
    """Fallback endpoint for compatibility - redirects to predict"""
    return predict()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print(f"Predict endpoint called - Content-Type: {request.content_type}")
        print(f"Files in request: {list(request.files.keys())}")
        
        # Check if the file input is empty
        if 'file' not in request.files:
            print("Error: No file provided in request")
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        print(f"File received: {file.filename}, Size: {file.content_length}")
        
        # Check if the filename is empty
        if file.filename == '':
            print("Error: No file selected")
            return jsonify({'error': 'No file selected'}), 400

        # Check if the uploaded file is an MP4 file
        if file.filename.endswith('.mp4'):
            print("Error: MP4 file submitted to wrong endpoint")
            return jsonify({'error': 'Video files not supported in this endpoint. Use /predict_img instead.'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print(f"Processing file: {filename}")
            
            upl_img = Image.open(file)
            print(f"Image opened successfully: {upl_img.size}")
            
            # Run prediction
            import time
            start_time = time.time()
            print("Running model prediction...")
            result = model.predict(source=upl_img)[0]
            processing_time = time.time() - start_time
            print(f"Prediction completed in {processing_time:.2f} seconds")
            
            # Convert result to image
            res_img = Image.fromarray(result.plot())
            image_byte_stream = io.BytesIO()
            res_img.save(image_byte_stream, format='PNG')
            image_byte_stream.seek(0)
            image_base64 = base64.b64encode(image_byte_stream.read()).decode('utf-8')
            print(f"Result image generated, size: {len(image_base64)} chars")
            
            # Extract predictions data
            predictions = []
            if hasattr(result, 'boxes') and result.boxes is not None:
                print(f"Found {len(result.boxes)} detections")
                for i, box in enumerate(result.boxes):
                    predictions.append({
                        'class': result.names[int(box.cls.item())] if hasattr(result, 'names') else f'Class_{int(box.cls.item())}',
                        'confidence': float(box.conf.item()),
                        'bbox': box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                    })
            else:
                print("No detections found")
            
            response_data = {
                'image': image_base64,
                'predictions': predictions,
                'processingTime': processing_time,
                'confidence': max([p['confidence'] for p in predictions]) if predictions else 0.0
            }
            
            print("Sending successful response")
            return jsonify(response_data)
        else:
            print(f"Error: Invalid file format for {file.filename}")
            return jsonify({'error': 'Invalid file format. Please upload JPG, JPEG, or PNG files.'}), 400
            
    except Exception as e:
        print(f"Error in predict: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500

# Removed template-based routes - using React frontend only

@app.route("/predict_img", methods=["GET", "POST"])
def predict_img():
    if request.method == "POST":
        try:
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
                
            f = request.files['file']
            if f.filename == '':
                return jsonify({'error': 'No file selected'}), 400
                
            basepath = os.path.dirname(__file__)
            filepath = os.path.join(basepath, '../../data/uploads', f.filename)
            print("upload folder is ", filepath)
            
            # Create upload directory if it doesn't exist
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            f.save(filepath)
            
            file_extension = f.filename.rsplit('.', 1)[1].lower()

            if file_extension == 'mp4':
                video_path = filepath
                cap = cv2.VideoCapture(video_path)

                frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                fps = int(cap.get(cv2.CAP_PROP_FPS)) or 20  # Use original FPS or default to 20

                # Create output directory if it doesn't exist
                output_dir = os.path.join(basepath, '../../data/processed')
                os.makedirs(output_dir, exist_ok=True)
                output_path = os.path.join(output_dir, 'output.mp4')

                # Use web-compatible codec
                fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Keep mp4v for now, will try other options if needed
                out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

                frame_count = 0
                processed_frames = 0
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break

                    try:
                        results = model(frame, save=False)
                        res_plotted = results[0].plot()
                        out.write(res_plotted)
                        processed_frames += 1
                    except Exception as frame_error:
                        print(f"Error processing frame {frame_count}: {str(frame_error)}")
                    
                    frame_count += 1
                    
                    # Log progress every 30 frames
                    if frame_count % 30 == 0:
                        print(f"Processed {frame_count} frames...")

                cap.release()
                out.release()
                cv2.destroyAllWindows()
                
                print(f"Video processing complete. Total frames: {frame_count}, Processed frames: {processed_frames}")
                
                # Verify output file exists and has content
                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                    return jsonify({
                        'success': True,
                        'message': f'Video processed successfully. {processed_frames}/{frame_count} frames analyzed.',
                        'output_path': '/data/processed/output.mp4',
                        'video_url': '/data/processed/output.mp4'
                    })
                else:
                    return jsonify({'error': 'Failed to create output video file'}), 500
            else:
                return jsonify({'error': 'Only MP4 files are supported for video processing'}), 400
                
        except Exception as e:
            print(f"Error in predict_img: {str(e)}")
            return jsonify({'error': f'Failed to process video: {str(e)}'}), 500

    return jsonify({'error': 'Method not allowed'}), 405

# Route to serve processed video files
@app.route('/data/processed/<filename>')
def serve_processed_file(filename):
    try:
        basepath = os.path.dirname(__file__)
        processed_dir = os.path.abspath(os.path.join(basepath, '../../data/processed'))
        
        # Security check - ensure filename doesn't contain path traversal
        if '..' in filename or '/' in filename or '\\' in filename:
            return jsonify({'error': 'Invalid filename'}), 400
            
        file_path = os.path.join(processed_dir, filename)
        if not os.path.exists(file_path):
            return jsonify({'error': 'File not found'}), 404
        
        # Serve video files with proper headers for web playback
        def generate():
            with open(file_path, 'rb') as f:
                data = f.read(1024)
                while data:
                    yield data
                    data = f.read(1024)
        
        # Set appropriate headers for video streaming
        response = Response(generate(), mimetype='video/mp4')
        response.headers['Accept-Ranges'] = 'bytes'
        response.headers['Content-Length'] = str(os.path.getsize(file_path))
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET'
        response.headers['Access-Control-Allow-Headers'] = 'Range'
        
        return response
    except Exception as e:
        print(f"Error serving processed file: {str(e)}")
        return jsonify({'error': f'File not found: {str(e)}'}), 404

# Placeholder image endpoint for video poster
@app.route('/api/placeholder/<int:width>/<int:height>')
def placeholder_image(width, height):
    """Generate a simple placeholder image"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        # Create a simple placeholder image
        img = Image.new('RGB', (width, height), color='#f3f4f6')
        draw = ImageDraw.Draw(img)
        
        # Add text
        text = f"Video Preview\n{width}x{height}"
        bbox = draw.textbbox((0, 0), text)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (width - text_width) // 2
        y = (height - text_height) // 2
        
        draw.text((x, y), text, fill='#6b7280', align='center')
        
        # Save to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        
        return send_file(img_byte_arr, mimetype='image/png')
    except Exception as e:
        print(f"Error generating placeholder: {str(e)}")
        # Return a minimal response
        return '', 204

# Health check endpoint for Docker
@app.route('/health')
def health_check():
    """Health check endpoint for container orchestration"""
    try:
        # Quick model check
        if model is not None:
            return jsonify({
                'status': 'healthy',
                'model_loaded': True,
                'timestamp': str(cv2.getTickCount())
            }), 200
        else:
            return jsonify({
                'status': 'unhealthy',
                'model_loaded': False,
                'error': 'Model not loaded'
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 503

# API info endpoint
@app.route('/api/info')
def api_info():
    return jsonify({
        'name': 'Vehicle Damage Detection API',
        'version': '1.0.0',
        'description': 'AI-powered vehicle damage detection system',
        'endpoints': {
            'POST /predict': 'Image damage detection',
            'POST /predict_img': 'Video damage detection',
            'GET /video_feed': 'Live video stream',
            'POST /stop': 'Stop live video stream',
            'GET /health': 'Health check',
            'GET /api/info': 'API information'
        }
    })

# Removed template-based routes - using React frontend only


@app.route('/video_feed')
def video_feed():
   



    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/stop', methods=['POST'])
def stop():
    global terminate_flag
    terminate_flag = True
    return jsonify({'status': 'stopped', 'message': 'Video stream stopped'})

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Flask app exposing yolov8 models")
    parser.add_argument("--port", default=5000, type=int, help="port number")
    args = parser.parse_args()
    #model = torch.hub.load('.', 'custom','best.pt', source='local')
    # Model is already loaded at the top of the script
    app.run(host="0.0.0.0", port=args.port)
