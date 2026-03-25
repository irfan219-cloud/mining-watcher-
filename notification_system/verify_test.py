"""Test using Twilio Verify API."""
from twilio.rest import Client
from datetime import datetime

# Your Twilio credentials
ACCOUNT_SID = "your-account-sid-here"
AUTH_TOKEN = "your-auth-token-here"
VERIFY_SERVICE_SID = "your-verify-service-sid-here"
TO_NUMBER = "+917810026278"

print("="*60)
print("TWILIO VERIFY API TEST")
print("="*60)
print(f"\nSending verification SMS to: {TO_NUMBER}")
print("Note: This sends a verification code, not a custom message")
print("\nSending...")

try:
    # Initialize Twilio client
    client = Client(ACCOUNT_SID, AUTH_TOKEN)
    
    # Send verification using Verify API
    verification = client.verify.v2.services(VERIFY_SERVICE_SID) \
        .verifications \
        .create(to=TO_NUMBER, channel='sms')
    
    print(f"\n✓ Verification SMS sent successfully!")
    print(f"  Status: {verification.status}")
    print(f"  To: {verification.to}")
    print(f"  Channel: {verification.channel}")
    print(f"\nCheck your phone for the verification code!")
    
except Exception as e:
    print(f"\n✗ Failed to send verification:")
    print(f"  Error: {e}")

print("="*60)
