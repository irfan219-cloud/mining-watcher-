# SMS Alert System - Complete Integration Guide

## ✅ What's Been Configured

### 1. Phone Numbers
- **Primary:** +917810026278
- **Secondary:** +919626351526
- Add more in `notification_system/.env` under `RECIPIENT_PHONES`

### 2. Confidence Threshold
- **Current:** 85% (0.85)
- Alerts only sent when detection confidence > 85%
- Configurable in `notification_system/.env` under `MIN_CONFIDENCE_THRESHOLD`

### 3. Alert Cooldown
- **Current:** 30 minutes
- Prevents duplicate alerts for same location
- Configurable in `notification_system/.env` under `ALERT_COOLDOWN_MINUTES`

## 🚀 How to Run

### Step 1: Start SMS API Server

**Windows:**
```bash
cd mining-watcher-main/notification_system
start_sms_api.bat
```

**Manual:**
```bash
cd mining-watcher-main/notification_system
pip install -r requirements.txt
python bridge_api.py
```

The SMS API will start on `http://localhost:5001`

### Step 2: Start React Frontend

```bash
cd mining-watcher-main
npm run dev
```

The frontend will run on `http://localhost:8080`

## 📱 How It Works

```
Detection → React Frontend → SMS Bridge API → Twilio → SMS Sent
```

1. **Mining detected** by your ML model
2. **React calls** SMS API with detection data
3. **Python checks** confidence threshold
4. **Twilio sends** SMS to configured numbers
5. **Alert logged** in `alert_log.json`

## 💻 Integration Examples

### In React Component

```typescript
import { useSMSAlert } from '@/hooks/useSMSAlert';

function DetectionComponent() {
  const { sendAlert } = useSMSAlert();

  const handleDetection = async (detection) => {
    // When mining is detected
    const result = await sendAlert({
      confidence: 0.95,
      location: "Forest Area, Sector 7",
      coordinates: {
        latitude: 12.3456,
        longitude: 78.9012
      },
      timestamp: new Date().toISOString(),
      detectionId: "det_123",
      imageUrl: "https://..."
    });

    if (result.alert_sent) {
      console.log('SMS sent to:', result.recipients);
    }
  };

  return <button onClick={handleDetection}>Detect Mining</button>;
}
```

### Direct API Call (Any Language)

```bash
curl -X POST http://localhost:5001/api/sms/send-alert \
  -H "Content-Type: application/json" \
  -d '{
    "confidence": 0.95,
    "location": "Forest Area",
    "coordinates": {"latitude": 12.34, "longitude": 78.90}
  }'
```

### Python Integration

```python
from realtime_sms_alert import RealtimeMiningAlert

alert_system = RealtimeMiningAlert()

# When detection occurs
result = alert_system.process_detection({
    "confidence": 0.95,
    "location": "Forest Area",
    "coordinates": {"latitude": 12.34, "longitude": 78.90}
})
```

## 📊 Monitoring Dashboard

Add the SMS Alert Monitor to your dashboard:

```typescript
import { SMSAlertMonitor } from '@/components/dashboard/SMSAlertMonitor';

function Dashboard() {
  return (
    <div>
      <SMSAlertMonitor />
    </div>
  );
}
```

Features:
- ✅ Real-time status
- ✅ Alert history
- ✅ Test SMS button
- ✅ Configuration display

## 🔧 Configuration

### Add More Phone Numbers

Edit `notification_system/.env`:
```env
RECIPIENT_PHONES=+917810026278,+919626351526,+919876543210
```

### Adjust Confidence Threshold

Edit `notification_system/.env`:
```env
MIN_CONFIDENCE_THRESHOLD=0.90  # 90%
```

### Change Alert Cooldown

Edit `notification_system/.env`:
```env
ALERT_COOLDOWN_MINUTES=15  # 15 minutes
```

## 📝 Alert Log

All alerts are logged in `notification_system/alert_log.json`:

```json
[
  {
    "timestamp": "2026-02-02T22:09:21",
    "detection": {
      "confidence": 0.96,
      "location": "Forest Area, GPS: 12.3456, 78.9012"
    },
    "alert_result": {
      "success": true,
      "delivered": ["+917810026278", "+919626351526"],
      "total_sent": 2
    }
  }
]
```

## 🧪 Testing

### Test SMS from Command Line

```bash
cd mining-watcher-main/notification_system
python realtime_sms_alert.py
```

### Test via API

```bash
curl -X POST http://localhost:5001/api/sms/test
```

### Test from React

Use the "Send Test SMS" button in the SMSAlertMonitor component.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sms/send-alert` | Send SMS alert |
| GET | `/api/sms/history` | Get alert history |
| GET | `/api/sms/config` | Get configuration |
| PUT | `/api/sms/config` | Update configuration |
| POST | `/api/sms/test` | Send test SMS |
| GET | `/api/health` | Health check |

## 🔒 Security

- ✅ Never commit `.env` files
- ✅ Keep Twilio credentials secret
- ✅ Use HTTPS in production
- ✅ Rotate auth tokens regularly

## 🐛 Troubleshooting

### SMS API not starting?
```bash
cd notification_system
pip install -r requirements.txt
python bridge_api.py
```

### SMS not received?
1. Check `.env` has correct Twilio credentials
2. Verify phone numbers include country code (+91)
3. Check `alert_log.json` for delivery status
4. Visit Twilio Console for SMS logs

### React can't connect to API?
1. Ensure SMS API is running on port 5001
2. Check `.env.local` has `VITE_SMS_API_URL=http://localhost:5001`
3. Restart React dev server after changing `.env.local`

### Confidence threshold not working?
1. Check `MIN_CONFIDENCE_THRESHOLD` in `.env`
2. Restart SMS API after changing config
3. Verify detection confidence value is correct (0-1 range)

## 📞 Support

For issues:
1. Check `alert_log.json` for errors
2. Check SMS API console output
3. Check Twilio Console logs
4. Verify `.env` configuration

## 🎉 You're All Set!

Your SMS alert system is fully integrated and ready to send real-time notifications when illegal mining is detected!

**Next Steps:**
1. Run `start_sms_api.bat` to start SMS server
2. Run `npm run dev` to start React app
3. Test with the "Send Test SMS" button
4. Monitor alerts in the dashboard
