"""Test the notification system."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from notifier import MiningAlertNotifier
from datetime import datetime

print("Testing Mining Alert Notification System...\n")

# Initialize notifier
notifier = MiningAlertNotifier()

# Send test alert
print("Sending test alert...")
result = notifier.send_alert(
    location="Test Mining Site, GPS: 12.3456, 78.9012",
    detection_time=datetime.now()
)

# Display results
print("\n" + "="*50)
print("ALERT RESULT:")
print("="*50)
print(f"Success: {result['success']}")
print(f"Email Sent: {result['email_sent']}")
print(f"SMS Sent: {result['sms_sent']}")
print(f"Location: {result['location']}")
print(f"Time: {result['detection_time']}")
print("="*50)

if result['success']:
    print("\n✓ Alert sent successfully!")
    if result['sms_sent']:
        print("  → SMS delivered")
    if result['email_sent']:
        print("  → Email delivered")
else:
    print("\n✗ Alert failed. Check your .env configuration.")
