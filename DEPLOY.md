# Quick Deployment Guide

## Fastest Way to Deploy (5 minutes)

### 1. Deploy Frontend to Vercel (FREE)

```bash
# Install Vercel CLI
npm install -g vercel

# Go to project directory
cd mining-watcher-main/mining-watcher-main

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

That's it! Your frontend will be live at a URL like: `https://mining-watcher-xxx.vercel.app`

### 2. Deploy Backend to Render (FREE)

**Option A: Via GitHub (Recommended)**
1. Push your code to GitHub
2. Go to: https://render.com
3. Sign up with GitHub
4. Click "New +" → "Web Service"
5. Connect your repository
6. Configure:
   - **Name:** mining-watcher-api
   - **Root Directory:** `notification_system`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python bridge_api.py`
7. Add environment variables (click "Advanced" → "Add Environment Variable"):
   ```
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid
   RECIPIENT_PHONES=+919626351526
   GMAIL_USER=mshow4176@gmail.com
   GMAIL_APP_PASSWORD=qwxbhbhfxmavbmum
   RECIPIENT_EMAILS=mshow4176@gmail.com
   ALERT_COOLDOWN_MINUTES=30
   MIN_CONFIDENCE_THRESHOLD=0.85
   ```
8. Click "Create Web Service"

**Option B: Without GitHub**
1. Go to: https://render.com
2. Click "New +" → "Web Service"
3. Choose "Public Git repository"
4. Or use Render's direct upload feature

### 3. Connect Frontend to Backend

After backend deploys, you'll get a URL like: `https://mining-watcher-api.onrender.com`

Update your Vercel deployment:
```bash
vercel env add VITE_SMS_API_URL
# Enter: https://mining-watcher-api.onrender.com

# Redeploy
vercel --prod
```

## Alternative: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## What Gets Deployed

### Frontend (Vercel/Netlify)
- React dashboard with 2D/3D maps
- Mining detection visualization
- Alert monitoring interface
- File upload for satellite imagery

### Backend (Render/Railway)
- SMS notification API
- Email notification system
- Alert history tracking
- Real-time detection processing

## After Deployment

1. Visit your frontend URL
2. Test SMS alerts from the dashboard
3. Upload satellite imagery
4. Monitor mining detections
5. Receive email and SMS alerts

## Cost

- **Vercel:** FREE (Hobby plan)
- **Render:** FREE (with limitations: sleeps after 15 min inactivity)
- **Netlify:** FREE (100GB bandwidth/month)

## Need Help?

Tell me which platform you prefer and I'll help you deploy step by step!
