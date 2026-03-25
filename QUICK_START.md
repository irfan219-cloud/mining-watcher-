# Quick Start Guide - Mining Watcher SMS Alerts

## ✅ Current Status

**Both systems are RUNNING:**
- ✅ React Frontend: http://localhost:8080
- ✅ SMS API: http://localhost:5001

## 📱 SMS Configuration

**Recipients:**
- +917810026278 (Primary)
- +919626351526 (Secondary)

**Settings:**
- Confidence Threshold: 85%
- Alert Cooldown: 30 minutes

## 🚀 Quick Commands

### Send Test SMS
```bash
# From browser
http://localhost:5001/api/sms/test

# From command line
cd mining-watcher-main/notification_system
python realtime_sms_alert.py
```

### Check System Health
```bash
# SMS API
http://localhost:5001/api/health

# Frontend
http://localhost:8080
```

### View Alert History
```bash
# Open file
mining-watcher-main/notification_system/alert_log.json

# Via API
http://localhost:5001/api/sms/history
```

## 💻 Integration Code

### React Component
```typescript
import { useSMSAlert } from '@/hooks/useSMSAlert';

function MyComponent() {
  const { sendAlert } = useSMSAlert();

  const handleDetection = async () => {
    await sendAlert({
      confidence: 0.95,
      location: "Forest Area",
      coordinates: { latitude: 12.34, longitude: 78.90 }
    });
  };
}
```

### Python Script
```python
from realtime_sms_alert import RealtimeMiningAlert

alert_system = RealtimeMiningAlert()
result = alert_system.process_detection({
    "confidence": 0.95,
    "location": "Forest Area",
    "coordinates": {"latitude": 12.34, "longitude": 78.90}
})
```

### API Call (Any Language)
```bash
POST http://localhost:5001/api/sms/send-alert
Content-Type: application/json

{
  "confidence": 0.95,
  "location": "Forest Area",
  "coordinates": {"latitude": 12.34, "longitude": 78.90}
}
```

## 🔧 Configuration

### Add Phone Numbers
Edit `notification_system/.env`:
```env
RECIPIENT_PHONES=+917810026278,+919626351526,+91XXXXXXXXXX
```

### Change Threshold
Edit `notification_system/.env`:
```env
MIN_CONFIDENCE_THRESHOLD=0.90  # 90%
```

### Change Cooldown
Edit `notification_system/.env`:
```env
ALERT_COOLDOWN_MINUTES=15  # 15 minutes
```

## 📊 Monitoring

### View in Dashboard
1. Open http://localhost:8080
2. Go to Dashboard
3. Find "SMS Alert Monitor" section
4. See real-time status and history

### Check Logs
```bash
# Alert history
type notification_system\alert_log.json

# API logs
# Check console where bridge_api.py is running
```

## 🛠️ Troubleshooting

### SMS Not Received?
1. Check `.env` has correct Twilio credentials
2. Verify phone numbers have country code (+91)
3. Check alert_log.json for delivery status
4. Visit https://console.twilio.com for SMS logs

### API Not Responding?
1. Check if bridge_api.py is running
2. Restart: `python bridge_api.py`
3. Check port 5001 is not in use

### React Can't Connect?
1. Verify SMS API is running on port 5001
2. Check `.env.local` has correct API URL
3. Restart React dev server

## 📁 Important Files

```
notification_system/
├── .env                    # SMS configuration (EDIT THIS)
├── bridge_api.py          # API server (RUNNING)
├── realtime_sms_alert.py  # Alert processor
├── alert_log.json         # Alert history (AUTO-GENERATED)
└── start_sms_api.bat      # Windows startup script

src/
├── hooks/useSMSAlert.tsx  # React integration
└── components/dashboard/
    └── SMSAlertMonitor.tsx # Monitoring UI
```

## 🎯 What Happens When Mining is Detected?

1. **Detection** → Your ML model detects mining (confidence: 95%)
2. **Check** → System checks if confidence >= 85% ✓
3. **Duplicate** → Checks if alert sent recently (30min) ✓
4. **Send** → Sends SMS to 2 recipients
5. **Log** → Records in alert_log.json
6. **Display** → Shows in dashboard

## ✨ You're All Set!

Everything is configured and running. Your system will automatically send SMS alerts when illegal mining is detected with confidence >= 85%.

**Test it now:**
1. Open http://localhost:5001/api/sms/test in browser
2. Check your phone for SMS
3. View alert in dashboard

---

**Need Help?** Check:
- `SMS_INTEGRATION_GUIDE.md` - Complete integration guide
- `SYSTEM_STATUS.md` - Full system status
- `notification_system/SETUP_GUIDE.md` - Setup instructions
