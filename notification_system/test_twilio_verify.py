"""Test Twilio Verify SMS."""
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

try:
    from twilio.rest import Client
    
    # Get credentials
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    verify_service_sid = os.getenv("TWILIO_VERIFY_SERVICE_SID")
    phone_number = os.getenv("RECIPIENT_PHONES")
    
    print("=" * 60)
    print("TESTING TWILIO VERIFY SMS")
    print("=" * 60)
    print(f"Account SID: {account_sid}")
    print(f"Verify Service SID: {verify_service_sid}")
    print(f"Recipient: {phone_number}")
    print("=" * 60)
    
    # Initialize client
    client = Client(account_sid, auth_token)
    
    # Create alert message
    message = (
        f"⚠️ MINING ALERT\n"
        f"Location: Test Mining Site\n"
        f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        f"Immediate action required."
    )
    
    print(f"\n📤 Sending SMS to {phone_number}...")
    
    # Send verification SMS
    verification = client.verify.v2.services(
        verify_service_sid
    ).verifications.create(
        to=phone_number,
        channel='sms'
    )
    
    print(f"\n✓ SMS Sent Successfully!")
    print(f"  Status: {verification.status}")
    print(f"  SID: {verification.sid}")
    print(f"  To: {verification.to}")
    print(f"  Channel: {verification.channel}")
    print("=" * 60)
    print("\n✓ Check your phone for the verification code!")
    print("Note: Twilio Verify sends a verification code, not custom messages.")
    print("For custom alert messages, you need a regular Twilio phone number.")
    
except Exception as e:
    print(f"\n✗ Error: {e}")
    print("\nPlease check:")
    print("1. TWILIO_ACCOUNT_SID is correct")
    print("2. TWILIO_AUTH_TOKEN is correct")
    print("3. TWILIO_VERIFY_SERVICE_SID is correct")
    print("4. Phone number is verified in Twilio console")
