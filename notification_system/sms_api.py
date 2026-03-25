"""
Simple API endpoint for receiving detection data and sending SMS alerts.
Run this to create a webhook that your detection system can call.
"""
from flask import Flask, request, jsonify
from realtime_sms_alert import RealtimeMiningAlert
from datetime import datetime
import os

app = Flask(__name__)
alert_system = RealtimeMiningAlert()

@app.route('/alert', methods=['POST'])
def send_alert():
    """
    Endpoint to receive detection data and send SMS alert.
    
    POST /alert
    Body: {
        "confidence": 0.95,
        "location": "Forest Area",
        "coordinates": {"latitude": 12.34, "longitude": 78.90},
        "timestamp": "2026-02-02T14:30:00",
        "image_path": "/path/to/image.jpg"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Process detection and send alert
        result = alert_system.process_detection(data)
        
        return jsonify({
            "success": True,
            "alert_sent": result['alert_sent'],
            "details": result
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/history', methods=['GET'])
def get_history():
    """Get alert history."""
    limit = request.args.get('limit', 10, type=int)
    history = alert_system.get_alert_history(limit)
    
    return jsonify({
        "success": True,
        "count": len(history),
        "alerts": history
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "Mining Alert SMS API",
        "timestamp": datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    print("\n" + "="*60)
    print("MINING ALERT SMS API SERVER")
    print("="*60)
    print("\nEndpoints:")
    print("  POST /alert    - Send SMS alert")
    print("  GET  /history  - Get alert history")
    print("  GET  /health   - Health check")
    print("\nStarting server on http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
