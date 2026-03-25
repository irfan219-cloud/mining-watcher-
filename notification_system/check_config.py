"""Check notification system configuration."""
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("NOTIFICATION SYSTEM CONFIGURATION CHECK")
print("=" * 60)

# Check Gmail
print("\n📧 EMAIL (Gmail) Configuration:")
gmail_user = os.getenv("GMAIL_USER", "")
gmail_pass = os.getenv("GMAIL_APP_PASSWORD", "")
recipient_emails = os.getenv("RECIPIENT_EMAILS", "")

print(f"  Gmail User: {'✓ Configured' if gmail_user and '@' in gmail_user else '✗ Missing'}")
print(f"  App Password: {'✓ Configured' if gmail_pass and len(gmail_pass) > 10 else '✗ Missing'}")
print(f"  Recipients: {'✓ Configured' if recipient_emails and '@' in recipient_emails else '✗ Missing'}")

if gmail_user and '@' in gmail_user:
    print(f"    → {gmail_user}")
if recipient_emails and '@' in recipient_emails:
    print(f"    → {recipient_emails}")

# Check Twilio
print("\n📱 SMS (Twilio) Configuration:")
twilio_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
twilio_token = os.getenv("TWILIO_AUTH_TOKEN", "")
twilio_phone = os.getenv("TWILIO_PHONE_NUMBER", "")
recipient_phones = os.getenv("RECIPIENT_PHONES", "")

print(f"  Account SID: {'✓ Configured' if twilio_sid and twilio_sid.startswith('AC') else '✗ Missing'}")
print(f"  Auth Token: {'✓ Configured' if twilio_token and len(twilio_token) > 20 else '✗ Missing'}")
print(f"  Twilio Phone: {'✗ MISSING - REQUIRED!' if not twilio_phone or 'your-twilio' in twilio_phone else '✓ Configured'}")
print(f"  Recipients: {'✓ Configured' if recipient_phones and '+' in recipient_phones else '✗ Missing'}")

if twilio_phone and 'your-twilio' not in twilio_phone:
    print(f"    → From: {twilio_phone}")
if recipient_phones and '+' in recipient_phones:
    print(f"    → To: {recipient_phones}")

# Summary
print("\n" + "=" * 60)
print("SUMMARY:")
print("=" * 60)

email_ready = gmail_user and gmail_pass and recipient_emails and '@' in gmail_user
sms_ready = twilio_sid and twilio_token and twilio_phone and recipient_phones and 'your-twilio' not in twilio_phone

if email_ready:
    print("✓ Email notifications: READY")
else:
    print("✗ Email notifications: NOT READY")
    
if sms_ready:
    print("✓ SMS notifications: READY")
else:
    print("✗ SMS notifications: NOT READY - Need Twilio phone number!")
    print("\n  To get your Twilio phone number:")
    print("  1. Go to: https://console.twilio.com")
    print("  2. Navigate to: Phone Numbers → Manage → Active numbers")
    print("  3. Copy your phone number (format: +1234567890)")
    print("  4. Add it to .env as: TWILIO_PHONE_NUMBER=+1234567890")

print("\n" + "=" * 60)
