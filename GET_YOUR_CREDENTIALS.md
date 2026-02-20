# 🔑 How to Get Your Database Credentials

You provided these credentials earlier. Here's how to retrieve them again:

---

## 📋 Option 1: Check Your Email/Notes

You shared these credentials with me earlier in the conversation:

### Neon PostgreSQL
- You provided a connection string that looked like:
  ```
  postgresql://neondb_owner:npg_...@ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
  ```

### MongoDB Atlas
- You provided:
  ```
  mongodb+srv://vasistasandeep_db_user:<password>@cluster0.hzrqnee.mongodb.net/?appName=Cluster0
  ```

### Upstash Redis
- You provided:
  ```
  redis://default:<password>@certain-ewe-28707.upstash.io:6379
  ```

**Check your chat history, email, or notes where you saved these!**

---

## 📋 Option 2: Get Fresh Credentials from Dashboards

### 1. Neon PostgreSQL

1. Go to: https://console.neon.tech
2. Login with your account
3. Click on your project
4. Click "Connection Details" or "Dashboard"
5. You'll see:
   - **Host**: `ep-xxxxx.neon.tech`
   - **Database**: `neondb` (or your database name)
   - **User**: `neondb_owner` (or your username)
   - **Password**: Click "Show" to reveal
   - **Port**: `5432`

**Copy these values!**

---

### 2. MongoDB Atlas

1. Go to: https://cloud.mongodb.com
2. Login with your account
3. Click "Database" in left sidebar
4. Click "Connect" button on your cluster
5. Choose "Connect your application"
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with your actual password
8. If you forgot password:
   - Go to "Database Access"
   - Click "Edit" on your user
   - Click "Edit Password"
   - Set new password

**Copy the full connection string!**

---

### 3. Upstash Redis

1. Go to: https://console.upstash.com
2. Login with your account
3. Click on your Redis database
4. Scroll to "REST API" section
5. You'll see:
   - **Endpoint**: `https://xxxxx.upstash.io`
   - **Password**: Click to reveal

Or use the connection string format:
```
redis://default:<password>@xxxxx.upstash.io:6379
```

**Copy these values!**

---

## 📝 Create Your .env.production File

Once you have the credentials, create a file named `.env.production` in your project root:

```bash
# Create the file (Windows PowerShell)
New-Item -Path .env.production -ItemType File

# Or (Git Bash)
touch .env.production
```

Then paste this content and fill in your actual values:

```env
# Neon PostgreSQL
POSTGRES_HOST=ep-xxxxx.neon.tech
POSTGRES_PORT=5432
POSTGRES_DB=neondb
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=your_actual_password_here
POSTGRES_SSL=true

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ott_activity?retryWrites=true&w=majority

# Upstash Redis
REDIS_URL=redis://default:password@xxxxx.upstash.io:6379
REDIS_TLS=true
```

---

## 🚀 For Vercel Deployment

You don't actually need the `.env.production` file for Vercel! You can add credentials directly in Vercel dashboard:

### Add Credentials to Vercel:

1. Deploy first (without credentials):
   ```bash
   vercel
   ```

2. Go to: https://vercel.com/dashboard
3. Click your project
4. Go to: Settings → Environment Variables
5. Add each variable:

   **Click "Add New" for each:**
   
   - **Key**: `POSTGRES_HOST`  
     **Value**: `ep-xxxxx.neon.tech` (from Neon dashboard)
   
   - **Key**: `POSTGRES_PORT`  
     **Value**: `5432`
   
   - **Key**: `POSTGRES_DB`  
     **Value**: `neondb` (your database name)
   
   - **Key**: `POSTGRES_USER`  
     **Value**: `neondb_owner` (your username)
   
   - **Key**: `POSTGRES_PASSWORD`  
     **Value**: Your password from Neon
   
   - **Key**: `POSTGRES_SSL`  
     **Value**: `true`

6. Redeploy:
   ```bash
   vercel --prod
   ```

---

## 🎯 Quick Test

After adding credentials, test if they work:

### Test Neon Connection:
```bash
# If you have psql installed
psql "postgresql://user:password@host/database?sslmode=require" -c "SELECT COUNT(*) FROM content;"
```

### Test MongoDB Connection:
```bash
# If you have mongosh installed
mongosh "mongodb+srv://user:password@cluster.mongodb.net/ott_activity"
```

---

## ❓ Still Can't Find Credentials?

### Option A: Create New Databases (Fresh Start)

If you can't find the credentials, you can create new free databases:

1. **New Neon Database**: https://neon.tech (takes 2 minutes)
2. **New MongoDB Atlas**: https://mongodb.com/cloud/atlas (takes 3 minutes)
3. **New Upstash Redis**: https://upstash.com (takes 2 minutes)

Then run the migration scripts to set up the schema and seed data.

### Option B: Reset Passwords

1. **Neon**: Go to console → Settings → Reset password
2. **MongoDB**: Go to Database Access → Edit user → Change password
3. **Upstash**: Go to console → Database → Regenerate password

---

## 📞 Need Help?

If you're still stuck, tell me which specific credential you can't find and I'll help you retrieve it from the dashboard!

