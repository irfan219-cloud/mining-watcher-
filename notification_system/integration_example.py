"""
Example: Integrate SMS alerts with mining detection system.

This shows how to send SMS alerts when illegal mining is detected.
"""
from mining_alert_verify import MiningAlertVerify
from datetime import datetime
import time

def simulate_mining_detection():
    """Simulate a mining detection system."""
    
    # Initialize the alert notifier
    notifier = MiningAlertVerify()
    
    print("="*60)
    print("MINING DETECTION SYSTEM - RUNNING")
    print("="*60)
    print("\nMonitoring for illegal mining activity...\n")
    
    # Simulate detection scenarios
    detections = [
        {
            "confidence": 0.95,
            "location": "Forest Area Sector 7, GPS: 12.3456, 78.9012",
            "timestamp": datetime.now(),
            "image_path": "/detections/img_001.jpg"
        },
        {
            "confidence": 0.88,
            "location": "Mining Site Alpha, GPS: 23.4567, 89.0123",
            "timestamp": datetime.now(),
            "image_path": "/detections/img_002.jpg"
        },
        {
            "confidence": 0.65,  # Low confidence - won't trigger alert
            "location": "Quarry Zone B, GPS: 34.5678, 90.1234",
            "timestamp": datetime.now(),
            "image_path": "/detections/img_003.jpg"
        }
    ]
    
    for i, detection in enumerate(detections, 1):
        print(f"\n[Detection #{i}]")
        print(f"  Confidence: {detection['confidence']:.2%}")
        print(f"  Location: {detection['location']}")
        print(f"  Time: {detection['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Only send alert if confidence is high (> 90%)
        if detection['confidence'] > 0.90:
            print(f"  ⚠️  HIGH CONFIDENCE - Sending alert...")
            
            result = notifier.send_alert(
                location=detection['location'],
                detection_time=detection['timestamp']
            )
            
            if result['success']:
                print(f"  ✓ Alert sent to {result['total_sent']} recipient(s)")
                print(f"    Delivered: {', '.join(result['delivered'])}")
            else:
                print(f"  ✗ Alert failed to send")
        else:
            print(f"  ℹ️  Low confidence - No alert sent")
        
        # Wait between detections
        if i < len(detections):
            time.sleep(2)
    
    print("\n" + "="*60)
    print("MONITORING COMPLETE")
    print("="*60)

def real_time_integration_example():
    """Example of real-time integration with detection system."""
    
    notifier = MiningAlertVerify()
    
    # This would be called by your actual detection system
    def on_mining_detected(detection_data):
        """Callback when mining is detected."""
        
        # Extract detection info
        confidence = detection_data.get('confidence', 0)
        location = detection_data.get('location', 'Unknown')
        timestamp = detection_data.get('timestamp', datetime.now())
        
        # Send alert if confidence is high
        if confidence > 0.90:
            result = notifier.send_alert(
                location=location,
                detection_time=timestamp
            )
            
            return result
        
        return {"success": False, "reason": "Low confidence"}
    
    # Example usage
    print("\n" + "="*60)
    print("REAL-TIME INTEGRATION EXAMPLE")
    print("="*60)
    
    # Simulated detection from your ML model
    detection = {
        "confidence": 0.96,
        "location": "Protected Forest Zone, GPS: 15.6789, 80.1234",
        "timestamp": datetime.now(),
        "model": "YOLOv8",
        "image_path": "/detections/alert_001.jpg"
    }
    
    print(f"\nDetection received:")
    print(f"  Model: {detection['model']}")
    print(f"  Confidence: {detection['confidence']:.2%}")
    print(f"  Location: {detection['location']}")
    
    result = on_mining_detected(detection)
    
    if result['success']:
        print(f"\n✓ Alert successfully sent!")
        print(f"  Recipients notified: {result['total_sent']}")
    else:
        print(f"\n✗ Alert not sent: {result.get('reason', 'Unknown')}")
    
    print("="*60)

if __name__ == "__main__":
    print("\n" + "="*60)
    print("MINING ALERT SYSTEM - INTEGRATION EXAMPLES")
    print("="*60)
    
    # Run simulation
    simulate_mining_detection()
    
    # Show real-time integration
    time.sleep(2)
    real_time_integration_example()
    
    print("\n" + "="*60)
    print("INTEGRATION EXAMPLES COMPLETE")
    print("="*60)
    print("\nTo integrate with your detection system:")
    print("1. Import: from mining_alert_verify import MiningAlertVerify")
    print("2. Initialize: notifier = MiningAlertVerify()")
    print("3. Send alert: notifier.send_alert(location, detection_time)")
    print("="*60)
