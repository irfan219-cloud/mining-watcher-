# Twilio SMS Setup Guide

## Current Situation

You have a **Twilio Verify Service** which can only send verification codes (OTP), not custom alert messages.

## Two Options for SMS Alerts

### Option 1: Get a Twilio Phone Number (Recommended for Custom Messages)

**Pros:**
- Send custom alert messages with location and time
- Full control over message content
- Better for production use

**Steps:**
1. Go to https://console.twilio.com/us1/develop/phone-numbers/manage/search
2. Select country: **India**
3. Check capability: **SMS**
4. Click **Search**
5. Click **Buy** on any available number (free for trial accounts)
6. Copy the phone number (e.g., +91XXXXXXXXXX)
7. Update `.env`:
   ```env
   TWILIO_PHONE_NUMBER=+91XXXXXXXXXX
   ```

**Cost:** Free trial number, then ~$1/month + $0.0075 per SMS

### Option 2: Use Verify API (Current Setup)

**Pros:**
- Already working
- No phone number needed
- Free for trial

**Cons:**
- Can only send verification codes (OTP)
- Cannot send custom messages
- Not ideal for alerts

**Current working code:**
```python
from twilio.rest import Client

client = Client(ACCOUNT_SID, AUTH_TOKEN)
verification = client.verify.v2.services(VERIFY_SERVICE_SID) \
    .verifications \
    .create(to="+917810026278", channel='sms')
```

## Recommendation

**For mining alerts, you should get a Twilio phone number (Option 1)** because:
- You need to send custom messages with location and detection time
- Verification codes don't make sense for alerts
- It's still free with trial account

## Alternative: Use Other SMS Services

If you don't want to buy a Twilio number, consider:

1. **Twilio SendGrid** (Email instead of SMS)
2. **AWS SNS** (Amazon's SMS service)
3. **MSG91** (Indian SMS provider)
4. **Fast2SMS** (Indian SMS provider)
5. **TextLocal** (Indian SMS provider)

## Current Test Results

✓ **Twilio Verify API**: Working (sends verification codes)
✗ **Twilio Messaging API**: Not working (needs phone number)

## Next Steps

1. **Get a Twilio phone number** from the console
2. Update `.env` with the new number
3. Run `python direct_test.py` to test
4. SMS alerts will work with custom messages

## Questions?

- **Q: Do I need to pay?**
  A: No, trial accounts get free credits (~$15 USD)

- **Q: Can I use my personal number?**
  A: No, you must use a Twilio-registered number

- **Q: How do I get a free number?**
  A: Follow Option 1 steps above - trial accounts get one free

- **Q: What if I can't get an Indian number?**
  A: Try a US number (+1) - it can still send to Indian numbers
