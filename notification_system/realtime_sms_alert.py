"""
Real-time SMS Alert System for Mining Detection
Sends immediate SMS when illegal mining is detected
"""
from mining_alert_verify import MiningAlertVerify
from datetime import datetime
import json
import os

class RealtimeMiningAlert:
    """Real-time SMS alert system for mining detection."""
    
    def __init__(self):
        self.notifier = MiningAlertVerify()
        self.alert_log = "alert_log.json"
        # Load confidence threshold from environment or use default
        self.min_confidence = float(os.getenv("MIN_CONFIDENCE_THRESHOLD", "0.85"))
    
    def process_detection(self, detection_data):
        """
        Process a detection and send SMS if needed.
        
        Args:
            detection_data: dict with keys:
                - confidence: float (0-1)
                - location: str
                - timestamp: datetime or str
                - image_path: str (optional)
                - coordinates: dict with lat/lon (optional)
        
        Returns:
            dict with alert status
        """
        confidence = detection_data.get('confidence', 0)
        location = detection_data.get('location', 'Unknown Location')
        timestamp = detection_data.get('timestamp', datetime.now())
        
        # Convert string timestamp to datetime if needed
        if isinstance(timestamp, str):
            try:
                timestamp = datetime.fromisoformat(timestamp)
            except:
                timestamp = datetime.now()
        
        # Add coordinates to location if available
        coords = detection_data.get('coordinates')
        if coords:
            lat = coords.get('latitude', 0)
            lon = coords.get('longitude', 0)
            location = f"{location}, GPS: {lat:.4f}, {lon:.4f}"
        
        print(f"\n{'='*60}")
        print(f"DETECTION RECEIVED")
        print(f"{'='*60}")
        print(f"Time: {timestamp.strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Location: {location}")
        print(f"Confidence: {confidence:.2%}")
        
        # Check if confidence meets threshold
        if confidence < self.min_confidence:
            print(f"⚠️  Confidence below threshold ({self.min_confidence:.0%})")
            print(f"   No alert sent")
            return {
                "alert_sent": False,
                "reason": "Low confidence",
                "confidence": confidence
            }
        
        # Send SMS alert
        print(f"🚨 HIGH CONFIDENCE - Sending SMS alert...")
        
        result = self.notifier.send_alert(
            location=location,
            detection_time=timestamp
        )
        
        if result['success']:
            print(f"✓ SMS sent to {result['total_sent']} recipient(s)")
            print(f"  Delivered: {', '.join(result['delivered'])}")
            
            # Log the alert
            self._log_alert(detection_data, result)
        else:
            print(f"✗ Failed to send SMS")
        
        print(f"{'='*60}\n")
        
        return {
            "alert_sent": result['success'],
            "recipients": result['delivered'],
            "confidence": confidence,
            "location": location,
            "timestamp": timestamp.isoformat()
        }
    
    def _log_alert(self, detection_data, result):
        """Log alert to file."""
        # Convert datetime objects to strings for JSON serialization
        detection_copy = detection_data.copy()
        if 'timestamp' in detection_copy and isinstance(detection_copy['timestamp'], datetime):
            detection_copy['timestamp'] = detection_copy['timestamp'].isoformat()
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "detection": detection_copy,
            "alert_result": {
                "success": result.get('success'),
                "delivered": result.get('delivered', []),
                "failed": result.get('failed', []),
                "total_sent": result.get('total_sent', 0)
            }
        }
        
        # Load existing logs
        logs = []
        if os.path.exists(self.alert_log):
            try:
                with open(self.alert_log, 'r') as f:
                    logs = json.load(f)
            except:
                logs = []
        
        # Add new log
        logs.append(log_entry)
        
        # Save logs
        with open(self.alert_log, 'w') as f:
            json.dump(logs, f, indent=2)
    
    def get_alert_history(self, limit=10):
        """Get recent alert history."""
        if not os.path.exists(self.alert_log):
            return []
        
        try:
            with open(self.alert_log, 'r') as f:
                logs = json.load(f)
            return logs[-limit:]
        except:
            return []

# Example usage
if __name__ == "__main__":
    print("\n" + "="*60)
    print("REAL-TIME SMS ALERT SYSTEM - TEST")
    print("="*60)
    
    # Initialize alert system
    alert_system = RealtimeMiningAlert()
    
    # Simulate real-time detections
    detections = [
        {
            "confidence": 0.96,
            "location": "Protected Forest Zone A",
            "coordinates": {"latitude": 12.3456, "longitude": 78.9012},
            "timestamp": datetime.now(),
            "image_path": "/detections/img_001.jpg",
            "model": "YOLOv8"
        },
        {
            "confidence": 0.85,
            "location": "Mining Site B",
            "coordinates": {"latitude": 23.4567, "longitude": 89.0123},
            "timestamp": datetime.now(),
            "image_path": "/detections/img_002.jpg",
            "model": "YOLOv8"
        },
        {
            "confidence": 0.98,
            "location": "Illegal Quarry Zone",
            "coordinates": {"latitude": 34.5678, "longitude": 90.1234},
            "timestamp": datetime.now(),
            "image_path": "/detections/img_003.jpg",
            "model": "YOLOv8"
        }
    ]
    
    # Process each detection
    for i, detection in enumerate(detections, 1):
        print(f"\n[Processing Detection #{i}]")
        result = alert_system.process_detection(detection)
        
        if i < len(detections):
            import time
            time.sleep(3)  # Wait between detections
    
    # Show alert history
    print("\n" + "="*60)
    print("ALERT HISTORY")
    print("="*60)
    history = alert_system.get_alert_history()
    print(f"Total alerts sent: {len(history)}")
    
    print("\n" + "="*60)
    print("REAL-TIME ALERT SYSTEM READY")
    print("="*60)
    print("\nTo use in your detection system:")
    print("  from realtime_sms_alert import RealtimeMiningAlert")
    print("  alert_system = RealtimeMiningAlert()")
    print("  alert_system.process_detection(detection_data)")
    print("="*60)
