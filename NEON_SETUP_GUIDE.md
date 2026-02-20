# 🚀 Neon PostgreSQL Setup Guide

## ✅ Your Neon Database is Ready!

You've already created your Neon PostgreSQL database. Now let's migrate your data to the cloud.

---

## 📋 Your Neon Connection Details

**⚠️ SECURITY NOTE**: Replace these placeholders with your actual Neon credentials.

```
Host: [your-project].neon.tech
Database: [your-database-name]
User: [your-database-user]
Password: [your-secure-password]
SSL: Required
```

**Connection String Format**:
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Where to find your credentials**:
1. Go to https://console.neon.tech
2. Select your project
3. Click "Connection Details"
4. Copy your connection string

---

## 🚀 Quick Migration (Automated)

### Option 1: Use Migration Script (Recommended)

**Windows (PowerShell)**:
```powershell
.\scripts\migrate-to-neon.ps1
```

**Linux/Mac**:
```bash
chmod +x scripts/migrate-to-neon.sh
./scripts/migrate-to-neon.sh
```

This script will:
1. Test connection to Neon
2. Run database migrations
3. Seed 500+ content assets
4. Verify everything works

**Time**: 5-10 minutes

---

## 🔧 Manual Migration (Step by Step)

### Step 1: Set Environment Variables

**⚠️ IMPORTANT**: Use your actual credentials from Neon dashboard.

**Windows (PowerShell)**:
```powershell
$env:POSTGRES_HOST = "[your-neon-host].neon.tech"
$env:POSTGRES_PORT = "5432"
$env:POSTGRES_DB = "[your-database-name]"
$env:POSTGRES_USER = "[your-database-user]"
$env:POSTGRES_PASSWORD = "[your-secure-password]"
$env:POSTGRES_SSL = "true"
```

**Linux/Mac (Bash)**:
```bash
export POSTGRES_HOST="[your-neon-host].neon.tech"
export POSTGRES_PORT="5432"
export POSTGRES_DB="[your-database-name]"
export POSTGRES_USER="[your-database-user]"
export POSTGRES_PASSWORD="[your-secure-password]"
export POSTGRES_SSL="true"
```

### Step 2: Run Migrations

```bash
cd services/catalog-service
npm run migrate
```

### Step 3: Seed Database

```bash
npm run seed
```

This will create:
- 400 movies
- 100 TV shows
- ~1,500+ episodes
- 10 genres
- All with unique images

**Time**: 5-10 minutes

### Step 4: Verify

```bash
# Test connection (if you have psql installed)
# Replace with your actual connection string
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" -c "SELECT COUNT(*) FROM content;"
```

Expected output: `count: 500`

---

## 🔄 Update Local Services to Use Neon

### Option 1: Use .env.production

Copy `.env.production` to `.env`:
```bash
cp .env.production .env
```

### Option 2: Update .env Manually

Edit your `.env` file:
```env
POSTGRES_HOST=[your-neon-host].neon.tech
POSTGRES_PORT=5432
POSTGRES_DB=[your-database-name]
POSTGRES_USER=[your-database-user]
POSTGRES_PASSWORD=[your-secure-password]
POSTGRES_SSL=true
```

### Restart Services

```bash
# Stop current services (Ctrl+C)

# Start with new configuration
npm run dev
```

---

## ✅ Verify Everything Works

### Test API

```bash
# Get content from Neon database
curl http://localhost:3000/api/catalog/content?limit=5
```

You should see content from your Neon database!

### Test Frontend

1. Open: http://localhost:3000
2. You should see 500+ content items
3. All images should load
4. Video playback should work

---

## 🌐 Deploy to Production

Now that your database is in the cloud, you can deploy your services:

### 1. Deploy Backend to Railway

```bash
# Set Neon connection in Railway
railway variables set POSTGRES_HOST=[your-neon-host].neon.tech
railway variables set POSTGRES_DB=[your-database-name]
railway variables set POSTGRES_USER=[your-database-user]
railway variables set POSTGRES_PASSWORD=[your-secure-password]
railway variables set POSTGRES_SSL=true

# Deploy
railway up
```

### 2. Deploy Frontend to Vercel

```bash
vercel --prod
```

---

## 📊 Neon Dashboard

Access your database dashboard:
1. Go to: https://console.neon.tech
2. Select your project
3. View:
   - Database size
   - Connection count
   - Query performance
   - Backups

---

## 🔐 Security Best Practices

### ✅ Already Configured
- SSL/TLS encryption enabled
- Connection pooling configured
- Secure password

### 🔒 Additional Security
1. **Rotate Password**: Change password in Neon dashboard
2. **IP Allowlist**: Restrict access to specific IPs (optional)
3. **Read-Only Users**: Create separate users for analytics
4. **Backup Schedule**: Enable automatic backups

---

## 💰 Neon Free Tier Limits

Your free tier includes:
- **Storage**: 0.5 GB
- **Compute**: 191.9 hours/month
- **Branches**: 10
- **Projects**: 1

**Current Usage** (after seeding):
- Storage: ~50-100 MB (well within limit)
- Compute: Minimal (only when querying)

**Upgrade When**:
- Storage > 0.5 GB
- Need more compute hours
- Want additional projects

---

## 🐛 Troubleshooting

### Connection Refused

**Problem**: Can't connect to Neon

**Solution**:
1. Check internet connection
2. Verify credentials are correct
3. Ensure SSL is enabled (`POSTGRES_SSL=true`)
4. Check Neon dashboard for service status

### SSL Error

**Problem**: SSL certificate verification failed

**Solution**:
Already configured with `rejectUnauthorized: false` in database module.

### Slow Queries

**Problem**: Queries taking too long

**Solution**:
1. Check Neon dashboard for compute status
2. Verify indexes are created (run migrations)
3. Consider upgrading to paid tier for more compute

### Migration Failed

**Problem**: Migration script errors

**Solution**:
1. Check if tables already exist
2. Drop tables and re-run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
3. Run migration again

---

## 📈 Monitoring

### Check Database Size

```sql
SELECT pg_size_pretty(pg_database_size('neondb'));
```

### Check Table Counts

```sql
SELECT 
  'content' as table_name, COUNT(*) as count FROM content
UNION ALL
SELECT 'episodes', COUNT(*) FROM episodes
UNION ALL
SELECT 'seasons', COUNT(*) FROM seasons
UNION ALL
SELECT 'genres', COUNT(*) FROM genres;
```

Expected:
- content: 500
- episodes: ~1,500
- seasons: ~150
- genres: 10

---

## 🎉 Success Checklist

- [ ] Neon database created
- [ ] Connection string obtained
- [ ] Environment variables set
- [ ] Migrations run successfully
- [ ] Database seeded with 500+ assets
- [ ] Local services connected to Neon
- [ ] API returning data from Neon
- [ ] Frontend displaying content
- [ ] Ready for production deployment

---

## 📚 Next Steps

1. ✅ **Neon Setup** - Complete!
2. ⏳ **MongoDB Atlas** - Set up for user activity
3. ⏳ **Upstash Redis** - Set up for caching
4. ⏳ **Railway Deploy** - Deploy backend services
5. ⏳ **Vercel Deploy** - Deploy frontend

See `DEPLOYMENT_QUICKSTART.md` for next steps.

---

## 🔗 Useful Links

- **Neon Console**: https://console.neon.tech
- **Neon Docs**: https://neon.tech/docs
- **Connection Pooling**: https://neon.tech/docs/connect/connection-pooling
- **Branching**: https://neon.tech/docs/introduction/branching

---

**Status**: ✅ Neon PostgreSQL Ready  
**Database**: neondb  
**Content**: 500+ assets  
**Ready for**: Production deployment

