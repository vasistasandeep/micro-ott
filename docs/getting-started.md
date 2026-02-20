# Getting Started

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+ and npm 9+
- Docker and Docker Compose
- Git
- FFmpeg (optional, for video processing)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ott-platform
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all services and packages in the monorepo.

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and update any values as needed. The defaults work for local development.

### 4. Start Infrastructure Services

Start PostgreSQL, MongoDB, and Redis using Docker Compose:

```bash
npm run docker:up
```

Wait for all services to be healthy (about 30 seconds).

### 5. Initialize Database

Run migrations to create database schema:

```bash
npm run migrate
```

Seed the database with test content:

```bash
npm run seed
```

This will create:
- 3 sample movies (Big Buck Bunny, Sintel, Tears of Steel)
- 1 TV show with 1 season and 3 episodes
- 10 genres

### 6. Start Services

Start all microservices in development mode:

```bash
npm run dev
```

This starts:
- API Gateway (port 3000)
- Auth Service (port 3001)
- Catalog Service (port 3002)
- Streaming Service (port 3003)

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save the `accessToken` from the response.

### Get Content Catalog

```bash
curl http://localhost:3000/api/catalog/content
```

### Search Content

```bash
curl "http://localhost:3000/api/catalog/search?q=bunny"
```

### Get Trending Content

```bash
curl http://localhost:3000/api/catalog/trending
```

### Get Content Details

```bash
curl http://localhost:3000/api/catalog/content/<content-id>
```

## Development Workflow

### Running Individual Services

```bash
# Run only catalog service
npm run dev:catalog

# Run only auth service
npm run dev:auth

# Run only streaming service
npm run dev:streaming
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test
```

### Database Management

```bash
# Stop all infrastructure
npm run docker:down

# Restart infrastructure
npm run docker:up

# Re-seed database
npm run seed
```

## Project Structure

```
ott-platform/
├── services/              # Microservices
│   ├── api-gateway/      # API Gateway (port 3000)
│   ├── auth-service/     # Authentication (port 3001)
│   ├── catalog-service/  # Content catalog (port 3002)
│   └── streaming-service/# Video streaming (port 3003)
├── packages/             # Shared packages
│   ├── shared/          # Shared utilities
│   └── types/           # TypeScript types
├── infrastructure/       # Infrastructure configs
│   ├── sql/            # Database migrations
│   └── docker/         # Docker configs
└── docs/               # Documentation
```

## Next Steps

- [API Documentation](./api.md)
- [Database Schema](./schema.md)
- [Architecture Overview](../.kiro/steering/tech.md)
- [Product Vision](../.kiro/steering/product.md)

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors, check what's running:

```bash
# Windows
netstat -ano | findstr :3000

# Kill process
taskkill /PID <pid> /F
```

### Database Connection Issues

Ensure Docker containers are running:

```bash
docker ps
```

You should see containers for postgres, mongodb, and redis.

### Service Won't Start

Check logs for the specific service:

```bash
# View all container logs
docker-compose logs

# View specific service
docker-compose logs postgres
```
