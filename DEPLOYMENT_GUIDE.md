# Mining Watcher Deployment Guide

## Project Structure

This project has two components:
1. **Frontend:** React + Vite + TypeScript (main app)
2. **Backend:** Python Flask API (SMS/Email notifications)

## Option 1: Deploy to Vercel (Frontend) + Render (Backend)

### Step 1: Deploy Frontend to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from project root:
   ```bash
   cd mining-watcher-main/mining-watcher-main
   vercel
   ```

4. Follow prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? **mining-watcher**
   - Directory? **./mining-watcher-main/mining-watcher-main**
   - Override settings? **No**

5. Add environment variables in Vercel dashboard:
   - Go to: https://vercel.com/dashboard
   - Select your project → Settings → Environment Variables
   - Add your Supabase credentials (if any)

### Step 2: Deploy Backend to Render

1. Go to: https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository (or upload code)
5. Configure:
   - **Name:** mining-watcher-api
   - **Root Directory:** `notification_system`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python bridge_api.py`
6. Add Environment Variables:
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
   SMS_API_PORT=5001
   ```
7. Click "Create Web Service"

### Step 3: Connect Frontend to Backend

After backend is deployed, update your frontend environment:

1. Get your Render backend URL (e.g., `https://mining-watcher-api.onrender.com`)
2. Add to Vercel environment variables:
   ```
   VITE_SMS_API_URL=https://mining-watcher-api.onrender.com
   ```
3. Redeploy frontend

## Option 2: Deploy to Netlify (Frontend) + Railway (Backend)

### Frontend on Netlify

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login and deploy:
   ```bash
   cd mining-watcher-main/mining-watcher-main
   netlify login
   netlify deploy --prod
   ```

3. Follow prompts and select `dist` as publish directory

### Backend on Railway

1. Go to: https://railway.app
2. Sign up/Login
3. Click "New Project" → "Deploy from GitHub"
4. Select repository
5. Add environment variables (same as Render above)
6. Railway will auto-detect Python and deploy

## Option 3: All-in-One on Render

Deploy both frontend and backend on Render:

### Frontend (Static Site)
1. New → Static Site
2. Build Command: `npm run build`
3. Publish Directory: `dist`

### Backend (Web Service)
1. New → Web Service
2. Follow Step 2 from Option 1

## Quick Deploy Commands

### Build Frontend Locally
```bash
cd mining-watcher-main/mining-watcher-main
npm install
npm run build
```

### Test Backend Locally
```bash
cd notification_system
pip install -r requirements.txt
python bridge_api.py
```

## Environment Variables Needed

### Frontend (.env)
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_SMS_API_URL=https://your-backend-url.com
```

### Backend (.env)
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

## Post-Deployment Checklist

- [ ] Frontend accessible via URL
- [ ] Backend API responding at /api/health
- [ ] SMS alerts working (test via /api/sms/test)
- [ ] Email alerts working
- [ ] Frontend can connect to backend API
- [ ] Environment variables configured
- [ ] Domain configured (optional)

## Recommended: Vercel + Render

This is the easiest and most reliable option:
- **Vercel:** Free tier, excellent for React/Vite
- **Render:** Free tier available, good for Python Flask

## Need Help?

If you want me to deploy it for you, I'll need:
1. Which platform do you prefer? (Vercel, Netlify, Render, Railway)
2. Do you have accounts on these platforms?
3. Do you want to use GitHub for deployment or direct upload?

Let me know and I'll guide you through the specific steps!
