"""
Bridge API - Connects React Frontend with Python SMS System
Runs alongside your React app to handle SMS notifications
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from realtime_sms_alert import RealtimeMiningAlert
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

alert_system = RealtimeMiningAlert()

@app.route('/api/sms/send-alert', methods=['POST'])
def send_alert():
    """
    Send SMS alert when mining is detected.
    
    POST /api/sms/send-alert
    Body: {
        "confidence": 0.95,
        "location": "Forest Area",
        "coordinates": {"latitude": 12.34, "longitude": 78.90},
        "timestamp": "2026-02-02T14:30:00",
        "detectionId": "det_123",
        "imageUrl": "https://..."
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Add timestamp if not provided
        if 'timestamp' not in data:
            data['timestamp'] = datetime.now().isoformat()
        
        # Process detection and send SMS
        result = alert_system.process_detection(data)
        
        return jsonify({
            "success": True,
            "alert_sent": result['alert_sent'],
            "recipients": result.get('recipients', []),
            "confidence": result['confidence'],
            "location": result['location']
        }), 200
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/sms/history', methods=['GET'])
def get_history():
    """Get SMS alert history."""
    try:
        limit = request.args.get('limit', 50, type=int)
        history = alert_system.get_alert_history(limit)
        
        return jsonify({
            "success": True,
            "count": len(history),
            "alerts": history
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/sms/config', methods=['GET'])
def get_config():
    """Get current SMS configuration."""
    return jsonify({
        "success": True,
        "config": {
            "min_confidence": alert_system.min_confidence,
            "recipients_count": len(alert_system.notifier.recipient_phones),
            "alert_cooldown_minutes": int(os.getenv("ALERT_COOLDOWN_MINUTES", "30"))
        }
    }), 200

@app.route('/api/sms/config', methods=['PUT'])
def update_config():
    """Update SMS configuration."""
    try:
        data = request.get_json()
        
        if 'min_confidence' in data:
            alert_system.min_confidence = float(data['min_confidence'])
        
        return jsonify({
            "success": True,
            "message": "Configuration updated",
            "config": {
                "min_confidence": alert_system.min_confidence
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/sms/test', methods=['POST'])
def test_sms():
    """Send a test SMS."""
    try:
        result = alert_system.process_detection({
            "confidence": 0.99,
            "location": "Test Location - System Check",
            "coordinates": {"latitude": 0.0, "longitude": 0.0},
            "timestamp": datetime.now().isoformat()
        })
        
        return jsonify({
            "success": True,
            "message": "Test SMS sent",
            "result": result
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "Mining Alert SMS Bridge API",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('SMS_API_PORT', '5001'))
    
    print("\n" + "="*70)
    print("MINING ALERT SMS BRIDGE API")
    print("="*70)
    print(f"\n🚀 Server starting on http://localhost:{port}")
    print("\nEndpoints:")
    print(f"  POST   http://localhost:{port}/api/sms/send-alert  - Send SMS alert")
    print(f"  GET    http://localhost:{port}/api/sms/history    - Get alert history")
    print(f"  GET    http://localhost:{port}/api/sms/config     - Get configuration")
    print(f"  PUT    http://localhost:{port}/api/sms/config     - Update config")
    print(f"  POST   http://localhost:{port}/api/sms/test       - Send test SMS")
    print(f"  GET    http://localhost:{port}/api/health         - Health check")
    print("\n" + "="*70)
    print("Ready to receive detection alerts from React frontend!")
    print("="*70 + "\n")
    
    app.run(host='0.0.0.0', port=port, debug=False)
