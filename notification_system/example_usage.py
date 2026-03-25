"""Example usage of the notification system."""
from datetime import datetime
from notifier import MiningAlertNotifier

def example_basic_usage():
    """Basic usage example."""
    # Initialize notifier (loads config from environment)
    notifier = MiningAlertNotifier()
    
    # Send alert for detected mining activity
    result = notifier.send_alert(
        location="Forest Area, Sector 7, GPS: 12.3456, 78.9012",
        detection_time=datetime.now()
    )
    
    print(f"Alert sent: {result}")

def example_with_detection_output():
    """Example integration with detection system output."""
    # Simulated detection output
    detection_data = {
        "confidence": 0.95,
        "location": "Mining Site Alpha, Coordinates: 23.4567, 89.0123",
        "timestamp": "2026-02-01T14:30:00",
        "image_path": "/detections/image_001.jpg"
    }
    
    # Only send alert if confidence is high
    if detection_data["confidence"] > 0.9:
        notifier = MiningAlertNotifier()
        
        result = notifier.send_alert(
            location=detection_data["location"],
            detection_time=datetime.fromisoformat(detection_data["timestamp"])
        )
        
        if result["success"]:
            print(f"✓ Alert sent successfully")
            print(f"  Email: {result['email_sent']}")
            print(f"  SMS: {result['sms_sent']}")
        else:
            print(f"✗ Alert failed: {result.get('reason', 'unknown')}")

def example_force_alert():
    """Example of forcing an alert (bypass duplicate check)."""
    notifier = MiningAlertNotifier()
    
    # Force send even if recently sent
    result = notifier.send_alert(
        location="Critical Zone 5",
        force=True
    )
    
    print(f"Forced alert: {result}")

def example_cleanup():
    """Example of cleaning up old alert history."""
    notifier = MiningAlertNotifier()
    
    # Remove alerts older than 7 days
    notifier.cleanup_old_alerts(days=7)
    print("Old alerts cleaned up")

if __name__ == "__main__":
    print("=== Mining Alert Notification System Examples ===\n")
    
    print("1. Basic Usage:")
    example_basic_usage()
    
    print("\n2. Integration with Detection:")
    example_with_detection_output()
    
    print("\n3. Force Alert:")
    example_force_alert()
    
    print("\n4. Cleanup:")
    example_cleanup()
