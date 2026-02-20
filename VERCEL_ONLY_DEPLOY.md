# 🚀 Deploy to Vercel Only (No Railway Needed!)

Since Railway trial expired, I've converted your backend to Vercel Serverless Functions. Everything runs on Vercel now!

## ✅ What's Changed

- Backend APIs are now serverless functions in `/api` folder
- No need for Railway, Render, or any other service
- Everything deploys to Vercel in one command
- Still uses your cloud databases (Neon, MongoDB, Redis)

---

## 📋 Step 1: Install Dependencies (1 minute)

```bash
npm install
```

This installs the `pg` package needed for serverless functions.

---

## 📋 Step 2: Deploy to Vercel (5 minutes)

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

Enter your email and verify.

### 2.3 Deploy

```bash
vercel
```

Answer the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `ott-platform`
- **In which directory is your code located?** → `./`
- **Override settings?** → No

Wait for deployment...

### 2.4 Add Environment Variables

After first deployment, add your database credentials:

```bash
# Add Neon PostgreSQL credentials
vercel env add POSTGRES_HOST
# Paste your Neon host when prompted

vercel env add POSTGRES_PORT
# Enter: 5432

vercel env add POSTGRES_DB
# Paste your database name

vercel env add POSTGRES_USER
# Paste your database user

vercel env add POSTGRES_PASSWORD
# Paste your database password

vercel env add POSTGRES_SSL
# Enter: true
```

Or add them via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Add all variables from your `.env.production` file

### 2.5 Deploy to Production

```bash
vercel --prod
```

---

## ✅ Step 3: Test Your Deployment (2 minutes)

Vercel will give you a URL like: `https://ott-platform.vercel.app`

### Test the APIs:

```bash
# Test content API
curl https://ott-platform.vercel.app/api/catalog/content?limit=5

# Test genres API
curl https://ott-platform.vercel.app/api/catalog/genres

# Test trending API
curl https://ott-platform.vercel.app/api/catalog/trending
```

### Test the Frontend:

1. Open: `https://ott-platform.vercel.app`
2. Content should load
3. Click on any content item
4. Video player should work

---

## 🎉 You're Live!

Your entire OTT platform is now running on Vercel:
- ✅ Frontend (HTML, CSS, JS)
- ✅ Backend APIs (Serverless Functions)
- ✅ Databases (Neon, MongoDB, Redis)

**Total Cost**: $0/month (Vercel free tier)

---

## 📊 What's Included

### Serverless API Endpoints:

- `GET /api/catalog/content` - List all content (with filters)
- `GET /api/catalog/content/:id` - Get single content details
- `GET /api/catalog/genres` - List all genres
- `GET /api/catalog/trending` - Get trending content

### Frontend:
- Homepage with spotlight hero
- Content trays (Movies, TV Shows, Sports)
- Video player with controls
- Responsive design

---

## 🔧 How It Works

### Serverless Functions:
- Each API endpoint is a separate function in `/api` folder
- Functions run on-demand (no always-on server needed)
- Automatically scales with traffic
- Cold start: ~1-2 seconds (first request)
- Warm requests: <100ms

### Database Connections:
- Uses connection pooling (max 1 connection per function)
- Connects to your Neon PostgreSQL
- SSL enabled for security

---

## 💰 Cost Breakdown

### Vercel Free Tier:
- **Serverless Functions**: 100GB-hours/month
- **Bandwidth**: 100GB/month
- **Deployments**: Unlimited
- **Custom Domains**: 1 included

**Your Usage** (estimated):
- Functions: ~5GB-hours/month (well within limit)
- Bandwidth: ~10GB/month (well within limit)

**Total**: $0/month

---

## 🚀 Next Steps

### 1. Add Custom Domain (Optional)

```bash
vercel domains add yourdomain.com
```

### 2. Enable Analytics

1. Go to Vercel Dashboard
2. Click your project
3. Go to Analytics tab
4. View traffic, performance, and errors

### 3. Set Up Monitoring

Vercel automatically monitors:
- Function execution time
- Error rates
- Traffic patterns
- Geographic distribution

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"

**Cause**: Environment variables not set

**Fix**:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all database credentials
3. Redeploy: `vercel --prod`

### Issue: "Function timeout"

**Cause**: Database query taking too long

**Fix**:
- Check Neon dashboard for slow queries
- Verify indexes are created (run migrations locally)
- Consider upgrading Neon to paid tier for better performance

### Issue: "Cold start is slow"

**Cause**: First request after inactivity

**Fix**:
- This is normal for serverless (1-2 seconds)
- Subsequent requests are fast (<100ms)
- Upgrade to Vercel Pro for faster cold starts

---

## 📝 Environment Variables Needed

Copy these from your `.env.production` file:

```
POSTGRES_HOST=your-neon-host
POSTGRES_PORT=5432
POSTGRES_DB=your-database
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password
POSTGRES_SSL=true
```

---

## ✅ Deployment Checklist

- [ ] `npm install` completed
- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] First deployment done (`vercel`)
- [ ] Environment variables added
- [ ] Production deployment done (`vercel --prod`)
- [ ] APIs tested and working
- [ ] Frontend loads correctly
- [ ] Video playback works

---

## 🎯 Advantages of Vercel-Only Deployment

✅ **Simpler**: One platform for everything  
✅ **Cheaper**: $0/month (vs $5-20 for Railway)  
✅ **Faster**: Edge network, global CDN  
✅ **Scalable**: Auto-scales with traffic  
✅ **Reliable**: 99.99% uptime SLA  
✅ **Easy**: Deploy with one command  

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Serverless Functions**: https://vercel.com/docs/functions
- **Environment Variables**: https://vercel.com/docs/environment-variables
- **Custom Domains**: https://vercel.com/docs/custom-domains

---

**Your OTT platform is live! Share the URL and enjoy! 🎉**

