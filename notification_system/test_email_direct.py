"""Direct test of email sending."""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("TESTING EMAIL DIRECTLY")
print("=" * 60)

# Get credentials
sender_email = os.getenv("GMAIL_USER")
sender_password = os.getenv("GMAIL_APP_PASSWORD")
recipient_email = os.getenv("RECIPIENT_EMAILS")

print(f"\nFrom: {sender_email}")
print(f"To: {recipient_email}")
print(f"Password configured: {'Yes' if sender_password else 'No'}")
print(f"Password length: {len(sender_password) if sender_password else 0}")

if not sender_email or not sender_password or not recipient_email:
    print("\n✗ Configuration incomplete!")
    exit(1)

# Create message
subject = "⚠️ MINING DETECTION TEST - Real Data"
body = f"""
<html>
    <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #d32f2f;">⚠️ Illegal Mining Activity Detected</h2>
        <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107;">
            <p><strong>Location:</strong> Protected Forest Zone - Sector A</p>
            <p><strong>GPS Coordinates:</strong> 12.9716, 77.5946</p>
            <p><strong>Detection Time:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            <p><strong>Confidence:</strong> 96%</p>
        </div>
        <p style="margin-top: 20px;">
            Immediate action is required. Please verify and respond accordingly.
        </p>
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
            This is an automated alert from the Mining Watcher System.
        </p>
    </body>
</html>
"""

print("\n📤 Attempting to send email...")

try:
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "html"))
    
    print("  Connecting to Gmail SMTP...")
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        print("  Starting TLS...")
        server.starttls()
        print("  Logging in...")
        server.login(sender_email, sender_password)
        print("  Sending message...")
        server.send_message(message)
    
    print("\n✓ EMAIL SENT SUCCESSFULLY!")
    print(f"  Check your inbox: {recipient_email}")
    print("  Check spam folder if not in inbox")
    
except smtplib.SMTPAuthenticationError as e:
    print("\n✗ AUTHENTICATION FAILED!")
    print("  Your Gmail app password is incorrect or expired")
    print("\n  To fix:")
    print("  1. Go to: https://myaccount.google.com/apppasswords")
    print("  2. Delete old app password")
    print("  3. Create new app password")
    print("  4. Update .env file with new password")
    print(f"\n  Error details: {e}")
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    print("\n  Possible issues:")
    print("  - Gmail app password incorrect")
    print("  - 2FA not enabled on Gmail account")
    print("  - Network/firewall blocking SMTP")

print("=" * 60)
