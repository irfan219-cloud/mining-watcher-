"""Test SMS alert with real mining detection data."""
import requests
from datetime import datetime

API_URL = "http://localhost:5001"

print("=" * 60)
print("TESTING SMS ALERT WITH MINING DETECTION DATA")
print("=" * 60)

# Simulate real mining detection from your project
detection_data = {
    "confidence": 0.96,
    "location": "Protected Forest Zone - Sector A",
    "coordinates": {
        "latitude": 12.9716,
        "longitude": 77.5946
    },
    "timestamp": datetime.now().isoformat(),
    "detectionId": "DET_2026_001",
    "imageUrl": "https://example.com/detection_image.jpg"
}

print("\n📊 Detection Data:")
print(f"  Confidence: {detection_data['confidence']:.1%}")
print(f"  Location: {detection_data['location']}")
print(f"  Coordinates: {detection_data['coordinates']['latitude']}, {detection_data['coordinates']['longitude']}")
print(f"  Time: {detection_data['timestamp']}")

print("\n📤 Sending alert via API...")

try:
    response = requests.post(
        f"{API_URL}/api/sms/send-alert",
        json=detection_data,
        timeout=10
    )
    
    result = response.json()
    
    print("\n" + "=" * 60)
    print("RESULT:")
    print("=" * 60)
    print(f"Success: {'✓ YES' if result['success'] else '✗ NO'}")
    print(f"Alert Sent: {'✓ YES' if result['alert_sent'] else '✗ NO'}")
    print(f"Recipients: {result.get('recipients', [])}")
    print(f"Confidence: {result['confidence']:.1%}")
    print(f"Location: {result['location']}")
    print("=" * 60)
    
    if result['success'] and result['alert_sent']:
        print("\n✓ SMS alert sent with your mining detection data!")
        print("  Check phone: +919626351526")
    else:
        print("\n⚠️ Alert not sent")
        if 'error' in result:
            print(f"  Error: {result['error']}")
            
except requests.exceptions.ConnectionError:
    print("\n✗ Could not connect to SMS API")
    print("  Make sure bridge_api.py is running on port 5001")
except Exception as e:
    print(f"\n✗ Error: {e}")
