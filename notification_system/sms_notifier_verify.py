"""SMS notification via Twilio Verify API."""
from typing import List
from datetime import datetime

try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    print("Warning: twilio package not installed. Run: pip install twilio")

class SMSNotifierVerify:
    """Send SMS alerts via Twilio Verify service."""
    
    def __init__(self, account_sid: str, auth_token: str, verify_service_sid: str):
        self.account_sid = account_sid
        self.auth_token = auth_token
        self.verify_service_sid = verify_service_sid
        self.client = None
        
        if TWILIO_AVAILABLE and account_sid and auth_token:
            try:
                self.client = Client(account_sid, auth_token)
            except Exception as e:
                print(f"Failed to initialize Twilio client: {e}")
    
    def send_alert(self, recipients: List[str], location: str, 
                   detection_time: datetime) -> bool:
        """Send mining alert SMS using Verify service."""
        if not self.client:
            print("Twilio client not initialized")
            return False
        
        if not recipients:
            print("No SMS recipients configured")
            return False
        
        if not self.verify_service_sid:
            print("Twilio Verify Service SID not configured")
            return False
        
        message_body = self._create_sms_body(location, detection_time)
        success_count = 0
        
        for phone_number in recipients:
            if not phone_number.strip():
                continue
                
            try:
                # Use Verify API to send SMS
                verification = self.client.verify.v2.services(
                    self.verify_service_sid
                ).verifications.create(
                    to=phone_number.strip(),
                    channel='sms',
                    custom_message=message_body
                )
                print(f"SMS sent to {phone_number}: {verification.sid}")
                success_count += 1
                
            except Exception as e:
                print(f"Failed to send SMS to {phone_number}: {e}")
        
        return success_count > 0
    
    def _create_sms_body(self, location: str, detection_time: datetime) -> str:
        """Create SMS message body."""
        return (
            f"⚠️ MINING ALERT\n"
            f"Location: {location}\n"
            f"Time: {detection_time.strftime('%Y-%m-%d %H:%M')}\n"
            f"Immediate action required."
        )
