"""Main notification system orchestrator."""
from datetime import datetime
from typing import Optional
from config import NotificationConfig
from email_notifier import EmailNotifier
from sms_notifier import SMSNotifier
from alert_tracker import AlertTracker

class MiningAlertNotifier:
    """Orchestrates email and SMS notifications for mining alerts."""
    
    def __init__(self, config: Optional[NotificationConfig] = None):
        self.config = config or NotificationConfig.from_env()
        
        self.email_notifier = EmailNotifier(
            smtp_server=self.config.email.smtp_server,
            smtp_port=self.config.email.smtp_port,
            sender_email=self.config.email.sender_email,
            sender_password=self.config.email.sender_password
        )
        
        self.sms_notifier = SMSNotifier(
            account_sid=self.config.twilio.account_sid,
            auth_token=self.config.twilio.auth_token,
            from_number=self.config.twilio.from_number
        )
        
        self.alert_tracker = AlertTracker()
    
    def send_alert(self, location: str, detection_time: Optional[datetime] = None,
                   force: bool = False) -> dict:
        """
        Send alert for detected illegal mining activity.
        
        Args:
            location: Location of detected activity
            detection_time: Time of detection (defaults to now)
            force: Force send even if duplicate
            
        Returns:
            dict with status of email and SMS delivery
        """
        if detection_time is None:
            detection_time = datetime.now()
        
        # Check for duplicate alerts
        if not force and not self.alert_tracker.should_send_alert(
            location, self.config.alert_cooldown_minutes
        ):
            print(f"Alert for {location} already sent recently. Skipping.")
            return {
                "success": False,
                "reason": "duplicate",
                "email_sent": False,
                "sms_sent": False
            }
        
        # Send notifications
        email_sent = self.email_notifier.send_alert(
            recipients=self.config.recipient_emails,
            location=location,
            detection_time=detection_time
        )
        
        sms_sent = self.sms_notifier.send_alert(
            recipients=self.config.recipient_phones,
            location=location,
            detection_time=detection_time
        )
        
        # Record alert if at least one notification succeeded
        if email_sent or sms_sent:
            self.alert_tracker.record_alert(location)
        
        return {
            "success": email_sent or sms_sent,
            "email_sent": email_sent,
            "sms_sent": sms_sent,
            "location": location,
            "detection_time": detection_time.isoformat()
        }
    
    def cleanup_old_alerts(self, days: int = 7):
        """Clean up alert history older than specified days."""
        self.alert_tracker.cleanup_old_alerts(days)
