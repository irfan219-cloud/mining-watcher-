# Real-Time SMS Alert Setup Guide

## Step 1: Configure Your Credentials

Edit the `.env` file and add YOUR credentials:

```env
# Your Twilio credentials (DO NOT SHARE!)
TWILIO_ACCOUNT_SID=your-account-sid-here
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid-here

# Phone numbers to receive alerts (comma-separated)
RECIPIENT_PHONES=+917810026278,+919876543210
```

**IMPORTANT:** Replace `your_actual_auth_token_here` with your real Twilio Auth Token from https://console.twilio.com

## Step 2: Install Dependencies

```bash
cd mining-watcher-main/notification_system
pip install -r requirements.txt
```

## Step 3: Test the System

```bash
python realtime_sms_alert.py
```

This will:
- Send test SMS alerts
- Show you how the system works
- Create an alert log file

## Step 4: Integration Options

### Option A: Direct Integration (Python)

```python
from realtime_sms_alert import RealtimeMiningAlert

# Initialize
alert_system = RealtimeMiningAlert()

# When your detection system finds mining activity
detection = {
    "confidence": 0.95,
    "location": "Forest Area",
    "coordinates": {"latitude": 12.34, "longitude": 78.90},
    "timestamp": datetime.now(),
    "image_path": "/path/to/image.jpg"
}

# Send alert
result = alert_system.process_detection(detection)
```

### Option B: API Endpoint (Any Language)

Start the API server:
```bash
python sms_api.py
```

Then send HTTP POST requests:
```bash
curl -X POST http://localhost:5000/alert \
  -H "Content-Type: application/json" \
  -d '{
    "confidence": 0.95,
    "location": "Forest Area",
    "coordinates": {"latitude": 12.34, "longitude": 78.90}
  }'
```

## How It Works

1. **Detection** → Your ML model detects illegal mining
2. **Confidence Check** → System checks if confidence > 90%
3. **SMS Alert** → Sends SMS to configured phone numbers
4. **Logging** → Records alert in `alert_log.json`

## SMS Message Format

Recipients receive:
```
Verification code from Twilio
(Note: Using Verify API sends codes, not custom messages)
```

## Configuration

Edit `realtime_sms_alert.py` to change:
- `min_confidence = 0.90` - Minimum confidence threshold
- Alert message format
- Logging behavior

## Troubleshooting

**SMS not received?**
- Check `.env` has correct credentials
- Verify phone numbers include country code (+91)
- Check Twilio Console for delivery status

**"Twilio not configured" error?**
- Make sure `.env` file exists
- Verify credentials are correct
- Run `python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('TWILIO_ACCOUNT_SID'))"`

**Want custom messages?**
- Get a Twilio phone number (see TWILIO_SETUP.md)
- Switch to Messaging API instead of Verify API

## Security

- Never commit `.env` to git
- Keep Auth Token secret
- Rotate credentials regularly
- Use environment variables in production

## Next Steps

1. Configure your `.env` file with real credentials
2. Test with `python realtime_sms_alert.py`
3. Integrate with your detection system
4. Monitor `alert_log.json` for alert history
