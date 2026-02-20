-- Create ENUM types
CREATE TYPE content_type AS ENUM ('movie', 'tv_show', 'sports');
CREATE TYPE workflow_state AS ENUM ('draft', 'pending_review', 'approved', 'published', 'archived');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    maturity_rating VARCHAR(10) DEFAULT 'PG-13',
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Content table
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

-- Seasons table
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    season_number INT NOT NULL,
    title VARCHAR(255),
    release_date DATE,
    UNIQUE(content_id, season_number)
);

-- Episodes table
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

-- Video variants table
CREATE TABLE video_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    quality VARCHAR(10) NOT NULL,
    hls_url VARCHAR(1000) NOT NULL,
    dash_url VARCHAR(1000),
    bitrate_kbps INT,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);

-- Audio tracks table
CREATE TABLE audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    label VARCHAR(50),
    url VARCHAR(1000) NOT NULL,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);

-- Subtitles table
CREATE TABLE subtitles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    label VARCHAR(50),
    url VARCHAR(1000) NOT NULL,
    CHECK (content_id IS NOT NULL OR episode_id IS NOT NULL)
);

-- Genres table
CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

-- Content genres junction table
CREATE TABLE content_genres (
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (content_id, genre_id)
);

-- Content versions table
CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    metadata JSONB NOT NULL,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_workflow_state ON content(workflow_state);
CREATE INDEX idx_content_release_date ON content(release_date DESC);
CREATE INDEX idx_episodes_season ON episodes(season_id);
CREATE INDEX idx_video_variants_content ON video_variants(content_id);
CREATE INDEX idx_video_variants_episode ON video_variants(episode_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_profiles_user ON profiles(user_id);

-- Insert default genres
INSERT INTO genres (name, slug) VALUES
    ('Action', 'action'),
    ('Comedy', 'comedy'),
    ('Drama', 'drama'),
    ('Thriller', 'thriller'),
    ('Romance', 'romance'),
    ('Horror', 'horror'),
    ('Sci-Fi', 'sci-fi'),
    ('Documentary', 'documentary'),
    ('Sports', 'sports'),
    ('Kids', 'kids');
