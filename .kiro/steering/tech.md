# Technical Specification: OTT Platform

## System Architecture Overview

### Architecture Pattern
**Microservices Architecture** with event-driven communication, designed for horizontal scalability and fault isolation.

### Technology Stack

#### Backend Services
- **Runtime**: Node.js 20+ with NestJS framework
- **API Gateway**: NestJS with rate limiting and request validation
- **Service Communication**: REST APIs + Redis Pub/Sub for events
- **Authentication**: JWT with refresh tokens, bcrypt for password hashing

#### Frontend Applications
- **Web**: Next.js 14+ (App Router), React 18, Tailwind CSS, shadcn/ui components
- **Mobile**: React Native with Expo (iOS/Android)
- **Video Player**: Video.js with HLS.js plugin for adaptive streaming

#### Data Layer
- **PostgreSQL 15+**: Content metadata, user accounts, subscriptions, CMS workflow
- **MongoDB 6+**: User activity, viewing history, engagement metrics, recommendations cache
- **Redis 7+**: Session management, API caching, real-time playback positions

#### Video Processing
- **Local Development**: FFmpeg for transcoding to HLS (144p, 360p, 480p, 720p, 1080p)
- **Cloud Ready**: Integration hooks for AWS Elemental MediaConvert

#### Infrastructure
- **Containerization**: Docker + Docker Compose (local), Kubernetes-ready
- **Reverse Proxy**: Nginx for static assets and load balancing
- **Monitoring**: Prometheus + Grafana (metrics), Winston (logging)

## Microservices Breakdown

### 1. API Gateway Service
**Port**: 3000  
**Responsibilities**:
- Request routing to downstream services
- JWT validation and user context injection
- Rate limiting (100 req/min per user)
- Request/response logging
- CORS handling

### 2. Auth Service
**Port**: 3001  
**Database**: PostgreSQL  
**Responsibilities**:
- User registration and login
- JWT token generation and refresh
- Multi-profile management (up to 5 profiles per account)
- Password reset flow
- Session management via Redis

**Key Entities**:
- Users (email, password_hash, subscription_tier, created_at)
- Profiles (user_id, name, avatar, maturity_rating, preferences)

### 3. Catalog Service
**Port**: 3002  
**Database**: PostgreSQL  
**Responsibilities**:
- Content metadata CRUD operations
- Genre and category management
- Search and filtering (title, genre, language, year)
- Content availability rules (geo-restrictions, time windows)
- Multi-language support (English, Hindi)

**Key Entities**:
- Content (id, type [movie/tv_show/sports], title, description, release_date, maturity_rating)
- Seasons (content_id, season_number, title)
- Episodes (season_id, episode_number, title, duration, video_url)
- VideoVariants (content_id/episode_id, quality, hls_url, dash_url)
- AudioTracks (content_id, language, url)
- Subtitles (content_id, language, url)
- Genres, ContentGenres (many-to-many)
- AvailabilityRules (content_id, geo_restriction, start_date, end_date, tier)

### 4. Streaming Service
**Port**: 3003  
**Database**: Redis (caching), MongoDB (playback logs)  
**Responsibilities**:
- HLS/DASH manifest generation
- Adaptive bitrate logic
- Playback position tracking (update every 10 seconds)
- DRM token generation (future)
- CDN URL signing

### 5. User Activity Service
**Port**: 3004  
**Database**: MongoDB  
**Responsibilities**:
- Continue watching list
- Watch history with completion percentages
- Engagement metrics (pause/rewind/abandon events)
- Watchlist management
- Real-time activity ingestion via event queue

**Key Collections**:
- viewing_sessions (user_id, profile_id, content_id, position, duration, completed_percentage, last_updated)
- watch_history (user_id, profile_id, content_id, watched_at, completion_rate)
- engagement_events (user_id, content_id, event_type, timestamp, metadata)

### 6. Recommendation Service
**Port**: 3005  
**Database**: MongoDB (user similarity matrices), PostgreSQL (content features)  
**Responsibilities**:
- Personalized content recommendations
- Trending content calculation
- Genre-based suggestions
- Collaborative filtering (user similarity)
- ML model integration hooks

**Algorithms**:
- Phase 1: Content-based filtering (genre, language preferences)
- Phase 2: Collaborative filtering (user-user similarity)
- Phase 3: Hybrid model with ML integration

### 7. CMS Service
**Port**: 3006  
**Database**: PostgreSQL  
**Responsibilities**:
- Content upload and metadata management
- Workflow state management (draft → review → published)
- Bulk content ingestion
- Version control for metadata edits
- Asset management (thumbnails, posters)

**Workflow States**:
- DRAFT: Editable by creator
- PENDING_REVIEW: Awaiting approval
- APPROVED: Ready for publish
- PUBLISHED: Live on platform
- ARCHIVED: Removed from catalog

### 8. Subscription Service
**Port**: 3007  
**Database**: PostgreSQL  
**Responsibilities**:
- Subscription tier management (Free/AVOD, Premium/SVOD)
- Payment processing integration hooks
- Subscription lifecycle (trial, active, expired, cancelled)
- Access control validation

### 9. Ad Service (AVOD)
**Port**: 3008  
**Database**: PostgreSQL, Redis  
**Responsibilities**:
- Ad inventory management
- VAST/VMAP ad tag generation
- Ad impression tracking
- Frequency capping

## Database Schemas

### PostgreSQL Schema (Catalog DB)

```sql
-- Content Types: movie, tv_show, sports
CREATE TYPE content_type AS ENUM ('movie', 'tv_show', 'sports');
CREATE TYPE workflow_state AS ENUM ('draft', 'pending_review', 'approved', 'published', 'archived');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    maturity_rating VARCHAR(10) DEFAULT 'PG-13',
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type content_type NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    release_date DATE,
    duration_minutes INT,
    maturity_rating VARCHAR(10),
    poster_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    trailer_url VARCHAR(500),
    workflow_state workflow_state DEFAULT 'draft',
    tier_requirement subscription_tier DEFAULT 'free',
    geo_restriction VARCHAR(10) DEFAULT 'IN',
    available_from TIMESTAMP,
    available_until TIMESTAMP,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    season_number INT NOT NULL,
    title VARCHAR(255),
    release_date DATE,
    UNIQUE(content_id, season_number)
);

CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT,
    thumbnail_url VARCHAR(500),
    UNIQUE(season_id, episode_number)
);

CREATE TABLE video_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    quality VARCHAR(10) NOT NULL, -- 144p, 360p, 480p, 720p, 1080p
    hls_url VARCHAR(1000) NOT NULL,
    dash_url VARCHAR(1000),
    bitrate_kbps INT,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);

CREATE TABLE audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL, -- en, hi
    label VARCHAR(50),
    url VARCHAR(1000) NOT NULL,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);

CREATE TABLE subtitles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    label VARCHAR(50),
    url VARCHAR(1000) NOT NULL,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);

CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE content_genres (
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, genre_id)
);

CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    metadata JSONB NOT NULL,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_workflow_state ON content(workflow_state);
CREATE INDEX idx_content_release_date ON content(release_date DESC);
CREATE INDEX idx_episodes_season ON episodes(season_id);
CREATE INDEX idx_video_variants_content ON video_variants(content_id);
CREATE INDEX idx_video_variants_episode ON video_variants(episode_id);
```

### MongoDB Schema (User Activity DB)

```javascript
// viewing_sessions collection
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  content_id: UUID,
  episode_id: UUID?, // for TV shows
  position_seconds: Number,
  duration_seconds: Number,
  completed_percentage: Number,
  last_updated: ISODate,
  device_type: String,
  created_at: ISODate
}

// watch_history collection
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  content_id: UUID,
  episode_id: UUID?,
  watched_at: ISODate,
  completion_rate: Number, // 0-100
  watch_duration_seconds: Number
}

// engagement_events collection
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  content_id: UUID,
  episode_id: UUID?,
  event_type: String, // play, pause, seek, rewind, abandon, complete
  timestamp: ISODate,
  position_seconds: Number,
  metadata: Object
}

// user_preferences collection
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  favorite_genres: [String],
  disliked_content: [UUID],
  watchlist: [UUID],
  updated_at: ISODate
}

// user_similarity_matrix collection (for collaborative filtering)
{
  _id: ObjectId,
  user_id: UUID,
  similar_users: [
    { user_id: UUID, similarity_score: Number }
  ],
  last_computed: ISODate
}
```

## API Design

### Auth Service APIs

```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login (returns JWT)
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/logout            - Invalidate session
GET    /api/auth/profiles          - List user profiles
POST   /api/auth/profiles          - Create new profile
PUT    /api/auth/profiles/:id      - Update profile
DELETE /api/auth/profiles/:id      - Delete profile
```

### Catalog Service APIs

```
GET    /api/catalog/content        - List content (with filters)
GET    /api/catalog/content/:id    - Get content details
GET    /api/catalog/search         - Search content
GET    /api/catalog/genres         - List all genres
GET    /api/catalog/trending       - Get trending content
GET    /api/catalog/content/:id/seasons - Get seasons for TV show
GET    /api/catalog/seasons/:id/episodes - Get episodes for season
```

### Streaming Service APIs

```
GET    /api/stream/:contentId/manifest     - Get HLS/DASH manifest
POST   /api/stream/playback/start          - Initialize playback session
PUT    /api/stream/playback/position       - Update playback position
POST   /api/stream/playback/complete       - Mark content as completed
```

### User Activity Service APIs

```
GET    /api/activity/continue-watching     - Get continue watching list
GET    /api/activity/history               - Get watch history
POST   /api/activity/watchlist             - Add to watchlist
DELETE /api/activity/watchlist/:contentId  - Remove from watchlist
GET    /api/activity/watchlist             - Get watchlist
```

### Recommendation Service APIs

```
GET    /api/recommendations/personalized   - Get personalized recommendations
GET    /api/recommendations/similar/:id    - Get similar content
GET    /api/recommendations/trending       - Get trending content
```

### CMS Service APIs

```
POST   /api/cms/content                    - Create content (draft)
PUT    /api/cms/content/:id                - Update content
POST   /api/cms/content/:id/submit-review  - Submit for review
POST   /api/cms/content/:id/approve        - Approve content
POST   /api/cms/content/:id/publish        - Publish content
POST   /api/cms/content/bulk-upload        - Bulk content upload
GET    /api/cms/content/:id/versions       - Get version history
```

## Non-Functional Requirements

### Performance
- API response time: p95 < 200ms
- Video stream start time: < 2 seconds
- Adaptive bitrate switching: < 500ms
- Database query optimization with proper indexing

### Scalability
- Horizontal scaling for all services
- Stateless service design
- Database connection pooling
- Redis caching for hot data
- CDN integration for video delivery

### Reliability
- Circuit breaker pattern for service-to-service calls
- Graceful degradation (recommendations fail → show trending)
- Database replication (read replicas)
- Automated health checks
- Retry logic with exponential backoff

### Security
- JWT with 15-minute access tokens, 7-day refresh tokens
- Password hashing with bcrypt (cost factor 12)
- Rate limiting on all public APIs
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection
- HTTPS only in production

### Observability
- Structured logging (Winston) with correlation IDs
- Prometheus metrics (request rate, latency, errors)
- Grafana dashboards
- Distributed tracing (future: OpenTelemetry)

## Development Setup

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+
- FFmpeg (for video processing)

### Local Environment
```bash
# Start infrastructure
docker-compose up -d postgres mongodb redis

# Install dependencies
npm install

# Run migrations
npm run migrate

# Seed test data
npm run seed

# Start services (development mode)
npm run dev
```

### Environment Variables
```
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ott_catalog
POSTGRES_USER=ott_user
POSTGRES_PASSWORD=secure_password

MONGODB_URI=mongodb://localhost:27017/ott_activity
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Services
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
CATALOG_SERVICE_PORT=3002
STREAMING_SERVICE_PORT=3003
```

## CI/CD Pipeline

### GitHub Actions Workflow
1. **Lint & Format**: ESLint, Prettier
2. **Unit Tests**: Jest with coverage > 80%
3. **Integration Tests**: Supertest for API testing
4. **Build**: Docker image creation
5. **Push**: Docker registry (Docker Hub / AWS ECR)
6. **Deploy**: Kubernetes manifests (future)

### Kiro Agent Hooks
- **On File Save**: Auto-format with Prettier
- **On Commit**: Run linter and unit tests
- **On PR**: Security scan with npm audit

## Deployment Architecture (Future Cloud)

### AWS Services
- **ECS/EKS**: Container orchestration
- **RDS**: PostgreSQL managed database
- **DocumentDB**: MongoDB-compatible service
- **ElastiCache**: Redis managed service
- **S3**: Video storage
- **CloudFront**: CDN for video delivery
- **Elemental MediaConvert**: Video transcoding
- **Route53**: DNS management
- **ALB**: Load balancing

### Kubernetes Resources
- Deployments for each microservice
- HorizontalPodAutoscaler (CPU > 70%)
- ConfigMaps for environment variables
- Secrets for sensitive data
- Ingress for external access
