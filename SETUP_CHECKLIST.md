# Setup Checklist - OTT Platform

Use this checklist to verify your setup is complete.

## ✅ Pre-Installation

- [x] Node.js 20+ installed
- [x] npm 9+ installed
- [x] Docker Desktop installed
- [x] Git installed

## ✅ Project Files Created

### Root Configuration
- [x] package.json (monorepo config)
- [x] tsconfig.json (TypeScript config)
- [x] .eslintrc.json (linting rules)
- [x] .prettierrc (formatting rules)
- [x] .gitignore
- [x] .env.example
- [x] docker-compose.yml
- [x] README.md
- [x] QUICKSTART.md
- [x] PROJECT_STATUS.md

### Services
- [x] services/api-gateway/ (Port 3000)
  - [x] src/index.ts
  - [x] package.json
  - [x] tsconfig.json
  
- [x] services/auth-service/ (Port 3001)
  - [x] src/index.ts
  - [x] src/app.module.ts
  - [x] src/auth/auth.controller.ts
  - [x] src/auth/auth.service.ts
  - [x] src/auth/auth.module.ts
  - [x] src/database/database.module.ts
  - [x] package.json
  - [x] tsconfig.json

- [x] services/catalog-service/ (Port 3002)
  - [x] src/index.ts
  - [x] src/app.module.ts
  - [x] src/content/content.controller.ts
  - [x] src/content/content.service.ts
  - [x] src/content/content.module.ts
  - [x] src/database/database.module.ts
  - [x] src/database/seed.ts
  - [x] package.json
  - [x] tsconfig.json

- [x] services/streaming-service/ (Port 3003)
  - [x] src/index.ts
  - [x] src/app.module.ts
  - [x] src/playback/playback.controller.ts
  - [x] src/playback/playback.service.ts
  - [x] src/playback/playback.module.ts
  - [x] src/redis/redis.module.ts
  - [x] package.json
  - [x] tsconfig.json

### Shared Packages
- [x] packages/shared/
  - [x] src/index.ts
  - [x] src/logger.ts
  - [x] package.json
  - [x] tsconfig.json

- [x] packages/types/
  - [x] src/index.ts
  - [x] package.json
  - [x] tsconfig.json

### Infrastructure
- [x] infrastructure/sql/init.sql
- [x] docker-compose.yml

### Documentation
- [x] docs/api.md
- [x] docs/getting-started.md
- [x] docs/deployment.md
- [x] .kiro/steering/product.md
- [x] .kiro/steering/tech.md

### CI/CD
- [x] .github/workflows/ci.yml

### Scripts
- [x] scripts/setup.sh (Linux/Mac)
- [x] scripts/setup.ps1 (Windows)

## ✅ Installation Steps

Run these commands in order:

### 1. Environment Setup
```bash
cp .env.example .env
```
- [x] .env file created

### 2. Install Dependencies
```bash
npm install
```
- [x] node_modules/ created
- [x] package-lock.json created
- [x] All dependencies installed

### 3. Build Shared Packages
```bash
npm run build --workspace=packages/shared
npm run build --workspace=packages/types
```
- [x] packages/shared/dist/ created
- [x] packages/types/dist/ created

### 4. Start Docker Services
```bash
npm run docker:up
```
- [x] PostgreSQL container running (port 5432)
- [x] MongoDB container running (port 27017)
- [x] Redis container running (port 6379)

Verify with: `docker ps`

### 5. Initialize Database
```bash
npm run migrate
```
- [x] Database schema created
- [x] 15 tables created
- [x] Indexes created
- [x] 10 genres seeded

### 6. Seed Test Data
```bash
npm run seed
```
- [x] 3 movies added
- [x] 1 TV show added (with 1 season, 3 episodes)
- [x] Video variants added
- [x] Audio tracks added
- [x] Subtitles added

## ✅ Verification

### Test Services Start
```bash
npm run dev
```

Check that all services start without errors:
- [x] API Gateway listening on port 3000
- [x] Auth Service listening on port 3001
- [x] Catalog Service listening on port 3002
- [x] Streaming Service listening on port 3003

### Test API Endpoints

#### Health Check
```bash
curl http://localhost:3000/health
```
Expected: `{"status":"ok","service":"api-gateway"}`

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ott.com","password":"test123"}'
```
Expected: User object with id, email, subscriptionTier

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ott.com","password":"test123"}'
```
Expected: accessToken, refreshToken, user object

#### Get Content
```bash
curl http://localhost:3000/api/catalog/content
```
Expected: Array of 4 content items (3 movies + 1 TV show)

#### Search Content
```bash
curl "http://localhost:3000/api/catalog/search?q=bunny"
```
Expected: Array with "Big Buck Bunny" movie

#### Get Genres
```bash
curl http://localhost:3000/api/catalog/genres
```
Expected: Array of 10 genres

## ✅ Database Verification

### PostgreSQL
```bash
docker exec -it ott-postgres psql -U ott_user -d ott_catalog -c "\dt"
```
Expected: List of 15 tables

### MongoDB
```bash
docker exec -it ott-mongodb mongosh ott_activity --eval "show collections"
```
Expected: MongoDB connection successful

### Redis
```bash
docker exec -it ott-redis redis-cli ping
```
Expected: PONG

## ✅ Code Quality

### Linting
```bash
npm run lint
```
Expected: No errors (warnings are OK)

### Formatting
```bash
npm run format
```
Expected: Files formatted successfully

## 🎯 Final Checklist

- [x] All services start without errors
- [x] API endpoints respond correctly
- [x] Database contains seed data
- [x] Docker containers are healthy
- [x] Documentation is complete
- [x] Code quality tools configured

## 🚀 You're Ready!

If all items are checked, your OTT platform is ready for development!

Next steps:
1. Read QUICKSTART.md for usage examples
2. Explore docs/ for detailed documentation
3. Start building features!

## 🆘 Troubleshooting

If any step fails, check:
- Docker Desktop is running
- Ports 3000-3003, 5432, 27017, 6379 are available
- Node.js version is 20+
- Run `npm run docker:down` and start over

For detailed troubleshooting, see docs/getting-started.md
