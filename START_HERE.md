# 🚀 START HERE - Run Your OTT Platform

Follow these simple steps to get your Netflix-scale OTT platform running!

## ✅ Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 20+ installed (check: `node -v`)
- ✅ Docker Desktop installed and **RUNNING** ⚠️ IMPORTANT!
- ✅ npm installed (check: `npm -v`)

## 🎯 Quick Start (5 Steps)

### Step 1: Start Docker Desktop

**⚠️ CRITICAL: Open Docker Desktop and wait for it to fully start!**

You should see the Docker icon in your system tray showing "Docker Desktop is running"

### Step 2: Start Infrastructure Services

Open PowerShell in this folder and run:

```powershell
docker-compose up -d
```

This starts:
- PostgreSQL (database for content)
- MongoDB (database for user activity)
- Redis (cache for sessions)

Wait 30 seconds for services to initialize.

Verify they're running:
```powershell
docker ps
```

You should see 3 containers: `ott-postgres`, `ott-mongodb`, `ott-redis`

### Step 3: Initialize Database

Run the database migration to create tables:

```powershell
npm run migrate
```

Expected output: "Migration completed successfully"

### Step 4: Add Test Content

Seed the database with 3 movies and 1 TV show:

```powershell
npm run seed
```

Expected output: "Database seeding completed successfully!"

### Step 5: Start All Services

Start the 4 microservices:

```powershell
npm run dev
```

This starts:
- ✅ API Gateway → http://localhost:3000
- ✅ Auth Service → http://localhost:3001
- ✅ Catalog Service → http://localhost:3002
- ✅ Streaming Service → http://localhost:3003

**Keep this terminal window open!** The services are running here.

## 🎉 Test It's Working!

Open a NEW PowerShell window and test the API:

### Test 1: Health Check
```powershell
curl http://localhost:3000/health
```
Expected: `{"status":"ok"}`

### Test 2: Get Content
```powershell
curl http://localhost:3000/api/catalog/content
```
Expected: JSON array with 4 items (3 movies + 1 TV show)

### Test 3: Register a User
```powershell
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{\"email\":\"demo@ott.com\",\"password\":\"demo123\"}'
```
Expected: User object with id and email

### Test 4: Login
```powershell
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{\"email\":\"demo@ott.com\",\"password\":\"demo123\"}'
```
Expected: Access token and user info

## 🎬 What Content Is Available?

Your platform comes pre-loaded with:

1. **Big Buck Bunny** (Movie, Free, Comedy)
2. **Sintel** (Movie, Free, Action/Drama)
3. **Tears of Steel** (Movie, Premium, Sci-Fi)
4. **Demo Series** (TV Show, Free, 3 episodes)

All with working HLS video streams!

## 📱 What Can You Do?

- ✅ Register users and login
- ✅ Create up to 5 profiles per account
- ✅ Browse movies and TV shows
- ✅ Search content
- ✅ View trending content
- ✅ Track watch history
- ✅ Continue watching from where you left off
- ✅ Multi-language support (English/Hindi)
- ✅ Multi-quality streaming (144p-1080p)

## 🛑 How to Stop

### Stop Services (Ctrl+C in the terminal running npm run dev)

### Stop Docker
```powershell
docker-compose down
```

## 🔧 Troubleshooting

### "Docker not found" or "Cannot connect to Docker"
- Make sure Docker Desktop is installed
- **Start Docker Desktop** from Start Menu
- Wait for it to fully start (green icon in system tray)
- Try again

### "Port already in use"
Find what's using the port:
```powershell
netstat -ano | findstr :3000
```

Kill the process:
```powershell
taskkill /PID <pid> /F
```

### "Database connection failed"
Check Docker containers are running:
```powershell
docker ps
```

If not running, restart:
```powershell
docker-compose down
docker-compose up -d
```

Wait 30 seconds, then try again.

### Services won't start
Make sure shared packages are built:
```powershell
npm run build --workspace=packages/shared
npm run build --workspace=packages/types
```

## 📚 Next Steps

Once everything is running:

1. **Explore the API** - See `docs/api.md` for all endpoints
2. **Read the docs** - Check `docs/getting-started.md`
3. **Understand the architecture** - See `.kiro/steering/tech.md`
4. **Build features** - Start coding!

## 🆘 Need More Help?

- Check `QUICKSTART.md` for detailed examples
- See `SETUP_CHECKLIST.md` for verification steps
- Read `PROJECT_STATUS.md` to see what's implemented
- Review `docs/getting-started.md` for troubleshooting

## 💡 Pro Tips

- Use Postman or Thunder Client for easier API testing
- Keep the `npm run dev` terminal open to see logs
- Check service logs if something fails
- Database is seeded with test data - safe to experiment!

---

**Ready? Start with Step 1: Open Docker Desktop! 🐳**
