# API Documentation

Base URL: `http://localhost:3000`

## Authentication

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "subscriptionTier": "free"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "subscriptionTier": "free"
  }
}
```

### Manage Profiles

#### List Profiles
```http
GET /api/auth/profiles
x-user-id: <user-id>
```

#### Create Profile
```http
POST /api/auth/profiles
x-user-id: <user-id>
Content-Type: application/json

{
  "name": "Kids",
  "languagePreference": "hi"
}
```

#### Update Profile
```http
PUT /api/auth/profiles/:profileId
Content-Type: application/json

{
  "name": "Updated Name",
  "maturityRating": "PG"
}
```

#### Delete Profile
```http
DELETE /api/auth/profiles/:profileId
```

## Catalog

### List Content

```http
GET /api/catalog/content?type=movie&limit=20&offset=0
```

Query Parameters:
- `type` (optional): movie, tv_show, sports
- `genre` (optional): Genre slug
- `limit` (optional): Number of items (default: 20)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
[
  {
    "id": "uuid",
    "type": "movie",
    "title": "Big Buck Bunny",
    "description": "...",
    "releaseDate": "2008-04-10",
    "durationMinutes": 10,
    "maturityRating": "G",
    "posterUrl": "https://...",
    "thumbnailUrl": "https://...",
    "tierRequirement": "free",
    "genres": [
      {"id": "uuid", "name": "Comedy", "slug": "comedy"}
    ]
  }
]
```

### Get Content Details

```http
GET /api/catalog/content/:contentId
```

Response includes video variants, audio tracks, and subtitles:
```json
{
  "id": "uuid",
  "title": "Big Buck Bunny",
  "description": "...",
  "videoVariants": [
    {
      "quality": "720p",
      "hlsUrl": "https://...",
      "bitrateKbps": 2500
    }
  ],
  "audioTracks": [
    {
      "language": "en",
      "label": "English",
      "url": "https://..."
    }
  ],
  "subtitles": [
    {
      "language": "hi",
      "label": "Hindi",
      "url": "https://..."
    }
  ]
}
```

### Search Content

```http
GET /api/catalog/search?q=bunny
```

### Get Trending Content

```http
GET /api/catalog/trending
```

### Get Genres

```http
GET /api/catalog/genres
```

### TV Shows

#### Get Seasons
```http
GET /api/catalog/content/:contentId/seasons
```

#### Get Episodes
```http
GET /api/catalog/seasons/:seasonId/episodes
```

## Streaming

### Get Manifest

```http
GET /api/stream/:contentId/manifest?quality=720p
```

Response:
```json
{
  "contentId": "uuid",
  "type": "hls",
  "qualities": ["144p", "360p", "480p", "720p", "1080p"],
  "defaultQuality": "720p",
  "manifestUrl": "https://..."
}
```

### Start Playback

```http
POST /api/stream/playback/start
Content-Type: application/json

{
  "userId": "uuid",
  "profileId": "uuid",
  "contentId": "uuid",
  "episodeId": "uuid" // optional, for TV shows
}
```

### Update Playback Position

```http
PUT /api/stream/playback/position
Content-Type: application/json

{
  "userId": "uuid",
  "profileId": "uuid",
  "contentId": "uuid",
  "position": 120, // seconds
  "episodeId": "uuid" // optional
}
```

### Complete Playback

```http
POST /api/stream/playback/complete
Content-Type: application/json

{
  "userId": "uuid",
  "profileId": "uuid",
  "contentId": "uuid",
  "episodeId": "uuid" // optional
}
```

### Get Continue Watching

```http
GET /api/stream/continue-watching/:userId/:profileId
```

Response:
```json
[
  {
    "contentId": "uuid",
    "episodeId": "uuid",
    "position": 120
  }
]
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

API Gateway enforces rate limiting:
- 100 requests per minute per IP address
- Returns `429 Too Many Requests` when exceeded
