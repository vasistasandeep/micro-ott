# 🚀 Start Here - Deploy Your OTT Platform

## ⚡ 3 Commands to Go Live

Since Railway trial expired, I've converted everything to run on Vercel serverless functions. No external backend needed!

### Command 1: Install Dependencies
```bash
npm install
```

### Command 2: Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Command 3: Add Database Credentials & Deploy to Production

**Option A: Via Command Line**
```bash
vercel env add POSTGRES_HOST
vercel env add POSTGRES_PORT  
vercel env add POSTGRES_DB
vercel env add POSTGRES_USER
vercel env add POSTGRES_PASSWORD
vercel env add POSTGRES_SSL

vercel --prod
```

**Option B: Via Dashboard (Easier)**
1. Go to https://vercel.com/dashboard
2. Click your project → Settings → Environment Variables
3. Copy all values from your `.env.production` file:
   - POSTGRES_HOST
   - POSTGRES_PORT (5432)
   - POSTGRES_DB
   - POSTGRES_USER
   - POSTGRES_PASSWORD
   - POSTGRES_SSL (true)
4. Run: `vercel --prod`

---

## ✅ That's It!

Your OTT platform is live at: `https://your-project.vercel.app`

**What's deployed:**
- ✅ Frontend (HTML, CSS, JS)
- ✅ Backend APIs (Serverless functions)
- ✅ 500+ content items from Neon database
- ✅ Video player with controls
- ✅ Responsive design

**Cost:** $0/month (Vercel free tier)

---

## 🧪 Test Your Deployment

### Test APIs:
```bash
curl https://your-project.vercel.app/api/catalog/content?limit=5
curl https://your-project.vercel.app/api/catalog/genres
curl https://your-project.vercel.app/api/catalog/trending
```

### Test Frontend:
1. Open your Vercel URL in browser
2. Content should load automatically
3. Click any content item
4. Video player should work

---

## 📚 Need More Help?

- **Full Guide**: See `VERCEL_ONLY_DEPLOY.md`
- **Quick Commands**: See `DEPLOY_COMMANDS.md`
- **Troubleshooting**: Check Vercel dashboard → Functions → Logs

---

## 🎯 What Changed from Railway?

| Before (Railway) | Now (Vercel) |
|------------------|--------------|
| Separate backend service | Serverless functions |
| $5-20/month | $0/month |
| 2 platforms to manage | 1 platform |
| Manual scaling | Auto-scaling |
| Complex setup | 3 commands |

---

**Ready to deploy? Run the 3 commands above! 🚀**

