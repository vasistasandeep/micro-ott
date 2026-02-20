# 🚀 Quick Deploy Commands

Copy and paste these commands in order:

## 1️⃣ Deploy Backend to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy API Gateway
cd services/api-gateway
railway up
```

**After deployment:**
1. Go to https://railway.app/dashboard
2. Click your project → api-gateway service
3. Click "Variables" → Add your database credentials from `.env.production`
4. Click "Settings" → "Generate Domain" → Copy the URL

---

## 2️⃣ Update Vercel Config

Edit `vercel.json` and replace `[YOUR-RAILWAY-URL]` with your Railway URL from step 1.

```bash
# Commit the change
git add vercel.json
git commit -m "Add Railway backend URL"
```

---

## 3️⃣ Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

---

## ✅ Done!

Your platform is live at the URL Vercel shows you!

Test it: Open the URL in your browser and check if content loads.

---

## 🔧 If Something Goes Wrong

### Test Railway backend directly:
```bash
curl https://your-railway-url/api/catalog/content?limit=5
```

Should return JSON with content data.

### Check Railway logs:
1. Go to Railway dashboard
2. Click api-gateway service
3. Click "Logs" tab

### Check Vercel logs:
1. Go to Vercel dashboard
2. Click your project
3. Click latest deployment
4. Click "Logs" tab

