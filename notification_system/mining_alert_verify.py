"""Mining alert notification using Twilio Verify API."""
from twilio.rest import Client
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class MiningAlertVerify:
    """Send mining alerts using Twilio Verify API.
    
    Note: Verify API sends verification codes. For custom messages,
    you would need a Twilio phone number and Messaging API.
    """
    
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.verify_service_sid = os.getenv("TWILIO_VERIFY_SERVICE_SID")
        self.recipient_phones = os.getenv("RECIPIENT_PHONES", "").split(",")
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            print("Twilio credentials not configured")
    
    def send_alert(self, location: str, detection_time: datetime = None) -> dict:
        """
        Send alert notification via SMS.
        
        Args:
            location: Location of detected mining activity
            detection_time: Time of detection (defaults to now)
            
        Returns:
            dict with delivery status
        """
        if detection_time is None:
            detection_time = datetime.now()
        
        if not self.client or not self.verify_service_sid:
            return {
                "success": False,
                "reason": "Twilio not configured",
                "delivered": []
            }
        
        delivered = []
        failed = []
        
        for phone in self.recipient_phones:
            phone = phone.strip()
            if not phone:
                continue
            
            try:
                # Send verification SMS
                verification = self.client.verify.v2.services(self.verify_service_sid) \
                    .verifications \
                    .create(to=phone, channel='sms')
                
                if verification.status == 'pending':
                    delivered.append(phone)
                    print(f"✓ Alert sent to {phone}")
                else:
                    failed.append(phone)
                    print(f"✗ Failed to send to {phone}: {verification.status}")
                    
            except Exception as e:
                failed.append(phone)
                print(f"✗ Error sending to {phone}: {e}")
        
        return {
            "success": len(delivered) > 0,
            "delivered": delivered,
            "failed": failed,
            "location": location,
            "detection_time": detection_time.isoformat(),
            "total_sent": len(delivered),
            "total_failed": len(failed)
        }

def test_alert():
    """Test the mining alert system."""
    print("="*60)
    print("MINING ALERT NOTIFICATION TEST")
    print("="*60)
    
    notifier = MiningAlertVerify()
    
    result = notifier.send_alert(
        location="Forest Area, GPS: 12.3456, 78.9012",
        detection_time=datetime.now()
    )
    
    print("\n" + "="*60)
    print("RESULT:")
    print("="*60)
    print(f"Success: {result['success']}")
    print(f"Delivered to: {result['delivered']}")
    print(f"Failed: {result['failed']}")
    print(f"Location: {result['location']}")
    print(f"Time: {result['detection_time']}")
    print("="*60)
    
    if result['success']:
        print("\n✓ Alert sent! Check your phone for verification code.")
        print("  (Note: Verify API sends codes, not custom messages)")
    else:
        print("\n✗ Alert failed to send")
    
    return result

if __name__ == "__main__":
    test_alert()
