#!/usr/bin/env python3
"""
Test script to verify the Cloud Run API is working correctly.
"""

import requests
import json
from pathlib import Path

# Cloud Run URL
API_URL = "https://automated-vehicle-damage-400484112127.europe-west1.run.app"

def test_health():
    """Test the health endpoint."""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_predict():
    """Test the predict endpoint with a sample image."""
    print("\nTesting predict endpoint...")
    
    # Look for a sample image in the uploads directory
    uploads_dir = Path("data/uploads")
    image_files = list(uploads_dir.glob("*.jpg")) + list(uploads_dir.glob("*.png"))
    
    if not image_files:
        print("No test images found in data/uploads directory")
        return False
    
    test_image = image_files[0]
    print(f"Using test image: {test_image}")
    
    try:
        with open(test_image, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{API_URL}/predict", files=files)
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Prediction result: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"Prediction test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("🚗 Testing Vehicle Damage Detection API on Cloud Run")
    print("=" * 50)
    
    health_ok = test_health()
    predict_ok = test_predict()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"✅ Health check: {'PASS' if health_ok else 'FAIL'}")
    print(f"✅ Prediction API: {'PASS' if predict_ok else 'FAIL'}")
    
    if health_ok and predict_ok:
        print("\n🎉 All tests passed! The API is working correctly.")
        print(f"🌐 Web App URL: {API_URL}")
    else:
        print("\n❌ Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    main()
