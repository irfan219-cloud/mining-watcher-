"""Direct test of SMS with mining detection data."""
from twilio.rest import Client
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("TESTING SMS WITH MINING DETECTION DATA")
print("=" * 60)

# Get credentials
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
verify_service_sid = os.getenv("TWILIO_VERIFY_SERVICE_SID")
recipient = os.getenv("RECIPIENT_PHONES")

print(f"\nAccount SID: {account_sid}")
print(f"Verify Service: {verify_service_sid}")
print(f"Recipient: {recipient}")

if not all([account_sid, auth_token, verify_service_sid, recipient]):
    print("\n✗ Configuration incomplete!")
    exit(1)

# Initialize Twilio client
client = Client(account_sid, auth_token)

# Mining detection data
detection = {
    "location": "Protected Forest Zone - Sector A",
    "coordinates": "12.9716, 77.5946",
    "confidence": "96%",
    "time": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
}

print("\n📊 Mining Detection:")
print(f"  Location: {detection['location']}")
print(f"  GPS: {detection['coordinates']}")
print(f"  Confidence: {detection['confidence']}")
print(f"  Time: {detection['time']}")

print("\n📤 Sending SMS alert...")

try:
    # Send SMS using Verify API
    verification = client.verify.v2.services(verify_service_sid).verifications.create(
        to=recipient,
        channel='sms'
    )
    
    print("\n✓ SMS SENT!")
    print(f"  Status: {verification.status}")
    print(f"  SID: {verification.sid}")
    print(f"  To: {verification.to}")
    print("\n⚠️ NOTE: Twilio Verify sends verification codes (OTP)")
    print("  It does NOT send custom mining alert messages")
    print("\n  To send custom messages, you need:")
    print("  1. Buy a Twilio phone number ($1-2/month)")
    print("  2. Use Messaging API instead of Verify API")
    
    print("\n" + "=" * 60)
    print("CHECK YOUR PHONE: +919626351526")
    print("You should receive a verification code")
    print("=" * 60)
    
except Exception as e:
    print(f"\n✗ SMS FAILED: {e}")
    print("\n  Possible issues:")
    print("  - Auth token incorrect")
    print("  - Phone number not verified in Twilio")
    print("  - Verify service not active")

print("\n" + "=" * 60)
