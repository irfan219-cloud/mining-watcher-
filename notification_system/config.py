"""Configuration for notification system."""
import os
from typing import List
from dataclasses import dataclass
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

@dataclass
class EmailConfig:
    """Gmail SMTP configuration."""
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    sender_email: str = os.getenv("GMAIL_USER", "")
    sender_password: str = os.getenv("GMAIL_APP_PASSWORD", "")

@dataclass
class TwilioConfig:
    """Twilio API configuration."""
    account_sid: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    auth_token: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    from_number: str = os.getenv("TWILIO_PHONE_NUMBER", "")

@dataclass
class NotificationConfig:
    """Main notification configuration."""
    email: EmailConfig
    twilio: TwilioConfig
    recipient_emails: List[str]
    recipient_phones: List[str]
    alert_cooldown_minutes: int = 30  # Prevent duplicate alerts

    @classmethod
    def from_env(cls):
        """Load configuration from environment variables."""
        return cls(
            email=EmailConfig(),
            twilio=TwilioConfig(),
            recipient_emails=os.getenv("RECIPIENT_EMAILS", "").split(","),
            recipient_phones=os.getenv("RECIPIENT_PHONES", "").split(","),
            alert_cooldown_minutes=int(os.getenv("ALERT_COOLDOWN_MINUTES", "30"))
        )
