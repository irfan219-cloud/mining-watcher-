"""Direct SMS test without config system."""
from twilio.rest import Client
from datetime import datetime

# Your Twilio credentials (directly in code for testing)
ACCOUNT_SID = "your-account-sid-here"
AUTH_TOKEN = "your-auth-token-here"
FROM_NUMBER = "+1234567890"
TO_NUMBER = "+919626351526"

print("="*60)
print("DIRECT SMS TEST")
print("="*60)
print(f"\nFrom: {FROM_NUMBER}")
print(f"To: {TO_NUMBER}")
print("\nSending SMS...")

try:
    # Initialize Twilio client
    client = Client(ACCOUNT_SID, AUTH_TOKEN)
    
    # Create message
    message_body = (
        f"⚠️ MINING ALERT\n"
        f"Location: Test Site, GPS: 12.3456, 78.9012\n"
        f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
        f"Immediate action required."
    )
    
    # Send SMS
    message = client.messages.create(
        body=message_body,
        from_=FROM_NUMBER,
        to=TO_NUMBER
    )
    
    print(f"\n✓ SMS sent successfully!")
    print(f"  Message SID: {message.sid}")
    print(f"  Status: {message.status}")
    print(f"\nCheck your phone at {TO_NUMBER}")
    
except Exception as e:
    print(f"\n✗ Failed to send SMS:")
    print(f"  Error: {e}")
    print("\nPossible issues:")
    print("  1. Check if Twilio credentials are correct")
    print("  2. Verify phone number format (+country code)")
    print("  3. For trial accounts, verify recipient number in Twilio Console")
    print("  4. Check if Twilio account has credits")

print("="*60)
