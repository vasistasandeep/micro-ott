import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'ott_catalog',
  user: process.env.POSTGRES_USER || 'ott_user',
  password: process.env.POSTGRES_PASSWORD || 'ott_password',
});

async function seed() {
  console.log('Starting database seeding...');

  try {
    // Get genre IDs
    const genresResult = await pool.query('SELECT id, slug FROM genres');
    const genres = genresResult.rows.reduce((acc, row) => {
      acc[row.slug] = row.id;
      return acc;
    }, {} as Record<string, string>);

    // Seed Movies with open-source test videos
    const movies = [
      {
        title: 'Big Buck Bunny',
        description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
        type: 'movie',
        duration_minutes: 10,
        maturity_rating: 'G',
        release_date: '2008-04-10',
        poster_url: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
        thumbnail_url: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
        workflow_state: 'published',
        tier_requirement: 'free',
        published_at: new Date(),
        genres: ['comedy', 'kids'],
        video_variants: [
          { quality: '360p', hls_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate_kbps: 800 },
          { quality: '720p', hls_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate_kbps: 2500 },
        ],
        audio_tracks: [
          { language: 'en', label: 'English', url: 'https://example.com/audio/en.m3u8' },
        ],
        subtitles: [
          { language: 'en', label: 'English', url: 'https://example.com/subs/en.vtt' },
          { language: 'hi', label: 'Hindi', url: 'https://example.com/subs/hi.vtt' },
        ],
      },
      {
        title: 'Sintel',
        description: 'A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend.',
        type: 'movie',
        duration_minutes: 15,
        maturity_rating: 'PG',
        release_date: '2010-09-30',
        poster_url: 'https://durian.blender.org/wp-content/uploads/2010/06/sintel-poster.jpg',
        thumbnail_url: 'https://durian.blender.org/wp-content/uploads/2010/06/sintel-poster.jpg',
        workflow_state: 'published',
        tier_requirement: 'free',
        published_at: new Date(),
        genres: ['action', 'drama'],
        video_variants: [
          { quality: '480p', hls_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate_kbps: 1200 },
          { quality: '1080p', hls_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate_kbps: 5000 },
        ],
        audio_tracks: [
          { language: 'en', label: 'English', url: 'https://example.com/audio/en.m3u8' },
        ],
        subtitles: [
          { language: 'en', label: 'English', url: 'https://example.com/subs/en.vtt' },
        ],
      },
      {
        title: 'Tears of Steel',
        description: 'In a dystopian future, a group of scientists and warriors battle to save the world.',
        type: 'movie',
        duration_minutes: 12,
        maturity_rating: 'PG-13',
        release_date: '2012-09-26',
        poster_url: 'https://mango.blender.org/wp-content/uploads/2012/09/01_poster.jpg',
        thumbnail_url: 'https://mango.blender.org/wp-content/uploads/2012/09/01_poster.jpg',
        workflow_state: 'published',
        tier_requirement: 'premium',
        published_at: new Date(),
        genres: ['sci-fi', 'action'],
        video_variants: [
          { quality: '720p', hls_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate_kbps: 2500 },
          { quality: '1080p', hls_url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrate_kbps: 5000 },
        ],
        audio_tracks: [
          { language: 'en', label: 'English', url: 'https://example.com/audio/en.m3u8' },
          { language: 'hi', label: 'Hindi', url: 'https://example.com/audio/hi.m3u8' },
        ],
        subtitles: [
          { language: 'en', label: 'English', url: 'https://example.com/subs/en.vtt' },
          { language: 'hi', label: 'Hindi', url: 'https://example.com/subs/hi.vtt' },
        ],
      },
    ];

    for (const movie of movies) {
      const contentResult = await pool.query(
        `INSERT INTO content (type, title, description, duration_minutes, maturity_rating, 
         release_date, poster_url, thumbnail_url, workflow_state, tier_requirement, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [
          movie.type,
          movie.title,
          movie.description,
          movie.duration_minutes,
          movie.maturity_rating,
          movie.release_date,
          movie.poster_url,
          movie.thumbnail_url,
          movie.workflow_state,
          movie.tier_requirement,
          movie.published_at,
        ],
      );

      const contentId = contentResult.rows[0].id;

      // Insert genres
      for (const genreSlug of movie.genres) {
        await pool.query('INSERT INTO content_genres (content_id, genre_id) VALUES ($1, $2)', [
          contentId,
          genres[genreSlug],
        ]);
      }

      // Insert video variants
      for (const variant of movie.video_variants) {
        await pool.query(
          'INSERT INTO video_variants (content_id, quality, hls_url, bitrate_kbps) VALUES ($1, $2, $3, $4)',
          [contentId, variant.quality, variant.hls_url, variant.bitrate_kbps],
        );
      }

      // Insert audio tracks
      for (const audio of movie.audio_tracks) {
        await pool.query(
          'INSERT INTO audio_tracks (content_id, language, label, url) VALUES ($1, $2, $3, $4)',
          [contentId, audio.language, audio.label, audio.url],
        );
      }

      // Insert subtitles
      for (const subtitle of movie.subtitles) {
        await pool.query(
          'INSERT INTO subtitles (content_id, language, label, url) VALUES ($1, $2, $3, $4)',
          [contentId, subtitle.language, subtitle.label, subtitle.url],
        );
      }

      console.log(`Seeded movie: ${movie.title}`);
    }

    // Seed a TV Show
    const tvShowResult = await pool.query(
      `INSERT INTO content (type, title, description, maturity_rating, release_date, 
       poster_url, thumbnail_url, workflow_state, tier_requirement, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        'tv_show',
        'Demo Series',
        'A demonstration TV series with multiple seasons and episodes',
        'PG-13',
        '2024-01-01',
        'https://via.placeholder.com/400x600',
        'https://via.placeholder.com/300x200',
        'published',
        'free',
        new Date(),
      ],
    );

    const tvShowId = tvShowResult.rows[0].id;

    // Add genres to TV show
    await pool.query('INSERT INTO content_genres (content_id, genre_id) VALUES ($1, $2)', [
      tvShowId,
      genres['drama'],
    ]);

    // Create Season 1
    const season1Result = await pool.query(
      'INSERT INTO seasons (content_id, season_number, title, release_date) VALUES ($1, $2, $3, $4) RETURNING id',
      [tvShowId, 1, 'Season 1', '2024-01-01'],
    );

    const season1Id = season1Result.rows[0].id;

    // Create episodes for Season 1
    for (let i = 1; i <= 3; i++) {
      const episodeResult = await pool.query(
        `INSERT INTO episodes (season_id, episode_number, title, description, duration_minutes, thumbnail_url)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          season1Id,
          i,
          `Episode ${i}`,
          `Description for episode ${i}`,
          45,
          'https://via.placeholder.com/300x200',
        ],
      );

      const episodeId = episodeResult.rows[0].id;

      // Add video variants for episode
      await pool.query(
        'INSERT INTO video_variants (episode_id, quality, hls_url, bitrate_kbps) VALUES ($1, $2, $3, $4)',
        [episodeId, '720p', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 2500],
      );
    }

    console.log('Seeded TV Show: Demo Series with Season 1 (3 episodes)');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
