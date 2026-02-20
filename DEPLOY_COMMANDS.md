# 🚀 Quick Deploy Commands

## ⚡ Vercel-Only Deployment (No Railway Needed!)

Since Railway trial expired, everything now runs on Vercel serverless functions.

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables (one-time setup)
vercel env add POSTGRES_HOST
vercel env add POSTGRES_PORT
vercel env add POSTGRES_DB
vercel env add POSTGRES_USER
vercel env add POSTGRES_PASSWORD
vercel env add POSTGRES_SSL

# Deploy to production
vercel --prod
```

---

## ✅ Done!

Your platform is live at the URL Vercel shows you!

Test it: Open the URL in your browser and check if content loads.

---

## 🔧 Alternative: Add Variables via Dashboard

1. Go to https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add all variables from `.env.production`
5. Redeploy: `vercel --prod`

---

## 📊 What's Deployed

- ✅ Frontend (public folder)
- ✅ Backend APIs (api folder - serverless functions)
- ✅ Connected to your cloud databases

**Cost**: $0/month (Vercel free tier)

---

## 🐛 If Something Goes Wrong

### Test APIs directly:
```bash
curl https://your-vercel-url.vercel.app/api/catalog/content?limit=5
```

Should return JSON with content data.

### Check Vercel logs:
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Functions" tab to see logs

---

## 📚 Full Guide

See `VERCEL_ONLY_DEPLOY.md` for detailed instructions.

