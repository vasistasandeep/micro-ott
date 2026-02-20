# OTT Platform - Complete Requirements & Technical Specification

**Document Version**: 1.0  
**Last Updated**: February 20, 2026  
**Project**: Enterprise-Scale OTT Streaming Platform for Indian Market

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Requirements](#business-requirements)
3. [Functional Requirements](#functional-requirements)
4. [Technical Architecture](#technical-architecture)
5. [Database Design](#database-design)
6. [API Specifications](#api-specifications)
7. [Non-Functional Requirements](#non-functional-requirements)
8. [Security & Compliance](#security--compliance)
9. [Deployment Architecture](#deployment-architecture)
10. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Executive Summary

### 1.1 Project Vision
Build an enterprise-scale OTT (Over-The-Top) streaming platform targeting the Indian market with support for Movies, TV Shows, and Live Sports. The platform implements a freemium business model combining Ad-supported Video On Demand (AVOD) and Subscription Video On Demand (SVOD).

### 1.2 Target Market
- **Geography**: India (with future global expansion capability)
- **Languages**: English and Hindi (audio tracks + subtitles)
- **Content Types**: Movies, Multi-season TV Shows, Live Sports Events
- **Business Model**: Freemium (Free tier with ads + Premium subscription)

### 1.3 Key Differentiators
1. India-first design optimized for varying network conditions (2G to 5G)
2. Integrated sports streaming alongside entertainment content
3. Generous free tier to drive user acquisition
4. Multi-language support as a first-class feature
5. Adaptive streaming from 144p to 1080p



---

## 2. Business Requirements

### 2.1 Market Positioning
- **Primary Market**: India with 500M+ internet users
- **Target Audience**: Ages 18-45, urban and semi-urban populations
- **Content Strategy**: 70% Entertainment (Movies/TV) + 30% Sports
- **Pricing Strategy**: 
  - Free Tier: Ad-supported, 720p max quality
  - Premium Tier: ₹299/month, ad-free, 1080p, offline downloads

### 2.2 Business Goals
1. **User Acquisition**: 1M users in first 6 months
2. **Conversion Rate**: 15% free-to-premium conversion
3. **Engagement**: 45+ minutes average daily watch time
4. **Revenue Mix**: 60% SVOD subscriptions + 40% AVOD advertising
5. **Content Library**: 500+ titles at launch, 100+ new titles monthly

### 2.3 Monetization Model

#### AVOD (Ad-Supported Video On Demand)
- Pre-roll ads (15-30 seconds)
- Mid-roll ads every 15 minutes
- Maximum 4 ads per hour
- Frequency capping: Same ad max 2x per session
- Ad formats: Video ads (VAST/VMAP compliant)

#### SVOD (Subscription Video On Demand)
- Monthly subscription: ₹299
- Quarterly subscription: ₹799 (11% discount)
- Annual subscription: ₹2,999 (17% discount)
- Family plan: Up to 5 profiles
- Payment methods: UPI, Cards, Net Banking, Wallets

### 2.4 Content Rights Management
- Geographic restrictions (India-only for Phase 1)
- Time-based availability windows
- Licensing tier enforcement (Free vs Premium)
- Maturity ratings: U, U/A, A (Indian rating system)

---

## 3. Functional Requirements

### 3.1 User Management

#### FR-UM-001: User Registration
- Email-based registration with password
- Password requirements: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Email verification required
- Social login (Google, Facebook) - Phase 2
- Mobile OTP registration - Phase 2

#### FR-UM-002: User Authentication
- JWT-based authentication
- Access token: 15-minute expiry
- Refresh token: 7-day expiry
- Session management via Redis
- Logout invalidates all tokens

#### FR-UM-003: Multi-Profile Support
- Up to 5 profiles per account
- Profile attributes: Name, Avatar, Maturity Rating, Language Preference
- Profile-specific watch history and recommendations
- Kids profile with content filtering
- Profile switching without re-authentication

#### FR-UM-004: Subscription Management
- View current subscription status
- Upgrade/downgrade plans
- Payment history
- Auto-renewal settings
- Cancellation with end-of-period access



### 3.2 Content Catalog

#### FR-CC-001: Content Types
- **Movies**: Single video asset with metadata
- **TV Shows**: Multi-season structure with episodes
- **Sports**: Live events and replays

#### FR-CC-002: Content Metadata
Required fields:
- Title (English + Hindi)
- Description (English + Hindi)
- Release date
- Duration
- Maturity rating (U, U/A, A)
- Genres (multi-select)
- Cast and crew
- Poster image (16:9 ratio)
- Thumbnail image (4:3 ratio)
- Trailer URL

#### FR-CC-003: Multi-Season TV Shows
- Season number and title
- Episode number, title, description
- Episode duration
- Episode-specific thumbnails
- Season-level metadata

#### FR-CC-004: Video Quality Variants
- 144p (240 kbps) - 2G networks
- 360p (500 kbps) - 3G networks
- 480p (1 Mbps) - 3G/4G
- 720p (2.5 Mbps) - 4G/WiFi
- 1080p (5 Mbps) - 4G/5G/WiFi
- HLS and DASH manifest support

#### FR-CC-005: Multi-Language Support
- Audio tracks: English, Hindi
- Subtitles: English, Hindi
- User can switch during playback
- Default based on profile preference

#### FR-CC-006: Content Discovery
- Browse by genre (Action, Drama, Comedy, Thriller, Romance, Sports)
- Search by title, cast, genre
- Filter by language, year, maturity rating
- Sort by: Trending, Recently Added, A-Z, Release Date

#### FR-CC-007: Content Availability Rules
- Geographic restrictions (India-only enforcement)
- Time-based availability (start date, end date)
- Tier restrictions (Free vs Premium content)
- Coming soon content with release date

### 3.3 Video Playback

#### FR-VP-001: Adaptive Streaming
- HLS (HTTP Live Streaming) primary protocol
- DASH (Dynamic Adaptive Streaming) fallback
- Automatic quality switching based on bandwidth
- Manual quality selection override
- Smooth transitions between qualities (<500ms)

#### FR-VP-002: Player Controls
- Play/Pause
- Seek bar with thumbnail preview
- Volume control with mute
- Playback speed (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
- Quality selector
- Audio track selector
- Subtitle selector
- Fullscreen mode
- Picture-in-Picture (PiP) - Phase 2

#### FR-VP-003: Keyboard Shortcuts
- Space: Play/Pause
- Left/Right Arrow: Seek ±10 seconds
- Up/Down Arrow: Volume ±10%
- M: Mute/Unmute
- F: Fullscreen
- C: Toggle subtitles

#### FR-VP-004: Playback Position Tracking
- Update position every 10 seconds
- Resume from last position on return
- Mark as "watched" at 90% completion
- Cross-device sync via cloud storage

#### FR-VP-005: Stream Start Performance
- Target: <2 seconds from play to first frame
- Preload first segment on content page
- CDN edge caching for popular content



### 3.4 Personalization & Recommendations

#### FR-PR-001: Continue Watching
- Display content with <90% completion
- Show progress bar on thumbnail
- Sort by most recently watched
- Limit to 20 items per profile
- Remove on manual dismissal

#### FR-PR-002: Watch History
- Store all completed content
- Display completion percentage
- Filter by date range
- Clear history option
- Export history (CSV) - Phase 2

#### FR-PR-003: Personalized Recommendations
**Phase 1: Content-Based Filtering**
- Recommend based on watched genres
- Similar content by cast/director
- Language preference matching

**Phase 2: Collaborative Filtering**
- User-user similarity matrix
- "Users who watched X also watched Y"
- Trending within similar user cohorts

**Phase 3: ML-Based Hybrid**
- Deep learning recommendation models
- Real-time engagement signals
- A/B testing framework

#### FR-PR-004: Trending Content
- Calculate based on:
  - View count (last 7 days)
  - Completion rate
  - User ratings (Phase 2)
  - Social shares (Phase 3)
- Update every 6 hours
- Region-specific trending

#### FR-PR-005: Watchlist
- Add/remove content to personal list
- Unlimited items
- Notifications on new episodes (TV shows)
- Share watchlist (Phase 3)

### 3.5 Content Management System (CMS)

#### FR-CMS-001: Content Upload
- Drag-and-drop video upload
- Bulk upload via CSV + video files
- Automatic metadata extraction (duration, resolution)
- Thumbnail generation from video
- Progress tracking for large files

#### FR-CMS-002: Workflow Management
**States:**
1. **DRAFT**: Editable, not visible to users
2. **PENDING_REVIEW**: Submitted for approval
3. **APPROVED**: Ready to publish
4. **PUBLISHED**: Live on platform
5. **ARCHIVED**: Removed from catalog

**Transitions:**
- Creator: DRAFT → PENDING_REVIEW
- Reviewer: PENDING_REVIEW → APPROVED or DRAFT (with comments)
- Publisher: APPROVED → PUBLISHED
- Admin: Any state → ARCHIVED

#### FR-CMS-003: Metadata Management
- Rich text editor for descriptions
- Multi-language input fields
- Genre tagging with autocomplete
- Cast/crew database with search
- Image upload with crop/resize tools

#### FR-CMS-004: Version Control
- Track all metadata changes
- Show diff between versions
- Rollback to previous version
- Audit log with user and timestamp

#### FR-CMS-005: Bulk Operations
- Bulk genre assignment
- Bulk availability date updates
- Bulk tier changes (Free ↔ Premium)
- Bulk archive/unarchive

#### FR-CMS-006: Analytics Dashboard
- Total views per content
- Average watch time
- Completion rate
- Geographic distribution
- Device breakdown (Web, Mobile, TV)
- Revenue attribution (AVOD vs SVOD)



### 3.6 Advertising (AVOD)

#### FR-AD-001: Ad Inventory Management
- Upload video ads (MP4, 15s/30s/60s)
- Ad metadata: Advertiser, campaign, category
- Targeting rules: Genre, age group, geography
- Frequency capping per user
- Priority levels (Sponsored, Standard)

#### FR-AD-002: Ad Insertion
- Pre-roll: Before content starts
- Mid-roll: Every 15 minutes for content >30 min
- Post-roll: After content ends (optional)
- VAST/VMAP XML generation
- Ad pod management (multiple ads in sequence)

#### FR-AD-003: Ad Tracking
- Impression tracking (ad served)
- View tracking (ad watched >75%)
- Click-through tracking
- Skip tracking (if skippable)
- Error tracking (ad load failures)

#### FR-AD-004: Ad Experience
- Skip button after 5 seconds (skippable ads)
- Ad countdown timer
- "Ad X of Y" indicator
- Mute option during ads
- No seek during ads

---

## 4. Technical Architecture

### 4.1 Architecture Pattern
**Microservices Architecture** with the following principles:
- Service independence and autonomy
- Domain-driven design
- Event-driven communication
- Horizontal scalability
- Fault isolation and resilience

### 4.2 Technology Stack

#### Backend Services
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS 10+ (TypeScript)
- **API Gateway**: NestJS with rate limiting
- **Service Communication**: REST APIs + Redis Pub/Sub
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: class-validator, class-transformer

#### Frontend Applications
- **Web**: Next.js 14+ (App Router), React 18
- **Styling**: Tailwind CSS 3+, shadcn/ui components
- **State Management**: React Context + TanStack Query
- **Video Player**: Custom HTML5 player with HLS.js
- **Mobile**: React Native with Expo (Phase 2)

#### Data Layer
- **PostgreSQL 15+**: Content metadata, users, subscriptions, CMS
- **MongoDB 6+**: User activity, viewing history, recommendations
- **Redis 7+**: Session management, caching, real-time data

#### Video Processing
- **Local**: FFmpeg for HLS transcoding
- **Cloud**: AWS Elemental MediaConvert (Phase 2)
- **Storage**: Local filesystem (dev), S3 (production)
- **CDN**: CloudFront or Cloudflare (Phase 2)

#### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (Phase 2)
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston (structured JSON logs)
- **Tracing**: OpenTelemetry (Phase 2)

### 4.3 Microservices Breakdown

#### Service 1: API Gateway
- **Port**: 3000
- **Responsibilities**:
  - Request routing to downstream services
  - JWT validation and user context injection
  - Rate limiting (100 req/min per user)
  - Request/response logging with correlation IDs
  - CORS handling
  - API versioning (/api/v1/...)

#### Service 2: Auth Service
- **Port**: 3001
- **Database**: PostgreSQL
- **Responsibilities**:
  - User registration and login
  - JWT token generation and refresh
  - Multi-profile management
  - Password reset flow
  - Session management via Redis
  - OAuth integration (Phase 2)

#### Service 3: Catalog Service
- **Port**: 3002
- **Database**: PostgreSQL
- **Responsibilities**:
  - Content metadata CRUD
  - Genre and category management
  - Search and filtering
  - Content availability rules
  - Multi-language support
  - Trending calculation

#### Service 4: Streaming Service
- **Port**: 3003
- **Database**: Redis (caching), MongoDB (logs)
- **Responsibilities**:
  - HLS/DASH manifest generation
  - Adaptive bitrate logic
  - Playback position tracking
  - DRM token generation (Phase 2)
  - CDN URL signing

#### Service 5: User Activity Service
- **Port**: 3004
- **Database**: MongoDB
- **Responsibilities**:
  - Continue watching list
  - Watch history tracking
  - Engagement metrics collection
  - Watchlist management
  - Real-time activity ingestion

#### Service 6: Recommendation Service
- **Port**: 3005
- **Database**: MongoDB, PostgreSQL
- **Responsibilities**:
  - Personalized recommendations
  - Trending content calculation
  - Genre-based suggestions
  - Collaborative filtering
  - ML model integration hooks

#### Service 7: CMS Service
- **Port**: 3006
- **Database**: PostgreSQL
- **Responsibilities**:
  - Content upload and management
  - Workflow state management
  - Bulk operations
  - Version control
  - Asset management

#### Service 8: Subscription Service
- **Port**: 3007
- **Database**: PostgreSQL
- **Responsibilities**:
  - Subscription tier management
  - Payment processing integration
  - Subscription lifecycle
  - Access control validation
  - Invoice generation

#### Service 9: Ad Service
- **Port**: 3008
- **Database**: PostgreSQL, Redis
- **Responsibilities**:
  - Ad inventory management
  - VAST/VMAP generation
  - Ad impression tracking
  - Frequency capping
  - Targeting logic



---

## 5. Database Design

### 5.1 PostgreSQL Schema (Catalog Database)

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'free', -- free, premium
    subscription_expires_at TIMESTAMP,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);
```

#### Profiles Table
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    maturity_rating VARCHAR(10) DEFAULT 'U/A', -- U, U/A, A
    language_preference VARCHAR(10) DEFAULT 'en', -- en, hi
    is_kids_profile BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Content Table
```sql
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL, -- movie, tv_show, sports
    title VARCHAR(500) NOT NULL,
    title_hi VARCHAR(500), -- Hindi title
    description TEXT,
    description_hi TEXT,
    release_date DATE,
    duration_minutes INT,
    maturity_rating VARCHAR(10),
    poster_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    trailer_url VARCHAR(500),
    workflow_state VARCHAR(20) DEFAULT 'draft',
    tier_requirement VARCHAR(20) DEFAULT 'free',
    geo_restriction VARCHAR(10) DEFAULT 'IN',
    available_from TIMESTAMP,
    available_until TIMESTAMP,
    view_count BIGINT DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_workflow_state ON content(workflow_state);
CREATE INDEX idx_content_release_date ON content(release_date DESC);
CREATE INDEX idx_content_tier ON content(tier_requirement);
```

#### Seasons Table
```sql
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    season_number INT NOT NULL,
    title VARCHAR(255),
    title_hi VARCHAR(255),
    release_date DATE,
    UNIQUE(content_id, season_number)
);
```

#### Episodes Table
```sql
CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    description TEXT,
    description_hi TEXT,
    duration_minutes INT,
    thumbnail_url VARCHAR(500),
    air_date DATE,
    UNIQUE(season_id, episode_number)
);
```

#### Video Variants Table
```sql
CREATE TABLE video_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    quality VARCHAR(10) NOT NULL, -- 144p, 360p, 480p, 720p, 1080p
    hls_url VARCHAR(1000) NOT NULL,
    dash_url VARCHAR(1000),
    bitrate_kbps INT,
    file_size_mb DECIMAL(10,2),
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);

CREATE INDEX idx_video_variants_content ON video_variants(content_id);
CREATE INDEX idx_video_variants_episode ON video_variants(episode_id);
```

#### Audio Tracks Table
```sql
CREATE TABLE audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL, -- en, hi
    label VARCHAR(50),
    url VARCHAR(1000) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);
```

#### Subtitles Table
```sql
CREATE TABLE subtitles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    label VARCHAR(50),
    url VARCHAR(1000) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);
```

#### Genres Table
```sql
CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    name_hi VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_url VARCHAR(500)
);
```

#### Content Genres (Many-to-Many)
```sql
CREATE TABLE content_genres (
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, genre_id)
);
```

#### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(20) NOT NULL, -- monthly, quarterly, annual
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) NOT NULL, -- active, expired, cancelled
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Ads Table
```sql
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    advertiser VARCHAR(255),
    video_url VARCHAR(1000) NOT NULL,
    duration_seconds INT NOT NULL,
    click_url VARCHAR(1000),
    category VARCHAR(100),
    priority INT DEFAULT 1,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    max_impressions INT,
    current_impressions INT DEFAULT 0,
    target_genres TEXT[], -- Array of genre IDs
    target_age_min INT,
    target_age_max INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 5.2 MongoDB Schema (User Activity Database)

#### viewing_sessions Collection
```javascript
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  content_id: UUID,
  episode_id: UUID?, // For TV shows
  position_seconds: Number,
  duration_seconds: Number,
  completed_percentage: Number, // 0-100
  quality: String, // 144p, 360p, etc.
  device_type: String, // web, mobile, tv
  last_updated: ISODate,
  created_at: ISODate
}

// Indexes
db.viewing_sessions.createIndex({ user_id: 1, profile_id: 1 });
db.viewing_sessions.createIndex({ content_id: 1 });
db.viewing_sessions.createIndex({ last_updated: -1 });
```

#### watch_history Collection
```javascript
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  content_id: UUID,
  episode_id: UUID?,
  watched_at: ISODate,
  completion_rate: Number, // 0-100
  watch_duration_seconds: Number,
  quality_used: String,
  device_type: String
}

// Indexes
db.watch_history.createIndex({ user_id: 1, profile_id: 1, watched_at: -1 });
db.watch_history.createIndex({ content_id: 1, watched_at: -1 });
```

#### engagement_events Collection
```javascript
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  content_id: UUID,
  episode_id: UUID?,
  event_type: String, // play, pause, seek, rewind, abandon, complete, quality_change
  timestamp: ISODate,
  position_seconds: Number,
  metadata: {
    from_quality: String?,
    to_quality: String?,
    seek_from: Number?,
    seek_to: Number?
  }
}

// Indexes
db.engagement_events.createIndex({ content_id: 1, timestamp: -1 });
db.engagement_events.createIndex({ user_id: 1, timestamp: -1 });
```

#### user_preferences Collection
```javascript
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  favorite_genres: [String], // Genre IDs
  disliked_content: [UUID], // Content IDs
  watchlist: [UUID], // Content IDs
  preferred_quality: String, // auto, 720p, 1080p
  subtitle_preference: String, // off, en, hi
  updated_at: ISODate
}

// Indexes
db.user_preferences.createIndex({ user_id: 1, profile_id: 1 }, { unique: true });
```

#### recommendations_cache Collection
```javascript
{
  _id: ObjectId,
  user_id: UUID,
  profile_id: UUID,
  recommendations: [
    {
      content_id: UUID,
      score: Number,
      reason: String // "Based on your watch history", "Trending now"
    }
  ],
  generated_at: ISODate,
  expires_at: ISODate
}

// Indexes
db.recommendations_cache.createIndex({ user_id: 1, profile_id: 1 });
db.recommendations_cache.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
```

#### ad_impressions Collection
```javascript
{
  _id: ObjectId,
  ad_id: UUID,
  user_id: UUID,
  profile_id: UUID,
  content_id: UUID,
  impression_time: ISODate,
  view_duration_seconds: Number,
  completed: Boolean,
  clicked: Boolean,
  skipped: Boolean,
  device_type: String
}

// Indexes
db.ad_impressions.createIndex({ ad_id: 1, impression_time: -1 });
db.ad_impressions.createIndex({ user_id: 1, impression_time: -1 });
```

### 5.3 Redis Data Structures

#### Session Storage
```
Key: session:{user_id}:{token_id}
Value: JSON { user_id, email, subscription_tier, expires_at }
TTL: 7 days
```

#### Playback Position Cache
```
Key: playback:{user_id}:{profile_id}:{content_id}
Value: JSON { position_seconds, last_updated }
TTL: 30 days
```

#### API Rate Limiting
```
Key: ratelimit:{user_id}:{endpoint}
Value: Request count
TTL: 60 seconds
```

#### Trending Content Cache
```
Key: trending:global
Value: JSON [{ content_id, score, rank }]
TTL: 6 hours
```

#### Content Metadata Cache
```
Key: content:{content_id}
Value: JSON { full content metadata }
TTL: 24 hours
```



---

## 6. API Specifications

### 6.1 Authentication APIs

#### POST /api/v1/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "language": "en"
}
```

**Response (201):**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "subscription_tier": "free",
  "access_token": "jwt_token",
  "refresh_token": "refresh_jwt_token"
}
```

#### POST /api/v1/auth/login
Authenticate user and get tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "subscription_tier": "premium",
  "access_token": "jwt_token",
  "refresh_token": "refresh_jwt_token"
}
```

#### POST /api/v1/auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "refresh_jwt_token"
}
```

**Response (200):**
```json
{
  "access_token": "new_jwt_token",
  "refresh_token": "new_refresh_jwt_token"
}
```

#### GET /api/v1/auth/profiles
Get all profiles for authenticated user.

**Headers:** `Authorization: Bearer {access_token}`

**Response (200):**
```json
{
  "profiles": [
    {
      "id": "uuid",
      "name": "John",
      "avatar_url": "https://...",
      "maturity_rating": "A",
      "language_preference": "en",
      "is_kids_profile": false
    }
  ]
}
```

#### POST /api/v1/auth/profiles
Create a new profile.

**Request:**
```json
{
  "name": "Kids",
  "avatar_url": "https://...",
  "maturity_rating": "U",
  "is_kids_profile": true
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Kids",
  "avatar_url": "https://...",
  "maturity_rating": "U",
  "is_kids_profile": true
}
```

### 6.2 Catalog APIs

#### GET /api/v1/catalog/content
List content with filters and pagination.

**Query Parameters:**
- `type`: movie | tv_show | sports
- `genre`: Genre slug
- `language`: en | hi
- `tier`: free | premium
- `sort`: trending | recent | a-z | release_date
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response (200):**
```json
{
  "content": [
    {
      "id": "uuid",
      "type": "movie",
      "title": "Big Buck Bunny",
      "title_hi": "बिग बक बनी",
      "description": "A large rabbit...",
      "release_date": "2008-04-10",
      "duration_minutes": 10,
      "maturity_rating": "U",
      "poster_url": "https://...",
      "thumbnail_url": "https://...",
      "genres": ["Animation", "Comedy"],
      "tier_requirement": "free",
      "view_count": 15420
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

#### GET /api/v1/catalog/content/:id
Get detailed content information.

**Response (200):**
```json
{
  "id": "uuid",
  "type": "tv_show",
  "title": "Demo Series",
  "title_hi": "डेमो सीरीज",
  "description": "An exciting series...",
  "release_date": "2024-01-01",
  "maturity_rating": "U/A",
  "poster_url": "https://...",
  "thumbnail_url": "https://...",
  "trailer_url": "https://...",
  "genres": ["Drama", "Thriller"],
  "tier_requirement": "premium",
  "seasons": [
    {
      "id": "uuid",
      "season_number": 1,
      "title": "Season 1",
      "episode_count": 10,
      "release_date": "2024-01-01"
    }
  ],
  "cast": ["Actor 1", "Actor 2"],
  "director": "Director Name",
  "view_count": 8500,
  "average_rating": 4.5
}
```

#### GET /api/v1/catalog/search
Search content by title, cast, or genre.

**Query Parameters:**
- `q`: Search query (required)
- `type`: Filter by content type
- `limit`: Results limit (default: 20)

**Response (200):**
```json
{
  "results": [
    {
      "id": "uuid",
      "type": "movie",
      "title": "Big Buck Bunny",
      "poster_url": "https://...",
      "release_date": "2008-04-10",
      "match_score": 0.95
    }
  ],
  "total": 5
}
```

#### GET /api/v1/catalog/genres
Get all available genres.

**Response (200):**
```json
{
  "genres": [
    {
      "id": "uuid",
      "name": "Action",
      "name_hi": "एक्शन",
      "slug": "action",
      "icon_url": "https://...",
      "content_count": 120
    }
  ]
}
```

#### GET /api/v1/catalog/trending
Get trending content.

**Query Parameters:**
- `period`: 24h | 7d | 30d (default: 7d)
- `limit`: Number of items (default: 20)

**Response (200):**
```json
{
  "trending": [
    {
      "id": "uuid",
      "title": "Trending Movie",
      "poster_url": "https://...",
      "view_count": 25000,
      "trend_score": 0.92,
      "rank": 1
    }
  ]
}
```

### 6.3 Streaming APIs

#### GET /api/v1/stream/:contentId/manifest
Get HLS/DASH manifest for content.

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `profile_id`: Profile UUID (required)
- `episode_id`: Episode UUID (for TV shows)
- `format`: hls | dash (default: hls)

**Response (200):**
```json
{
  "manifest_url": "https://cdn.example.com/content/uuid/master.m3u8",
  "qualities": [
    {
      "quality": "1080p",
      "bitrate_kbps": 5000,
      "url": "https://cdn.example.com/content/uuid/1080p.m3u8"
    },
    {
      "quality": "720p",
      "bitrate_kbps": 2500,
      "url": "https://cdn.example.com/content/uuid/720p.m3u8"
    }
  ],
  "audio_tracks": [
    {
      "language": "en",
      "label": "English",
      "url": "https://...",
      "is_default": true
    },
    {
      "language": "hi",
      "label": "हिन्दी",
      "url": "https://..."
    }
  ],
  "subtitles": [
    {
      "language": "en",
      "label": "English",
      "url": "https://..."
    }
  ],
  "session_id": "uuid",
  "expires_at": "2024-01-01T12:00:00Z"
}
```

#### POST /api/v1/stream/playback/start
Initialize playback session.

**Request:**
```json
{
  "profile_id": "uuid",
  "content_id": "uuid",
  "episode_id": "uuid",
  "device_type": "web"
}
```

**Response (200):**
```json
{
  "session_id": "uuid",
  "resume_position": 120,
  "ads": [
    {
      "type": "pre-roll",
      "url": "https://...",
      "duration": 30,
      "skip_after": 5
    }
  ]
}
```

#### PUT /api/v1/stream/playback/position
Update playback position.

**Request:**
```json
{
  "session_id": "uuid",
  "profile_id": "uuid",
  "content_id": "uuid",
  "episode_id": "uuid",
  "position_seconds": 245,
  "duration_seconds": 600,
  "quality": "720p"
}
```

**Response (200):**
```json
{
  "success": true,
  "completed_percentage": 40.8
}
```

#### POST /api/v1/stream/playback/complete
Mark content as completed.

**Request:**
```json
{
  "session_id": "uuid",
  "profile_id": "uuid",
  "content_id": "uuid",
  "episode_id": "uuid",
  "watch_duration_seconds": 580,
  "completion_rate": 96.7
}
```

**Response (200):**
```json
{
  "success": true,
  "next_episode": {
    "id": "uuid",
    "title": "Episode 2",
    "thumbnail_url": "https://..."
  }
}
```

### 6.4 User Activity APIs

#### GET /api/v1/activity/continue-watching
Get continue watching list for profile.

**Query Parameters:**
- `profile_id`: Profile UUID (required)
- `limit`: Number of items (default: 20)

**Response (200):**
```json
{
  "items": [
    {
      "content_id": "uuid",
      "episode_id": "uuid",
      "title": "Movie Title",
      "episode_title": "Episode 1",
      "thumbnail_url": "https://...",
      "position_seconds": 450,
      "duration_seconds": 3600,
      "progress_percentage": 12.5,
      "last_watched": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/v1/activity/history
Get watch history for profile.

**Query Parameters:**
- `profile_id`: Profile UUID (required)
- `page`: Page number
- `limit`: Items per page

**Response (200):**
```json
{
  "history": [
    {
      "content_id": "uuid",
      "title": "Movie Title",
      "thumbnail_url": "https://...",
      "watched_at": "2024-01-14T20:00:00Z",
      "completion_rate": 100,
      "watch_duration_seconds": 3600
    }
  ],
  "pagination": {
    "page": 1,
    "total": 50
  }
}
```

#### POST /api/v1/activity/watchlist
Add content to watchlist.

**Request:**
```json
{
  "profile_id": "uuid",
  "content_id": "uuid"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Added to watchlist"
}
```

#### DELETE /api/v1/activity/watchlist/:contentId
Remove content from watchlist.

**Query Parameters:**
- `profile_id`: Profile UUID (required)

**Response (200):**
```json
{
  "success": true,
  "message": "Removed from watchlist"
}
```

#### GET /api/v1/activity/watchlist
Get watchlist for profile.

**Query Parameters:**
- `profile_id`: Profile UUID (required)

**Response (200):**
```json
{
  "watchlist": [
    {
      "content_id": "uuid",
      "title": "Movie Title",
      "poster_url": "https://...",
      "added_at": "2024-01-10T15:00:00Z"
    }
  ]
}
```

### 6.5 Recommendation APIs

#### GET /api/v1/recommendations/personalized
Get personalized recommendations for profile.

**Query Parameters:**
- `profile_id`: Profile UUID (required)
- `limit`: Number of recommendations (default: 20)

**Response (200):**
```json
{
  "recommendations": [
    {
      "content_id": "uuid",
      "title": "Recommended Movie",
      "poster_url": "https://...",
      "score": 0.89,
      "reason": "Based on your watch history"
    }
  ]
}
```

#### GET /api/v1/recommendations/similar/:contentId
Get similar content recommendations.

**Query Parameters:**
- `limit`: Number of items (default: 10)

**Response (200):**
```json
{
  "similar": [
    {
      "content_id": "uuid",
      "title": "Similar Movie",
      "poster_url": "https://...",
      "similarity_score": 0.85
    }
  ]
}
```

### 6.6 CMS APIs (Admin Only)

#### POST /api/v1/cms/content
Create new content (draft state).

**Request:**
```json
{
  "type": "movie",
  "title": "New Movie",
  "title_hi": "नई फिल्म",
  "description": "Description...",
  "release_date": "2024-06-01",
  "duration_minutes": 120,
  "maturity_rating": "U/A",
  "tier_requirement": "premium",
  "genres": ["uuid1", "uuid2"]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "workflow_state": "draft",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### PUT /api/v1/cms/content/:id
Update content metadata.

**Request:** (Same as POST, partial updates allowed)

**Response (200):**
```json
{
  "id": "uuid",
  "updated_at": "2024-01-15T11:00:00Z",
  "version": 2
}
```

#### POST /api/v1/cms/content/:id/submit-review
Submit content for review.

**Response (200):**
```json
{
  "id": "uuid",
  "workflow_state": "pending_review",
  "submitted_at": "2024-01-15T12:00:00Z"
}
```

#### POST /api/v1/cms/content/:id/approve
Approve content (reviewer role).

**Request:**
```json
{
  "comments": "Approved for publishing"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "workflow_state": "approved",
  "approved_at": "2024-01-15T13:00:00Z"
}
```

#### POST /api/v1/cms/content/:id/publish
Publish content to platform.

**Request:**
```json
{
  "publish_at": "2024-01-20T00:00:00Z"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "workflow_state": "published",
  "published_at": "2024-01-20T00:00:00Z"
}
```



---

## 7. Non-Functional Requirements

### 7.1 Performance Requirements

#### NFR-PERF-001: API Response Time
- **Target**: p95 < 200ms for all API endpoints
- **Critical**: p99 < 500ms
- **Measurement**: Prometheus metrics with Grafana dashboards
- **Actions**: Database query optimization, Redis caching, connection pooling

#### NFR-PERF-002: Video Stream Start Time
- **Target**: < 2 seconds from play button to first frame
- **Optimization Strategies**:
  - Preload first HLS segment on content page
  - CDN edge caching for popular content
  - Adaptive bitrate starting at lower quality
  - HTTP/2 for manifest requests

#### NFR-PERF-003: Adaptive Bitrate Switching
- **Target**: < 500ms transition between qualities
- **Implementation**: Seamless switching without playback interruption
- **Buffer Management**: Maintain 10-30 second buffer

#### NFR-PERF-004: Database Query Performance
- **Target**: All queries < 100ms
- **Strategies**:
  - Proper indexing on all foreign keys and filter columns
  - Query optimization with EXPLAIN ANALYZE
  - Read replicas for heavy read operations
  - Connection pooling (max 20 connections per service)

#### NFR-PERF-005: Concurrent Users
- **Phase 1**: Support 10,000 concurrent users
- **Phase 2**: Support 100,000 concurrent users
- **Phase 3**: Support 1M+ concurrent users
- **Scaling Strategy**: Horizontal pod autoscaling based on CPU/memory

### 7.2 Scalability Requirements

#### NFR-SCALE-001: Horizontal Scalability
- All microservices must be stateless
- No local file system dependencies (use S3/object storage)
- Database connection pooling with configurable limits
- Redis for distributed caching and session management

#### NFR-SCALE-002: Database Scalability
- PostgreSQL: Master-slave replication with read replicas
- MongoDB: Replica set with 3 nodes minimum
- Redis: Cluster mode with 3 master nodes
- Sharding strategy for user activity data (by user_id)

#### NFR-SCALE-003: Auto-Scaling Rules
- **CPU Threshold**: Scale up at 70% CPU utilization
- **Memory Threshold**: Scale up at 80% memory utilization
- **Request Rate**: Scale up at 1000 req/sec per pod
- **Scale Down**: After 10 minutes below 40% utilization
- **Min Replicas**: 2 per service (high availability)
- **Max Replicas**: 20 per service

#### NFR-SCALE-004: CDN Integration
- CloudFront or Cloudflare for video delivery
- Edge caching with 24-hour TTL for video segments
- Origin shield to reduce origin load
- Geographic distribution across Indian regions

### 7.3 Reliability Requirements

#### NFR-REL-001: Service Availability
- **Target**: 99.9% uptime (43 minutes downtime/month)
- **Measurement**: Uptime monitoring with PagerDuty alerts
- **Strategy**: Multi-AZ deployment, health checks, auto-recovery

#### NFR-REL-002: Circuit Breaker Pattern
- Implement circuit breakers for all service-to-service calls
- **Thresholds**:
  - Open circuit after 5 consecutive failures
  - Half-open after 30 seconds
  - Close after 3 successful requests
- **Fallback**: Return cached data or graceful degradation

#### NFR-REL-003: Graceful Degradation
- Recommendations fail → Show trending content
- Search fail → Show popular categories
- Personalization fail → Show generic homepage
- Ad service fail → Skip ads (don't block playback)

#### NFR-REL-004: Database Backup
- PostgreSQL: Daily full backup + continuous WAL archiving
- MongoDB: Daily snapshot backup
- Retention: 30 days
- Recovery Time Objective (RTO): < 1 hour
- Recovery Point Objective (RPO): < 15 minutes

#### NFR-REL-005: Retry Logic
- Exponential backoff for failed requests
- Max 3 retry attempts
- Idempotency keys for write operations
- Timeout: 5 seconds for API calls, 30 seconds for video operations

### 7.4 Security Requirements

#### NFR-SEC-001: Authentication & Authorization
- JWT tokens with RS256 signing algorithm
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Token rotation on refresh
- Secure token storage (httpOnly cookies for web)

#### NFR-SEC-002: Password Security
- bcrypt hashing with cost factor 12
- Minimum password requirements:
  - 8 characters minimum
  - 1 uppercase letter
  - 1 lowercase letter
  - 1 number
  - 1 special character
- Password reset with time-limited tokens (1 hour expiry)
- Account lockout after 5 failed login attempts (15-minute lockout)

#### NFR-SEC-003: API Security
- Rate limiting: 100 requests/minute per user
- CORS: Whitelist specific origins
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy headers)
- HTTPS only in production (TLS 1.3)

#### NFR-SEC-004: Data Encryption
- Data at rest: AES-256 encryption for sensitive data
- Data in transit: TLS 1.3 for all API communication
- Database encryption: PostgreSQL pgcrypto, MongoDB encryption at rest
- Secrets management: AWS Secrets Manager or HashiCorp Vault

#### NFR-SEC-005: DRM & Content Protection
- **Phase 1**: URL signing with expiring tokens
- **Phase 2**: Widevine DRM for premium content
- **Phase 3**: Multi-DRM (Widevine, FairPlay, PlayReady)
- Watermarking for piracy tracking

#### NFR-SEC-006: Compliance
- GDPR compliance for user data
- Data retention policies (user data deleted after 90 days of account deletion)
- Right to be forgotten implementation
- Audit logs for all data access
- PCI DSS compliance for payment processing

### 7.5 Observability Requirements

#### NFR-OBS-001: Logging
- Structured JSON logging with Winston
- Log levels: ERROR, WARN, INFO, DEBUG
- Correlation IDs for request tracing
- Log aggregation with ELK stack or CloudWatch
- Retention: 30 days

#### NFR-OBS-002: Metrics
- Prometheus for metrics collection
- Grafana for visualization
- Key metrics:
  - Request rate, latency, error rate (RED metrics)
  - CPU, memory, disk usage (USE metrics)
  - Business metrics (signups, subscriptions, watch time)
- Alert thresholds configured in Prometheus Alertmanager

#### NFR-OBS-003: Distributed Tracing
- OpenTelemetry for trace collection
- Jaeger or Zipkin for trace visualization
- Trace sampling: 10% in production, 100% in staging
- Trace retention: 7 days

#### NFR-OBS-004: Health Checks
- Liveness probe: Service is running
- Readiness probe: Service can accept traffic
- Health check endpoints: `/health` and `/ready`
- Check frequency: Every 10 seconds
- Failure threshold: 3 consecutive failures

#### NFR-OBS-005: Alerting
- PagerDuty or Opsgenie for incident management
- Alert severity levels: Critical, High, Medium, Low
- Critical alerts:
  - Service down (all replicas unhealthy)
  - Database connection failures
  - Error rate > 5%
  - p95 latency > 1 second
- On-call rotation with escalation policies

### 7.6 Usability Requirements

#### NFR-USE-001: Web Performance
- Lighthouse score > 90
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.5s

#### NFR-USE-002: Mobile Responsiveness
- Support screen sizes from 320px to 2560px
- Touch-friendly UI (min 44x44px tap targets)
- Optimized for portrait and landscape orientations
- Progressive Web App (PWA) capabilities

#### NFR-USE-003: Accessibility
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1 for text)
- Closed captions for all video content

#### NFR-USE-004: Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers: Chrome Mobile, Safari iOS

#### NFR-USE-005: Internationalization
- Support for English and Hindi languages
- RTL layout support (future: Arabic, Urdu)
- Date/time formatting per locale
- Currency formatting (INR)
- Number formatting per locale

### 7.7 Maintainability Requirements

#### NFR-MAIN-001: Code Quality
- TypeScript strict mode enabled
- ESLint with Airbnb style guide
- Prettier for code formatting
- Unit test coverage > 80%
- Integration test coverage > 60%

#### NFR-MAIN-002: Documentation
- API documentation with OpenAPI/Swagger
- Architecture decision records (ADRs)
- Runbook for common operations
- Onboarding guide for new developers
- Inline code comments for complex logic

#### NFR-MAIN-003: CI/CD Pipeline
- Automated testing on every commit
- Code quality checks (linting, formatting)
- Security scanning (npm audit, Snyk)
- Docker image building and pushing
- Automated deployment to staging
- Manual approval for production deployment

#### NFR-MAIN-004: Monitoring & Debugging
- Centralized logging for troubleshooting
- Distributed tracing for request flows
- Database query logging for slow queries
- Error tracking with Sentry or Rollbar
- Feature flags for gradual rollouts



---

## 8. Security & Compliance

### 8.1 Authentication Flow

#### User Registration Flow
1. User submits email and password
2. Validate email format and password strength
3. Check if email already exists
4. Hash password with bcrypt (cost factor 12)
5. Create user record in database
6. Send verification email with token
7. User clicks verification link
8. Mark email as verified
9. Generate JWT access and refresh tokens
10. Return tokens to client

#### User Login Flow
1. User submits email and password
2. Retrieve user record by email
3. Compare password hash with bcrypt
4. Check account status (active, locked, suspended)
5. Generate new JWT access and refresh tokens
6. Store refresh token in Redis with 7-day TTL
7. Update last_login_at timestamp
8. Return tokens to client

#### Token Refresh Flow
1. Client sends refresh token
2. Validate refresh token signature
3. Check if token exists in Redis (not revoked)
4. Verify token expiry
5. Generate new access and refresh tokens
6. Invalidate old refresh token in Redis
7. Store new refresh token in Redis
8. Return new tokens to client

#### Logout Flow
1. Client sends access token
2. Extract user_id and token_id from JWT
3. Delete refresh token from Redis
4. Add access token to blacklist (until expiry)
5. Return success response

### 8.2 Authorization Model

#### Role-Based Access Control (RBAC)
- **User**: Standard user with subscription
- **Admin**: Content management and user management
- **Content Creator**: Can create and edit content (draft state)
- **Content Reviewer**: Can approve/reject content
- **Content Publisher**: Can publish approved content
- **Analyst**: Read-only access to analytics

#### Permission Matrix
| Resource | User | Creator | Reviewer | Publisher | Admin |
|----------|------|---------|----------|-----------|-------|
| View Content | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create Content | ✗ | ✓ | ✗ | ✗ | ✓ |
| Edit Content | ✗ | ✓ (own) | ✗ | ✗ | ✓ |
| Review Content | ✗ | ✗ | ✓ | ✗ | ✓ |
| Publish Content | ✗ | ✗ | ✗ | ✓ | ✓ |
| View Analytics | ✗ | ✗ | ✗ | ✗ | ✓ |
| Manage Users | ✗ | ✗ | ✗ | ✗ | ✓ |

### 8.3 Data Privacy

#### Personal Data Handling
- **Collected Data**:
  - Email address (required)
  - Password hash (required)
  - Profile names (required)
  - Watch history (automatic)
  - Payment information (via payment gateway, not stored)
  - Device information (IP, user agent)

- **Data Usage**:
  - Authentication and authorization
  - Personalized recommendations
  - Analytics and reporting
  - Customer support
  - Legal compliance

- **Data Retention**:
  - Active accounts: Indefinite
  - Deleted accounts: 90 days (for recovery)
  - Watch history: 2 years
  - Logs: 30 days
  - Backups: 30 days

#### GDPR Compliance
- **Right to Access**: API endpoint to export user data
- **Right to Rectification**: User can update profile information
- **Right to Erasure**: Account deletion with 90-day grace period
- **Right to Data Portability**: Export watch history and preferences
- **Right to Object**: Opt-out of personalized recommendations
- **Privacy Policy**: Clear disclosure of data collection and usage
- **Cookie Consent**: Banner for cookie acceptance

#### Data Anonymization
- Analytics data anonymized after 90 days
- IP addresses hashed for geographic analysis
- User IDs pseudonymized in logs
- No PII in error messages or logs

### 8.4 Payment Security

#### PCI DSS Compliance
- Use payment gateway (Razorpay, Stripe) for card processing
- Never store card numbers or CVV
- Store only tokenized payment methods
- Secure transmission with TLS 1.3
- Regular security audits

#### Payment Flow
1. User selects subscription plan
2. Redirect to payment gateway (Razorpay)
3. User completes payment on gateway
4. Gateway sends webhook to our server
5. Verify webhook signature
6. Update subscription status in database
7. Send confirmation email to user
8. Grant premium access

### 8.5 Content Security

#### Video URL Signing
```javascript
// Generate signed URL with expiry
const signedUrl = generateSignedUrl({
  contentId: 'uuid',
  userId: 'uuid',
  expiresIn: 3600, // 1 hour
  quality: '720p'
});

// URL format: https://cdn.example.com/video/uuid/720p.m3u8?token=xyz&expires=timestamp
```

#### DRM Implementation (Phase 2)
- **Widevine**: Android, Chrome, Firefox
- **FairPlay**: iOS, Safari
- **PlayReady**: Windows, Edge
- License server integration
- Key rotation every 24 hours

#### Watermarking (Phase 3)
- Forensic watermarking for piracy tracking
- User ID embedded in video stream
- Invisible to viewers
- Detectable in pirated copies

### 8.6 API Security Best Practices

#### Input Validation
```typescript
// Example: Content creation validation
class CreateContentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title: string;

  @IsEnum(['movie', 'tv_show', 'sports'])
  type: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  duration_minutes?: number;

  @IsArray()
  @IsUUID('4', { each: true })
  genres: string[];
}
```

#### Rate Limiting Strategy
```typescript
// Rate limit configuration
const rateLimits = {
  '/api/v1/auth/login': { max: 5, window: '15m' },
  '/api/v1/auth/register': { max: 3, window: '1h' },
  '/api/v1/catalog/*': { max: 100, window: '1m' },
  '/api/v1/stream/*': { max: 50, window: '1m' },
  '/api/v1/cms/*': { max: 200, window: '1m' }
};
```

#### CORS Configuration
```typescript
// CORS settings
const corsOptions = {
  origin: [
    'https://ottplatform.com',
    'https://www.ottplatform.com',
    'https://admin.ottplatform.com'
  ],
  credentials: true,
  maxAge: 86400 // 24 hours
};
```

#### Security Headers
```typescript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.ottplatform.com'],
      mediaSrc: ["'self'", 'https://cdn.ottplatform.com']
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

## 9. Deployment Architecture

### 9.1 Local Development Environment

#### Docker Compose Setup
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ott_catalog
      POSTGRES_USER: ott_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - mongodb
      - redis
    environment:
      - NODE_ENV=development

volumes:
  postgres_data:
  mongodb_data:
  redis_data:
```

#### Development Workflow
1. Clone repository
2. Install dependencies: `npm install`
3. Start infrastructure: `docker-compose up -d`
4. Run migrations: `npm run migrate`
5. Seed test data: `npm run seed`
6. Start services: `npm run dev`
7. Access frontend: http://localhost:3000

### 9.2 Cloud Architecture (AWS)

#### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         CloudFront CDN                       │
│                    (Video Delivery + Static)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Load Balancer                 │
│                         (Multi-AZ)                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      EKS Cluster (Kubernetes)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ API Gateway  │  │ Auth Service │  │Catalog Service│      │
│  │   (3 pods)   │  │   (2 pods)   │  │   (3 pods)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Streaming   │  │User Activity │  │Recommendation│      │
│  │   (3 pods)   │  │   (2 pods)   │  │   (2 pods)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  RDS (PG)    │  │  DocumentDB  │  │ ElastiCache  │      │
│  │  Multi-AZ    │  │  (MongoDB)   │  │   (Redis)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Storage & Processing                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  S3 Bucket   │  │MediaConvert  │  │  CloudWatch  │      │
│  │ (Videos)     │  │(Transcoding) │  │  (Logs)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### AWS Services Breakdown

**Compute:**
- EKS (Elastic Kubernetes Service) for container orchestration
- EC2 instances: t3.medium for worker nodes
- Auto Scaling Groups with min 3, max 20 nodes

**Database:**
- RDS PostgreSQL 15 (db.r6g.xlarge, Multi-AZ)
- DocumentDB (MongoDB-compatible, 3-node replica set)
- ElastiCache Redis (cache.r6g.large, cluster mode)

**Storage:**
- S3 Standard for video files
- S3 Intelligent-Tiering for older content
- CloudFront for CDN delivery

**Networking:**
- VPC with public and private subnets across 3 AZs
- Application Load Balancer in public subnets
- NAT Gateway for outbound traffic from private subnets
- Security Groups for network isolation

**Monitoring:**
- CloudWatch for logs and metrics
- X-Ray for distributed tracing
- SNS for alerting
- CloudWatch Dashboards for visualization

### 9.3 Kubernetes Configuration

#### Deployment Example (API Gateway)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: ott-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: ottplatform/api-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: POSTGRES_HOST
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: postgres-host
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-gateway
  namespace: ott-platform
spec:
  selector:
    app: api-gateway
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: ott-platform
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 9.4 CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - run: docker build -t ottplatform/api-gateway:${{ github.sha }} .
      - run: docker push ottplatform/api-gateway:${{ github.sha }}

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      - run: kubectl set image deployment/api-gateway api-gateway=ottplatform/api-gateway:${{ github.sha }}

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: aws-actions/configure-aws-credentials@v2
      - run: kubectl set image deployment/api-gateway api-gateway=ottplatform/api-gateway:${{ github.sha }}
```

### 9.5 Cost Estimation (AWS - Phase 2)

#### Monthly Cost Breakdown (10,000 concurrent users)
- **EKS Cluster**: $150 (control plane + worker nodes)
- **RDS PostgreSQL**: $300 (db.r6g.xlarge Multi-AZ)
- **DocumentDB**: $400 (3-node replica set)
- **ElastiCache Redis**: $200 (cache.r6g.large cluster)
- **S3 Storage**: $500 (10TB video content)
- **CloudFront**: $800 (100TB data transfer)
- **MediaConvert**: $1,000 (transcoding hours)
- **Data Transfer**: $300
- **CloudWatch**: $100

**Total Estimated Cost**: ~$3,750/month

#### Cost Optimization Strategies
- Use S3 Intelligent-Tiering for older content
- Reserved Instances for predictable workloads (30-40% savings)
- Spot Instances for non-critical workloads
- CloudFront caching to reduce origin requests
- Compress video files with efficient codecs (H.265)



---

## 10. Implementation Roadmap

### 10.1 Phase 1: MVP (Months 1-3)

#### Month 1: Foundation
**Week 1-2: Infrastructure Setup**
- Set up monorepo structure with Nx or Turborepo
- Configure Docker Compose for local development
- Set up PostgreSQL, MongoDB, Redis containers
- Create database schemas and migrations
- Set up CI/CD pipeline with GitHub Actions

**Week 3-4: Core Services**
- Implement Auth Service (registration, login, JWT)
- Implement API Gateway (routing, rate limiting)
- Implement Catalog Service (content CRUD, search)
- Set up service-to-service communication
- Write unit tests for core functionality

#### Month 2: Content & Streaming
**Week 5-6: Content Management**
- Implement CMS Service (content upload, workflow)
- Create admin dashboard UI (React + Tailwind)
- Implement video upload and FFmpeg transcoding
- Set up HLS manifest generation
- Seed database with test content

**Week 7-8: Video Playback**
- Implement Streaming Service (manifest delivery)
- Build custom video player with HLS.js
- Implement adaptive bitrate switching
- Add player controls (play, pause, seek, volume)
- Implement playback position tracking

#### Month 3: Personalization & Polish
**Week 9-10: User Features**
- Implement User Activity Service
- Build continue watching functionality
- Create watch history tracking
- Implement basic recommendations (genre-based)
- Add watchlist feature

**Week 11-12: Frontend & Testing**
- Build modern streaming platform homepage with trays
- Implement content detail pages
- Add search functionality
- Comprehensive testing (unit, integration, e2e)
- Performance optimization
- Documentation and deployment guides

**MVP Deliverables:**
- ✅ User authentication with multi-profile support
- ✅ Content catalog with Movies and TV Shows
- ✅ Video player with adaptive streaming
- ✅ Continue watching and watch history
- ✅ Basic genre-based recommendations
- ✅ Admin CMS for content management
- ✅ Responsive web interface

### 10.2 Phase 2: Scale & Monetization (Months 4-6)

#### Month 4: Advanced Personalization
- Implement collaborative filtering algorithm
- Build user similarity matrix computation
- Create ML model integration hooks
- Implement trending content calculation
- Add A/B testing framework for recommendations

#### Month 5: Monetization
- Implement Subscription Service
- Integrate payment gateway (Razorpay/Stripe)
- Build subscription management UI
- Implement Ad Service for AVOD
- Add VAST/VMAP ad insertion
- Create ad impression tracking

#### Month 6: Mobile & Analytics
- Build React Native mobile apps (iOS/Android)
- Implement offline download capability
- Create analytics dashboard for admins
- Add real-time engagement metrics
- Implement user behavior tracking
- Set up Prometheus + Grafana monitoring

**Phase 2 Deliverables:**
- ✅ ML-based personalized recommendations
- ✅ Payment integration and subscription management
- ✅ Ad-supported free tier (AVOD)
- ✅ Mobile apps for iOS and Android
- ✅ Analytics dashboard for content performance
- ✅ Advanced monitoring and observability

### 10.3 Phase 3: Enterprise Scale (Months 7-12)

#### Months 7-8: Cloud Migration
- Migrate to AWS EKS (Kubernetes)
- Set up RDS, DocumentDB, ElastiCache
- Configure CloudFront CDN
- Implement AWS Elemental MediaConvert
- Set up multi-region deployment
- Implement disaster recovery

#### Months 9-10: Advanced Features
- Implement live streaming for sports
- Add social features (sharing, comments)
- Build recommendation engine v2 (deep learning)
- Implement multi-language expansion (5+ languages)
- Add parental controls and content filtering
- Implement DRM (Widevine, FairPlay)

#### Months 11-12: Optimization & Scale
- Performance optimization for 1M+ users
- Database sharding and optimization
- Advanced caching strategies
- Security hardening and penetration testing
- Compliance audits (GDPR, PCI DSS)
- Load testing and capacity planning

**Phase 3 Deliverables:**
- ✅ Cloud-native deployment on AWS
- ✅ CDN integration for global delivery
- ✅ Live streaming capability
- ✅ Social features and community
- ✅ Multi-language support (10+ languages)
- ✅ Enterprise-grade security and compliance
- ✅ Support for 1M+ concurrent users

### 10.4 Success Metrics & KPIs

#### User Acquisition Metrics
- **Target**: 1M registered users by end of Phase 2
- **Measurement**: Daily/weekly/monthly active users (DAU/WAU/MAU)
- **Conversion**: 15% free-to-premium conversion rate

#### Engagement Metrics
- **Watch Time**: 45+ minutes average daily watch time
- **Completion Rate**: 70%+ for movies, 80%+ for episodes
- **Return Rate**: 60%+ users return within 7 days
- **Session Duration**: 60+ minutes average session

#### Technical Metrics
- **Availability**: 99.9% uptime
- **Performance**: p95 API latency < 200ms
- **Stream Start**: < 2 seconds to first frame
- **Error Rate**: < 0.5% of requests
- **Buffering Ratio**: < 0.5% of playback time

#### Business Metrics
- **Revenue**: ₹10M ARR by end of Phase 2
- **ARPU**: ₹150/month average revenue per user
- **Churn Rate**: < 5% monthly churn
- **CAC**: < ₹500 customer acquisition cost
- **LTV**: > ₹3,000 lifetime value

### 10.5 Risk Mitigation

#### Technical Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database performance bottleneck | High | Medium | Read replicas, caching, query optimization |
| Video streaming quality issues | High | Medium | Adaptive bitrate, CDN, multiple qualities |
| Service downtime | High | Low | Multi-AZ deployment, circuit breakers |
| Security breach | Critical | Low | Regular audits, penetration testing, encryption |
| Scalability limits | High | Medium | Horizontal scaling, load testing, monitoring |

#### Business Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | Critical | Medium | Marketing campaigns, free tier, referrals |
| High content costs | High | High | Revenue sharing, user-generated content |
| Competition from major platforms | High | High | India-first features, local content, pricing |
| Payment gateway issues | Medium | Low | Multiple payment options, backup gateway |
| Regulatory compliance | High | Medium | Legal consultation, compliance audits |

### 10.6 Team Structure

#### Phase 1 Team (MVP)
- **Backend Engineers**: 3 (microservices, APIs)
- **Frontend Engineers**: 2 (web UI, video player)
- **DevOps Engineer**: 1 (infrastructure, CI/CD)
- **QA Engineer**: 1 (testing, automation)
- **Product Manager**: 1 (requirements, roadmap)
- **UI/UX Designer**: 1 (design, prototypes)

**Total**: 9 people

#### Phase 2 Team (Scale)
- Add: 2 Backend Engineers
- Add: 2 Mobile Engineers (iOS/Android)
- Add: 1 ML Engineer (recommendations)
- Add: 1 Data Analyst (analytics)
- Add: 1 QA Engineer

**Total**: 16 people

#### Phase 3 Team (Enterprise)
- Add: 2 Backend Engineers
- Add: 1 Security Engineer
- Add: 1 SRE (Site Reliability)
- Add: 1 Data Engineer (pipelines)
- Add: 1 Content Operations Manager

**Total**: 22 people

---

## 11. Appendix

### 11.1 Glossary

- **AVOD**: Ad-supported Video On Demand
- **SVOD**: Subscription Video On Demand
- **HLS**: HTTP Live Streaming (Apple's streaming protocol)
- **DASH**: Dynamic Adaptive Streaming over HTTP
- **CDN**: Content Delivery Network
- **DRM**: Digital Rights Management
- **JWT**: JSON Web Token
- **RBAC**: Role-Based Access Control
- **OTT**: Over-The-Top (streaming over internet)
- **ABR**: Adaptive Bitrate Streaming
- **VAST**: Video Ad Serving Template
- **VMAP**: Video Multiple Ad Playlist

### 11.2 Reference Architecture Diagrams

#### System Context Diagram
```
┌─────────────┐
│   End User  │
│  (Web/App)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│        OTT Platform System          │
│  ┌──────────┐  ┌──────────────┐    │
│  │   Auth   │  │   Catalog    │    │
│  └──────────┘  └──────────────┘    │
│  ┌──────────┐  ┌──────────────┐    │
│  │Streaming │  │Recommendation│    │
│  └──────────┘  └──────────────┘    │
└─────────────────────────────────────┘
       │                    │
       ▼                    ▼
┌─────────────┐      ┌─────────────┐
│  Databases  │      │   CDN       │
│  (PG/Mongo) │      │ (CloudFront)│
└─────────────┘      └─────────────┘
```

#### Data Flow Diagram (Video Playback)
```
User → API Gateway → Auth Service (validate JWT)
                  ↓
            Catalog Service (get content metadata)
                  ↓
            Streaming Service (generate manifest)
                  ↓
            CDN (deliver video segments)
                  ↓
            User Activity Service (track position)
```

### 11.3 Technology Alternatives Considered

#### Backend Framework
- **Chosen**: NestJS
- **Alternatives**: Express.js (too minimal), Fastify (less ecosystem), Go (steeper learning curve)
- **Reason**: TypeScript support, built-in DI, modular architecture, extensive ecosystem

#### Database
- **Chosen**: PostgreSQL + MongoDB
- **Alternatives**: MySQL (less JSON support), Cassandra (overkill for MVP), DynamoDB (vendor lock-in)
- **Reason**: PostgreSQL for relational data, MongoDB for flexible user activity data

#### Video Player
- **Chosen**: Custom HTML5 + HLS.js
- **Alternatives**: Video.js (heavier), Plyr (less customizable), JW Player (paid)
- **Reason**: Full control, lightweight, HLS support, easy customization

#### Frontend Framework
- **Chosen**: Next.js + React
- **Alternatives**: Vue.js (smaller ecosystem), Angular (too heavy), Svelte (less mature)
- **Reason**: SSR support, great DX, large ecosystem, performance

### 11.4 Test Content Catalog (500+ Assets)

#### Content Distribution
The platform includes a comprehensive test catalog with 500+ assets:

**Movies (400 items)**
- Diverse titles across all genres
- Release years: 2010-2025
- Duration: 90-150 minutes
- Quality variants: 1080p, 720p, 480p
- Mix of Free (67%) and Premium (33%) content

**TV Shows (100 items)**
- 1-3 seasons per show
- 6-10 episodes per season
- Total: ~1,500+ episodes
- Episode duration: 40-60 minutes
- Mix of Free (50%) and Premium (50%) content

#### Visual Assets Strategy
All content uses unique images via Picsum Photos API:
- **Spotlight**: 1920x800 landscape (hero banner)
- **Posters**: 400x600 portrait (content cards)
- **Thumbnails**: 800x450 landscape (trays)
- **Episodes**: 800x450 landscape (episode lists)

Each image uses a unique seed pattern ensuring visual variety across the entire catalog.

#### Sample Movie Titles
The Last Journey, Shadow Warriors, Midnight Express, Desert Storm, Ocean Deep, Mountain Peak, City Lights, Dark Horizon, Silent Echo, Broken Dreams, Rising Sun, Fallen Angels, Lost Paradise, Hidden Truth, Secret Mission, Final Countdown, Endless Night, Golden Dawn, Silver Lining, Crystal Clear, Thunder Strike, Lightning Bolt, Storm Chaser, Wind Runner, Fire Starter, Ice Breaker, Wave Rider, Sky Walker, Star Gazer, Moon Shadow, and 370+ more unique titles.

#### Sample TV Show Titles
Chronicles, Legends, Tales, Stories, Mysteries, Adventures, Secrets, Shadows, Echoes, Dreams (each with multiple seasons and episodes).

#### Database Seeding
```bash
# Reseed database with 500+ assets
cd services/catalog-service
npm run seed
```

The seed script generates:
- 400 movies with unique metadata
- 100 TV shows with 1-3 seasons each
- ~1,500+ episodes across all shows
- Multiple quality variants per content
- English and Hindi audio/subtitle tracks
- Unique images for all content items

### 11.5 Open Source Test Content

#### Free HLS Streams for Testing
1. **Big Buck Bunny** (10 min, Animation)
   - URL: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`

2. **Sintel** (15 min, Animation)
   - URL: `https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8`

3. **Tears of Steel** (12 min, Sci-Fi)
   - URL: `https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8`

4. **Apple Test Streams**
   - URL: `https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8`

### 11.5 Useful Resources

#### Documentation
- NestJS: https://docs.nestjs.com
- Next.js: https://nextjs.org/docs
- HLS.js: https://github.com/video-dev/hls.js
- PostgreSQL: https://www.postgresql.org/docs
- MongoDB: https://docs.mongodb.com

#### Video Streaming
- HLS Specification: https://datatracker.ietf.org/doc/html/rfc8216
- DASH Specification: https://dashif.org/docs
- FFmpeg Documentation: https://ffmpeg.org/documentation.html

#### Cloud Platforms
- AWS Documentation: https://docs.aws.amazon.com
- Kubernetes: https://kubernetes.io/docs
- Docker: https://docs.docker.com

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-20 | System Architect | Initial comprehensive specification |

---

**End of Document**

This specification is a living document and will be updated as the project evolves. For questions or clarifications, please contact the project team.

