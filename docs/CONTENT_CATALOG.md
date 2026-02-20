# 📚 Content Catalog Documentation

## Overview

The OTT platform now includes a comprehensive content library with **500+ assets** designed for testing and demonstration purposes.

## Content Statistics

### Total Assets
- **400 Movies** (80% of catalog)
- **100 TV Shows** (20% of catalog)
- **~1,500+ Episodes** across all TV shows
- **10 Genres** for content categorization

### Content Distribution

#### By Type
| Type | Count | Percentage |
|------|-------|------------|
| Movies | 400 | 80% |
| TV Shows | 100 | 20% |
| Episodes | ~1,500 | - |

#### By Tier
| Tier | Count | Percentage |
|------|-------|------------|
| Free | ~330 | 66% |
| Premium | ~170 | 34% |

#### By Maturity Rating
| Rating | Description | Count | Percentage |
|--------|-------------|-------|------------|
| G | General Audiences | ~125 | 25% |
| PG | Parental Guidance | ~125 | 25% |
| PG-13 | Parents Strongly Cautioned | ~125 | 25% |
| R | Restricted | ~125 | 25% |

#### By Genre
| Genre | Approximate Count |
|-------|------------------|
| Action | ~70 |
| Drama | ~70 |
| Comedy | ~70 |
| Thriller | ~70 |
| Animation | ~70 |
| Documentary | ~70 |
| Sports | ~80 |
| Romance | ~50 |
| Horror | ~50 |
| Sci-Fi | ~50 |

## Movie Catalog

### Sample Movie Titles
- The Last Journey
- Shadow Warriors
- Midnight Express
- Desert Storm
- Ocean Deep
- Mountain Peak
- City Lights
- Dark Horizon
- Silent Echo
- Broken Dreams
- Rising Sun
- Fallen Angels
- Lost Paradise
- Hidden Truth
- Secret Mission
- Final Countdown
- Endless Night
- Golden Dawn
- Silver Lining
- Crystal Clear
- Thunder Strike
- Lightning Bolt
- Storm Chaser
- Wind Runner
- Fire Starter
- Ice Breaker
- Wave Rider
- Sky Walker
- Star Gazer
- Moon Shadow
- ...and 370 more

### Movie Specifications
- **Duration**: 90-150 minutes
- **Release Years**: 2010-2025
- **Quality Variants**: 1080p, 720p, 480p
- **Audio Tracks**: English, Hindi
- **Subtitles**: English, Hindi
- **Poster Format**: 400x600 (portrait)
- **Thumbnail Format**: 800x450 (landscape)

## TV Show Catalog

### Sample TV Show Titles
- Chronicles (3 seasons, 8 episodes each)
- Legends (2 seasons, 10 episodes each)
- Tales (1 season, 6 episodes)
- Stories (3 seasons, 7 episodes each)
- Mysteries (2 seasons, 9 episodes each)
- Adventures (1 season, 8 episodes)
- Secrets (3 seasons, 6 episodes each)
- Shadows (2 seasons, 10 episodes each)
- Echoes (1 season, 7 episodes)
- Dreams (2 seasons, 8 episodes each)
- ...and 90 more series

### TV Show Specifications
- **Seasons per Show**: 1-3
- **Episodes per Season**: 6-10
- **Episode Duration**: 40-60 minutes
- **Release Years**: 2015-2025
- **Quality Variants**: 1080p, 720p
- **Audio Tracks**: English, Hindi
- **Subtitles**: English, Hindi
- **Poster Format**: 400x600 (portrait)
- **Thumbnail Format**: 800x450 (landscape)
- **Episode Thumbnails**: 800x450 (unique per episode)

## Visual Assets

### Image Strategy
All visual assets use **Picsum Photos API** with unique seeds to ensure:
- Variety across all content
- Consistent quality
- Fast loading times
- No copyright concerns

### Image Formats

#### Spotlight Hero
- **Dimensions**: 1920x800
- **Format**: Landscape
- **Usage**: Hero banner background
- **Overlay**: Gradient for text readability
- **Seed Pattern**: `spotlight-{content-id}`

#### Content Posters
- **Dimensions**: 400x600
- **Format**: Portrait
- **Usage**: Content cards, detail pages
- **Seed Pattern**: `movie-{index}-poster` or `tvshow-{index}-poster`

#### Content Thumbnails
- **Dimensions**: 800x450
- **Format**: Landscape
- **Usage**: Horizontal trays, lists
- **Seed Pattern**: `movie-{index}-thumb` or `tvshow-{index}-thumb`

#### Episode Thumbnails
- **Dimensions**: 800x450
- **Format**: Landscape
- **Usage**: Episode lists
- **Seed Pattern**: `episode-{show-index}-{season}-{episode}`

## Content Generation Logic

### Movie Title Generation
```typescript
// First 50 movies use predefined titles
// Remaining movies use combination pattern:
// {Adjective} {Noun} {Number}
// Examples: "Brave Warrior", "Dark Shadow 2", "Silent Echo 3"
```

### TV Show Title Generation
```typescript
// Base titles: Chronicles, Legends, Tales, etc.
// Numbered sequentially: "Chronicles", "Chronicles 2", "Chronicles 3"
```

### Description Generation
- 10 unique description templates
- Randomly assigned to content
- Contextual to content type (movie/series)

## Multi-Language Support

### Audio Tracks
- **English**: Primary audio track
- **Hindi**: Secondary audio track
- **Format**: HLS audio streams
- **Switching**: Seamless during playback

### Subtitles
- **English**: Primary subtitle track
- **Hindi**: Secondary subtitle track
- **Format**: WebVTT (.vtt)
- **Switching**: Real-time toggle

## Video Streaming

### Test Streams
All content uses open-source test streams:
- **Primary**: Big Buck Bunny (Blender Foundation)
- **URL**: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`
- **Format**: HLS (HTTP Live Streaming)
- **Adaptive**: Multiple quality variants

### Quality Variants

#### Movies
- **1080p**: 5000 kbps
- **720p**: 2500 kbps
- **480p**: 1000 kbps

#### TV Show Episodes
- **1080p**: 5000 kbps
- **720p**: 2500 kbps

## Database Seeding

### How to Reseed
```bash
# Navigate to catalog service
cd services/catalog-service

# Run seed script
npm run seed
```

### Seed Script Features
- Generates 400 unique movies
- Generates 100 unique TV shows
- Creates 1-3 seasons per show
- Creates 6-10 episodes per season
- Assigns random genres (1-3 per content)
- Creates video variants for all qualities
- Adds audio tracks and subtitles
- Uses unique image seeds for variety

### Seed Duration
- **Estimated Time**: 5-10 minutes
- **Database Operations**: ~10,000+ inserts
- **Progress Logging**: Every 20-50 items

## Content Discovery

### Browse Features
- **By Genre**: Filter content by genre
- **By Type**: Movies, TV Shows, Sports
- **By Tier**: Free, Premium
- **By Rating**: G, PG, PG-13, R
- **By Year**: 2010-2025

### Search Features
- **Title Search**: Full-text search on titles
- **Description Search**: Search in descriptions
- **Genre Search**: Find by genre tags
- **Cast Search**: Search by cast/crew (future)

### Trending Algorithm
- Based on view count (last 7 days)
- Weighted by completion rate
- Updated every 6 hours
- Region-specific (India)

## Content Metadata

### Required Fields
- Title (English)
- Description
- Type (movie/tv_show/sports)
- Release Date
- Maturity Rating
- Poster URL
- Thumbnail URL
- Workflow State
- Tier Requirement

### Optional Fields
- Title (Hindi)
- Description (Hindi)
- Duration (for movies)
- Trailer URL
- Cast & Crew
- Director
- Producer
- Studio

## API Endpoints

### Get All Content
```bash
GET /api/catalog/content?limit=20&page=1&type=movie&genre=action
```

### Get Content Details
```bash
GET /api/catalog/content/:id
```

### Search Content
```bash
GET /api/catalog/search?q=shadow&limit=10
```

### Get Trending
```bash
GET /api/catalog/trending?period=7d&limit=20
```

### Get Genres
```bash
GET /api/catalog/genres
```

## Performance Considerations

### Database Indexes
- `idx_content_type` on `content.type`
- `idx_content_workflow_state` on `content.workflow_state`
- `idx_content_release_date` on `content.release_date`
- `idx_content_tier` on `content.tier_requirement`
- `idx_episodes_season` on `episodes.season_id`
- `idx_video_variants_content` on `video_variants.content_id`

### Caching Strategy
- Redis cache for popular content (24-hour TTL)
- CDN cache for images (7-day TTL)
- API response caching (5-minute TTL)

### Pagination
- Default: 20 items per page
- Maximum: 100 items per page
- Cursor-based for large datasets

## Future Enhancements

### Content Expansion
1. Add real video content (replace test streams)
2. Expand to 1,000+ movies
3. Add 500+ TV shows
4. Include live sports events
5. Add documentaries and shorts

### Metadata Enhancement
1. Add cast and crew information
2. Include IMDb/TMDB integration
3. Add user ratings and reviews
4. Include awards and nominations
5. Add behind-the-scenes content

### Visual Improvements
1. Replace placeholder images with real posters
2. Add video trailers for all content
3. Include screenshot galleries
4. Add 4K quality variants
5. Implement HDR support

## Troubleshooting

### No Content Showing
```bash
# Check if content exists
psql -U ott_user -d ott_catalog -c "SELECT COUNT(*) FROM content;"

# Reseed if needed
npm run seed
```

### Images Not Loading
- Check internet connection (Picsum Photos requires internet)
- Verify image URLs in database
- Check browser console for CORS errors

### Slow Loading
- Enable Redis caching
- Implement CDN for images
- Optimize database queries
- Add pagination

---

**Last Updated**: February 20, 2026  
**Content Version**: 1.0  
**Total Assets**: 500+
