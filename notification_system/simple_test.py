"""Simple standalone test for notification system."""
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import after setting up path
from notifier import MiningAlertNotifier

print("="*60)
print("MINING ALERT NOTIFICATION SYSTEM - TEST")
print("="*60)

# Check if credentials are configured
twilio_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
twilio_token = os.getenv("TWILIO_AUTH_TOKEN", "")
twilio_phone = os.getenv("TWILIO_PHONE_NUMBER", "")
recipient_phones = os.getenv("RECIPIENT_PHONES", "")

print("\nConfiguration Check:")
print(f"  Twilio SID: {'✓ Set' if twilio_sid and twilio_sid != 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' else '✗ Not configured'}")
print(f"  Twilio Token: {'✓ Set' if twilio_token and twilio_token != 'your_auth_token_here' else '✗ Not configured'}")
print(f"  Twilio Phone: {'✓ Set' if twilio_phone and twilio_phone != '+1234567890' else '✗ Not configured'}")
print(f"  Recipients: {'✓ Set' if recipient_phones and recipient_phones != '+919876543210' else '✗ Not configured'}")

if not all([twilio_sid, twilio_token, twilio_phone, recipient_phones]):
    print("\n⚠️  Please configure your .env file first!")
    print("   Edit: notification_system/.env")
    exit(1)

print("\n" + "-"*60)
print("Sending test alert...")
print("-"*60)

# Initialize notifier
notifier = MiningAlertNotifier()

# Send test alert
result = notifier.send_alert(
    location="Test Mining Site, GPS: 12.3456, 78.9012",
    detection_time=datetime.now()
)

# Display results
print("\n" + "="*60)
print("RESULT:")
print("="*60)
print(f"  Success: {result['success']}")
print(f"  Email Sent: {result['email_sent']}")
print(f"  SMS Sent: {result['sms_sent']}")
print(f"  Location: {result['location']}")
print(f"  Time: {result['detection_time']}")
print("="*60)

if result['success']:
    print("\n✓ Alert sent successfully!")
    if result['sms_sent']:
        print("  → Check your phone for SMS")
    if result['email_sent']:
        print("  → Check your email inbox")
else:
    print("\n✗ Alert failed. Check the error messages above.")
