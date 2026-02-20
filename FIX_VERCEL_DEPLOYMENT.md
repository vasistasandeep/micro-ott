# 🔧 Fix Your Vercel Deployment - Step by Step

Your site is live at https://microott.vercel.app/ but content isn't loading. Here's how to fix it:

## 🎯 The Problem

The API functions can't connect to your Neon database because environment variables aren't set in Vercel.

## ✅ Solution - 3 Steps

### Step 1: Add Environment Variables to Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: **microott**
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Add these 6 variables by clicking **Add New**:

| Key | Value | Environments |
|-----|-------|--------------|
| `POSTGRES_HOST` | `ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech` | Production, Preview, Development |
| `POSTGRES_PORT` | `5432` | Production, Preview, Development |
| `POSTGRES_DB` | `neondb` | Production, Preview, Development |
| `POSTGRES_USER` | `neondb_owner` | Production, Preview, Development |
| `POSTGRES_PASSWORD` | `npg_WJQ3sodu9Uyr` | Production, Preview, Development |
| `POSTGRES_SSL` | `true` | Production, Preview, Development |

**Important**: Make sure to check all three environment checkboxes (Production, Preview, Development) for each variable!

### Step 2: Ensure Database Has Tables and Data

Your Neon database needs to have tables and content. Run these commands locally:

```bash
# Navigate to catalog service
cd services/catalog-service

# Run migrations (creates tables)
npm run migrate

# Seed database (adds 500+ content items)
npm run seed
```

This will populate your Neon database with:
- 400 movies
- 100 TV shows
- ~1,500 episodes
- 10 genres
- All with unique images

### Step 3: Redeploy to Vercel

After adding environment variables, you need to redeploy:

**Option A: Via Dashboard**
1. Go to your Vercel project
2. Click **Deployments** tab
3. Click the three dots (...) on the latest deployment
4. Click **Redeploy**

**Option B: Via CLI**
```bash
# Push latest code
git push origin main

# Redeploy
vercel --prod
```

---

## 🧪 Test Your Deployment

After redeployment, test these URLs:

### Test API Endpoints:
```bash
# Test content API
curl https://microott.vercel.app/api/catalog/content?limit=5

# Test trending API
curl https://microott.vercel.app/api/catalog/trending

# Test genres API
curl https://microott.vercel.app/api/catalog/genres
```

You should see JSON responses with content data!

### Test Frontend:
Open: https://microott.vercel.app/

You should see:
- ✅ Hero section with trending content
- ✅ Content cards in rows
- ✅ Images loading
- ✅ Smooth UI

---

## 🐛 Troubleshooting

### Issue: Still seeing "Loading..." or errors

**Check Vercel Function Logs:**
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Click on the latest deployment
4. Click **Functions** tab
5. Click on any function (e.g., `api/catalog/content`)
6. Check the logs for errors

**Common Issues:**
- Environment variables not set → Add them in Settings
- Database tables don't exist → Run migrations locally
- Database is empty → Run seed script locally

### Issue: "relation content does not exist"

This means your database doesn't have tables yet.

**Fix:**
```bash
cd services/catalog-service
npm run migrate
npm run seed
```

### Issue: "Failed to connect to database"

This means environment variables aren't set in Vercel.

**Fix:**
1. Go to Vercel Settings → Environment Variables
2. Add all 6 variables listed above
3. Redeploy

---

## 📊 Verify Database Has Data

You can check if your Neon database has data:

1. Go to: https://console.neon.tech
2. Click on your project
3. Click **SQL Editor**
4. Run this query:
   ```sql
   SELECT COUNT(*) FROM content;
   ```
5. Should return: **500** (or close to it)

If it returns 0 or error, you need to run migrations and seed.

---

## ✅ Success Checklist

- [ ] Environment variables added to Vercel (all 6)
- [ ] All variables have all 3 environments checked
- [ ] Database migrations run (`npm run migrate`)
- [ ] Database seeded (`npm run seed`)
- [ ] Vercel redeployed after adding variables
- [ ] API endpoints return data (test with curl)
- [ ] Frontend loads content
- [ ] Images display correctly

---

## 🎉 Expected Result

After following these steps, your site at https://microott.vercel.app/ should:
- ✅ Load instantly with beautiful UI
- ✅ Display 500+ content items
- ✅ Show trending content in hero
- ✅ Have working search
- ✅ Play videos when clicked
- ✅ Look professional and polished

---

## 📞 Quick Commands Reference

```bash
# Run migrations
cd services/catalog-service && npm run migrate

# Seed database
npm run seed

# Test API locally
cd ../.. && node test-api-local.js

# Deploy to Vercel
git push origin main
vercel --prod
```

---

**Your platform is almost ready! Just add those environment variables and redeploy! 🚀**

