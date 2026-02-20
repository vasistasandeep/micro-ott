# Quick Start Guide - OTT Platform

## ✅ Installation Complete!

Your Netflix-scale OTT platform is ready. Follow these steps to get it running.

## Step 1: Copy Environment File

```bash
cp .env.example .env
```

The default values work for local development.

## Step 2: Start Infrastructure (Docker)

Start PostgreSQL, MongoDB, and Redis:

```bash
npm run docker:up
```

Wait 30 seconds for services to be healthy. Verify with:

```bash
docker ps
```

You should see 3 containers running:
- ott-postgres (port 5432)
- ott-mongodb (port 27017)
- ott-redis (port 6379)

## Step 3: Initialize Database

Run migrations to create tables:

```bash
npm run migrate
```

Seed with test content (3 movies + 1 TV show):

```bash
npm run seed
```

## Step 4: Start All Services

```bash
npm run dev
```

This starts:
- ✅ API Gateway → http://localhost:3000
- ✅ Auth Service → http://localhost:3001
- ✅ Catalog Service → http://localhost:3002
- ✅ Streaming Service → http://localhost:3003

## Step 5: Test the API

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"demo@ott.com\",\"password\":\"demo123\"}"
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"demo@ott.com\",\"password\":\"demo123\"}"
```

Save the `accessToken` from response.

### Browse Content
```bash
# All content
curl http://localhost:3000/api/catalog/content

# Movies only
curl http://localhost:3000/api/catalog/content?type=movie

# Search
curl "http://localhost:3000/api/catalog/search?q=bunny"

# Trending
curl http://localhost:3000/api/catalog/trending
```

## 🎬 Test Content Available

The seed script includes:
1. **Big Buck Bunny** (Movie, Free, Comedy/Kids)
2. **Sintel** (Movie, Free, Action/Drama)
3. **Tears of Steel** (Movie, Premium, Sci-Fi/Action)
4. **Demo Series** (TV Show, Free, Drama) - 1 season, 3 episodes

All use test HLS streams for immediate playback testing.

## 📁 Project Structure

```
ott-platform/
├── services/
│   ├── api-gateway/      # Port 3000 - Routes requests
│   ├── auth-service/     # Port 3001 - User auth & profiles
│   ├── catalog-service/  # Port 3002 - Content metadata
│   └── streaming-service/# Port 3003 - Video playback
├── packages/
│   ├── shared/          # Logger, utilities
│   └── types/           # TypeScript types
└── docs/               # Full documentation
```

## 🛠️ Development Commands

```bash
# Run individual services
npm run dev:gateway
npm run dev:auth
npm run dev:catalog
npm run dev:streaming

# Code quality
npm run lint
npm run format

# Stop infrastructure
npm run docker:down

# Restart everything
npm run docker:down && npm run docker:up
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Windows - Find process on port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID <pid> /F
```

### Database Connection Failed
```bash
# Check Docker containers
docker ps

# View logs
docker-compose logs postgres
docker-compose logs mongodb
```

### Service Won't Start
Check if dependencies are built:
```bash
npm run build --workspace=packages/shared
npm run build --workspace=packages/types
```

## 📚 Next Steps

1. **Read Documentation**
   - [API Documentation](docs/api.md)
   - [Technical Spec](.kiro/steering/tech.md)
   - [Product Vision](.kiro/steering/product.md)

2. **Explore Features**
   - Multi-profile support (up to 5 per account)
   - Continue watching functionality
   - Multi-language content (English/Hindi)
   - Freemium model (Free/Premium tiers)

3. **Build Frontend**
   - Next.js web app (coming soon in `apps/web`)
   - React Native mobile app (coming soon in `apps/mobile`)

## 🚀 What's Implemented

✅ Microservices architecture (4 services)
✅ PostgreSQL database with full schema
✅ MongoDB for user activity
✅ Redis for caching & sessions
✅ JWT authentication
✅ Multi-profile support
✅ Content catalog (Movies, TV Shows, Sports)
✅ Video streaming with HLS
✅ Continue watching
✅ Search & filtering
✅ Trending content
✅ Multi-language support
✅ Freemium model
✅ Rate limiting
✅ Docker Compose setup
✅ CI/CD pipeline (GitHub Actions)

## 🎯 Phase 1 MVP - Complete!

All Phase 1 features from the product vision are implemented and ready for development.

## 💡 Tips

- Use Postman or Thunder Client for API testing
- Check service logs in the terminal for debugging
- Database is seeded with test data - safe to experiment
- All services auto-reload on code changes (ts-node-dev)

## 🆘 Need Help?

- Check [Getting Started Guide](docs/getting-started.md)
- Review [Deployment Guide](docs/deployment.md)
- See [Database Schema](.kiro/steering/tech.md#database-schemas)

---

**Happy Coding! 🎉**
