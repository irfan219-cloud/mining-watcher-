"""Test email and SMS notifications."""
from notifier import MiningAlertNotifier
from datetime import datetime

print("=" * 60)
print("TESTING NOTIFICATION SYSTEM")
print("=" * 60)

# Initialize notifier
notifier = MiningAlertNotifier()

# Test alert
print("\n📤 Sending test alert...")
result = notifier.send_alert(
    location="Test Location - Mining Site Alpha",
    detection_time=datetime.now(),
    force=True  # Force send even if duplicate
)

print("\n" + "=" * 60)
print("RESULTS:")
print("=" * 60)
print(f"Overall Success: {'✓ YES' if result['success'] else '✗ NO'}")
print(f"Email Sent: {'✓ YES' if result['email_sent'] else '✗ NO'}")
print(f"SMS Sent: {'✓ YES' if result['sms_sent'] else '✗ NO'}")
print(f"Location: {result['location']}")
print(f"Time: {result['detection_time']}")
print("=" * 60)

if result['success']:
    print("\n✓ Check your email and phone for the test alert!")
else:
    print("\n✗ Alert failed. Check the error messages above.")
