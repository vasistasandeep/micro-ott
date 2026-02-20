# 🚀 Deploy Your OTT Platform to Vercel - Step by Step

## ⚡ Quick Overview

Since Vercel doesn't support full backend microservices, we'll use:
- **Vercel** → Frontend (HTML, CSS, JS)
- **Railway** → Backend services (API Gateway, Auth, Catalog, Streaming)
- **Cloud DBs** → Already set up! (Neon, MongoDB Atlas, Upstash Redis)

**Total Time**: 20-30 minutes

---

## 📋 Step 1: Deploy Backend to Railway (15 minutes)

### 1.1 Install Railway CLI

```bash
npm install -g @railway/cli
```

### 1.2 Login to Railway

```bash
railway login
```

This will open your browser. Sign up/login with GitHub.

### 1.3 Create New Project

```bash
# In your project root
railway init
```

When prompted:
- Project name: `ott-platform-backend`
- Press Enter

### 1.4 Deploy API Gateway

```bash
cd services/api-gateway
railway up
```

Wait for deployment to complete. Railway will show you the URL.

### 1.5 Add Environment Variables

1. Go to https://railway.app/dashboard
2. Click on your project
3. Click on "api-gateway" service
4. Click "Variables" tab
5. Click "Raw Editor"
6. Paste your credentials from `.env.production`:

```env
POSTGRES_HOST=your-neon-host
POSTGRES_PORT=5432
POSTGRES_DB=your-database
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password
POSTGRES_SSL=true

MONGODB_URI=your-mongodb-connection-string

REDIS_URL=your-redis-url
REDIS_TLS=true

PORT=3000
NODE_ENV=production

AUTH_SERVICE_URL=http://localhost:3001
CATALOG_SERVICE_URL=http://localhost:3002
STREAMING_SERVICE_URL=http://localhost:3003
```

7. Click "Update Variables"
8. Service will automatically redeploy

### 1.6 Get Your Railway URL

After deployment completes:
1. Click on "api-gateway" service
2. Go to "Settings" tab
3. Scroll to "Domains"
4. Click "Generate Domain"
5. Copy the URL (e.g., `https://api-gateway-production-xxxx.up.railway.app`)

**Save this URL! You'll need it for Vercel.**

---

## 📋 Step 2: Update Vercel Configuration (2 minutes)

### 2.1 Update vercel.json

Open `vercel.json` and replace `[YOUR-RAILWAY-URL]` with your actual Railway URL:

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://api-gateway-production-xxxx.up.railway.app/api/$1",
      ...
    }
  ]
}
```

### 2.2 Commit Changes

```bash
git add vercel.json
git commit -m "Configure Vercel with Railway backend URL"
git push origin main
```

---

## 📋 Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

Enter your email and verify.

### 3.3 Deploy to Vercel

```bash
# In your project root
vercel
```

Answer the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `ott-platform` (or your choice)
- **In which directory is your code located?** → `./`
- **Override settings?** → No

Wait for deployment...

### 3.4 Deploy to Production

```bash
vercel --prod
```

Vercel will give you a URL like: `https://ott-platform.vercel.app`

---

## ✅ Step 4: Test Your Deployment (3 minutes)

### 4.1 Open Your Vercel URL

Open the URL Vercel gave you in your browser.

### 4.2 Check Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors

### 4.3 Test Features

- [ ] Content loads on homepage
- [ ] Spotlight hero displays
- [ ] Content trays scroll
- [ ] Click on a content item
- [ ] Video player loads
- [ ] Can play video

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch content"

**Cause**: Railway backend not responding

**Fix**:
1. Check Railway dashboard - is service running?
2. Check Railway logs for errors
3. Verify environment variables are set
4. Test Railway URL directly: `https://your-railway-url/api/catalog/content?limit=5`

### Issue: CORS errors in browser console

**Cause**: Railway backend not allowing Vercel domain

**Fix**: Update API Gateway CORS settings:

```bash
# SSH into Railway or update code
cd services/api-gateway/src
# Edit index.ts to add your Vercel domain to CORS origins
```

### Issue: Database connection errors in Railway logs

**Cause**: Environment variables not set correctly

**Fix**:
1. Go to Railway dashboard
2. Check Variables tab
3. Verify all database credentials are correct
4. Make sure there are no extra spaces or quotes

---

## 💰 Cost Breakdown

### What You're Using:

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby (Free) | $0 |
| Railway | Free tier | $5 credit/month |
| Neon PostgreSQL | Free tier | $0 |
| MongoDB Atlas | Free tier | $0 |
| Upstash Redis | Free tier | $0 |

**Total**: $0-5/month (Railway gives $5 credit)

---

## 🎉 Success!

Your OTT platform is now live!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-railway-url.railway.app
- **Database**: Cloud-hosted (Neon, MongoDB, Redis)

### Share Your Platform:
- Send the Vercel URL to anyone
- They can browse 500+ content items
- Watch videos
- No installation needed!

---

## 🚀 Next Steps

### Optional Improvements:

1. **Custom Domain**
   - Buy domain from Namecheap/GoDaddy
   - Add to Vercel: Settings → Domains
   - Add to Railway: Settings → Domains

2. **Deploy Other Services**
   ```bash
   cd services/auth-service
   railway up
   
   cd services/catalog-service
   railway up
   
   cd services/streaming-service
   railway up
   ```

3. **Set Up Monitoring**
   - Railway has built-in metrics
   - Vercel has analytics dashboard
   - Add error tracking (Sentry)

4. **Enable HTTPS**
   - Already enabled by default on Vercel & Railway!

---

## 📞 Need Help?

### Railway Issues:
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Logs: Click service → "Logs" tab

### Vercel Issues:
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Logs: Click project → "Deployments" → Click deployment

---

## ✅ Deployment Checklist

- [ ] Railway CLI installed
- [ ] Logged into Railway
- [ ] API Gateway deployed to Railway
- [ ] Environment variables set in Railway
- [ ] Railway URL copied
- [ ] vercel.json updated with Railway URL
- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Frontend deployed to Vercel
- [ ] Tested Vercel URL
- [ ] Content loads correctly
- [ ] Video playback works

---

**You're all set! Your OTT platform is live on the internet! 🎉**

