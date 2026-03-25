# Mining Alert Notification System

Python notification system that sends email and SMS alerts when illegal mining activity is detected.

## Features

- ✉️ Email alerts via Gmail SMTP
- 📱 SMS alerts via Twilio API
- 🚫 Duplicate alert prevention
- 📍 Location and timestamp tracking
- 🔧 Simple integration with detection systems

## Setup

### 1. Install Dependencies

```bash
pip install twilio
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

#### Gmail Setup:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password (not your regular password) in `GMAIL_APP_PASSWORD`

#### Twilio Setup:
1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number or use the trial number
4. Add credentials to `.env`

### 3. Add Recipients

Update `.env` with recipient emails and phone numbers (comma-separated):

```env
RECIPIENT_EMAILS=admin@example.com,security@example.com
RECIPIENT_PHONES=+1234567890,+0987654321
```

## Usage

### Basic Usage

```python
from notification_system import MiningAlertNotifier
from datetime import datetime

# Initialize notifier
notifier = MiningAlertNotifier()

# Send alert
result = notifier.send_alert(
    location="Forest Area, GPS: 12.3456, 78.9012",
    detection_time=datetime.now()
)

print(result)
# Output: {'success': True, 'email_sent': True, 'sms_sent': True, ...}
```

### Integration with Detection System

```python
from notification_system import MiningAlertNotifier
from datetime import datetime

# Your detection output
detection = {
    "confidence": 0.95,
    "location": "Mining Site Alpha, Coordinates: 23.4567, 89.0123",
    "timestamp": "2026-02-01T14:30:00"
}

# Send alert if confidence is high
if detection["confidence"] > 0.9:
    notifier = MiningAlertNotifier()
    result = notifier.send_alert(
        location=detection["location"],
        detection_time=datetime.fromisoformat(detection["timestamp"])
    )
```

### Force Alert (Bypass Duplicate Check)

```python
# Send alert even if recently sent for same location
result = notifier.send_alert(
    location="Critical Zone",
    force=True
)
```

### Cleanup Old Alerts

```python
# Remove alert history older than 7 days
notifier.cleanup_old_alerts(days=7)
```

## Configuration

### Alert Cooldown

Prevent duplicate alerts for the same location within a time window:

```env
ALERT_COOLDOWN_MINUTES=30  # Default: 30 minutes
```

### Custom Configuration

```python
from notification_system import MiningAlertNotifier, NotificationConfig
from notification_system.config import EmailConfig, TwilioConfig

config = NotificationConfig(
    email=EmailConfig(
        sender_email="alerts@example.com",
        sender_password="app-password"
    ),
    twilio=TwilioConfig(
        account_sid="your-sid",
        auth_token="your-token",
        from_number="+1234567890"
    ),
    recipient_emails=["admin@example.com"],
    recipient_phones=["+0987654321"],
    alert_cooldown_minutes=60
)

notifier = MiningAlertNotifier(config)
```

## Alert Format

### Email Alert
- Subject: ⚠️ ILLEGAL MINING ACTIVITY DETECTED
- Contains: Location, detection time, formatted HTML

### SMS Alert
- Format: ⚠️ MINING ALERT\nLocation: ...\nTime: ...\nImmediate action required.

## Files

- `notifier.py` - Main orchestrator
- `email_notifier.py` - Gmail SMTP handler
- `sms_notifier.py` - Twilio SMS handler
- `alert_tracker.py` - Duplicate prevention
- `config.py` - Configuration management
- `example_usage.py` - Usage examples

## Troubleshooting

### Email not sending:
- Verify Gmail app password (not regular password)
- Check 2FA is enabled
- Ensure "Less secure app access" is not blocking

### SMS not sending:
- Verify Twilio credentials
- Check phone number format (+country code)
- Ensure Twilio account has credits
- Verify phone numbers are verified (trial accounts)

### Duplicate alerts:
- Check `alert_history.json` file
- Adjust `ALERT_COOLDOWN_MINUTES`
- Use `force=True` to bypass

## Security Notes

- Never commit `.env` file to version control
- Use app-specific passwords for Gmail
- Rotate credentials regularly
- Store credentials securely in production
