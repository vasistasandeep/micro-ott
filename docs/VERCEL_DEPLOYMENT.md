# 🚀 Vercel Deployment Guide

## Important Note

Vercel is optimized for **frontend and serverless functions**, not full microservices architectures. For this OTT platform with multiple backend services and databases, we have two deployment options:

### Option 1: Hybrid Deployment (Recommended)
- **Frontend**: Deploy to Vercel
- **Backend Services**: Deploy to Railway, Render, or AWS
- **Databases**: Use managed services (Neon, MongoDB Atlas, Upstash Redis)

### Option 2: Full Serverless (Requires Refactoring)
- Convert microservices to Vercel serverless functions
- Use serverless databases
- Significant code changes required

This guide covers **Option 1** which is production-ready and scalable.

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                         │
│              https://your-app.vercel.app                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Railway/Render (Backend Services)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Gateway  │  │ Auth Service │  │Catalog Service│      │
│  │   (Port 80)  │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Managed Databases                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Neon (PG)    │  │MongoDB Atlas │  │Upstash Redis │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

### 1. Accounts Needed
- ✅ Vercel account (https://vercel.com)
- ✅ Railway account (https://railway.app) OR Render (https://render.com)
- ✅ Neon account for PostgreSQL (https://neon.tech)
- ✅ MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- ✅ Upstash account for Redis (https://upstash.com)

### 2. Tools Required
```bash
# Install Vercel CLI
npm install -g vercel

# Install Railway CLI (optional)
npm install -g @railway/cli
```

---

## 🗄️ Step 1: Setup Managed Databases

### 1.1 PostgreSQL (Neon)

1. Go to https://neon.tech
2. Create a new project: "ott-platform-db"
3. Copy the connection string:
   ```
   postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```
4. Run migrations:
   ```bash
   # Update .env with Neon connection string
   POSTGRES_HOST=ep-xxx.neon.tech
   POSTGRES_DB=neondb
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password
   POSTGRES_SSL=true
   
   # Run migrations
   cd services/catalog-service
   npm run migrate
   npm run seed
   ```

### 1.2 MongoDB (Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow from anywhere)
5. Get connection string:
   ```
   mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/ott_activity?retryWrites=true&w=majority
   ```

### 1.3 Redis (Upstash)

1. Go to https://upstash.com
2. Create a new Redis database
3. Copy connection details:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token
   ```

---

## 🖥️ Step 2: Deploy Backend Services (Railway)

### 2.1 Prepare for Railway Deployment

Create `railway.json` in project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2.2 Deploy API Gateway

```bash
# Login to Railway
railway login

# Create new project
railway init

# Link to API Gateway service
cd services/api-gateway

# Deploy
railway up

# Set environment variables in Railway dashboard
railway variables set POSTGRES_HOST=your-neon-host
railway variables set MONGODB_URI=your-atlas-uri
railway variables set REDIS_URL=your-upstash-url
railway variables set AUTH_SERVICE_URL=https://auth-service.railway.app
railway variables set CATALOG_SERVICE_URL=https://catalog-service.railway.app
railway variables set STREAMING_SERVICE_URL=https://streaming-service.railway.app
```

### 2.3 Deploy Other Services

Repeat for each service:
- Auth Service (Port 3001)
- Catalog Service (Port 3002)
- Streaming Service (Port 3003)

```bash
cd services/auth-service
railway up

cd services/catalog-service
railway up

cd services/streaming-service
railway up
```

### 2.4 Get Service URLs

After deployment, Railway provides URLs like:
- API Gateway: `https://api-gateway-production-xxxx.up.railway.app`
- Auth Service: `https://auth-service-production-xxxx.up.railway.app`
- Catalog Service: `https://catalog-service-production-xxxx.up.railway.app`

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend for Vercel

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-api-gateway.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "API_BASE_URL": "https://your-api-gateway.railway.app"
  }
}
```

### 3.2 Update Frontend API Configuration

Update `public/app.js`:

```javascript
// Change this line
const API_BASE = 'http://localhost:3000/api';

// To this (use environment variable)
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : 'https://your-api-gateway.railway.app/api';
```

### 3.3 Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? ott-platform
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### 3.4 Configure Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   ```
   API_BASE_URL=https://your-api-gateway.railway.app
   ```

---

## 🔧 Step 4: Configure CORS

Update API Gateway to allow Vercel domain:

```typescript
// services/api-gateway/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app',
    'https://your-app-*.vercel.app' // Preview deployments
  ],
  credentials: true
}));
```

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend Services

```bash
# Test API Gateway
curl https://your-api-gateway.railway.app/health

# Test Catalog Service
curl https://your-api-gateway.railway.app/api/catalog/content?limit=5
```

### 5.2 Test Frontend

1. Open: `https://your-app.vercel.app`
2. Check browser console for errors
3. Verify content loads
4. Test video playback

---

## 📊 Cost Estimation

### Free Tier (Development)
- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month credit (enough for 2-3 services)
- **Neon**: Free tier (0.5GB storage)
- **MongoDB Atlas**: Free tier (512MB)
- **Upstash**: Free tier (10K commands/day)

**Total**: ~$0-5/month

### Production Tier
- **Vercel Pro**: $20/month
- **Railway**: ~$20-50/month (depending on usage)
- **Neon**: ~$20/month
- **MongoDB Atlas**: ~$25/month (M10 cluster)
- **Upstash**: ~$10/month

**Total**: ~$95-125/month

---

## 🚀 Alternative: Deploy to Single Platform

### Option A: Deploy Everything to Railway

Railway can host both frontend and backend:

```bash
# Deploy entire monorepo
railway init
railway up

# Railway will detect and deploy all services
```

### Option B: Deploy to Render

Similar to Railway but with different pricing:

1. Create `render.yaml`:

```yaml
services:
  - type: web
    name: api-gateway
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:gateway
    
  - type: web
    name: frontend
    env: static
    buildCommand: echo "No build needed"
    staticPublishPath: ./public
```

2. Connect GitHub repo to Render
3. Deploy automatically on push

---

## 🔐 Security Checklist

Before going to production:

- [ ] Enable HTTPS only
- [ ] Set up proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure CDN for video delivery
- [ ] Enable monitoring and logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure firewall rules
- [ ] Enable DDoS protection

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All services tested locally
- [ ] Database migrations run successfully
- [ ] Environment variables documented
- [ ] CORS configured correctly
- [ ] API endpoints tested

### Deployment
- [ ] Databases created and seeded
- [ ] Backend services deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] DNS configured (if custom domain)

### Post-Deployment
- [ ] Health checks passing
- [ ] Content loading correctly
- [ ] Video playback working
- [ ] Search functionality working
- [ ] Mobile responsive
- [ ] Performance optimized

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Problem**: CORS errors or connection refused

**Solution**:
1. Check API_BASE_URL is correct
2. Verify CORS settings in API Gateway
3. Ensure backend services are running
4. Check network tab in browser DevTools

### Database Connection Errors

**Problem**: Services can't connect to databases

**Solution**:
1. Verify connection strings
2. Check IP whitelist settings
3. Ensure SSL is enabled for Neon
4. Test connection with database client

### Slow Performance

**Problem**: Pages load slowly

**Solution**:
1. Enable CDN for images (Cloudflare)
2. Implement Redis caching
3. Optimize database queries
4. Use connection pooling
5. Enable gzip compression

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Neon Documentation](https://neon.tech/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Upstash Documentation](https://docs.upstash.com)

---

## 🎉 Success!

Once deployed, your OTT platform will be accessible at:
- **Frontend**: https://your-app.vercel.app
- **API**: https://your-api-gateway.railway.app

Share the link and enjoy your production OTT platform! 🚀

---

**Last Updated**: February 20, 2026  
**Deployment Type**: Hybrid (Vercel + Railway)  
**Estimated Setup Time**: 2-3 hours
