import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const poolConfig: any = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'ott_catalog',
  user: process.env.POSTGRES_USER || 'ott_user',
  password: process.env.POSTGRES_PASSWORD || 'ott_password',
};

// Enable SSL for production (Neon requires SSL)
if (process.env.POSTGRES_SSL === 'true' || process.env.NODE_ENV === 'production') {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

// Movie title templates for generating diverse content
const movieTitles = [
  'The Last Journey', 'Shadow Warriors', 'Midnight Express', 'Desert Storm', 'Ocean Deep',
  'Mountain Peak', 'City Lights', 'Dark Horizon', 'Silent Echo', 'Broken Dreams',
  'Rising Sun', 'Fallen Angels', 'Lost Paradise', 'Hidden Truth', 'Secret Mission',
  'Final Countdown', 'Endless Night', 'Golden Dawn', 'Silver Lining', 'Crystal Clear',
  'Thunder Strike', 'Lightning Bolt', 'Storm Chaser', 'Wind Runner', 'Fire Starter',
  'Ice Breaker', 'Wave Rider', 'Sky Walker', 'Star Gazer', 'Moon Shadow',
  'Blood Diamond', 'Iron Fist', 'Steel Heart', 'Stone Cold', 'Glass House',
  'Paper Trail', 'Silk Road', 'Velvet Touch', 'Leather Bound', 'Cotton Candy',
  'Sugar Rush', 'Honey Trap', 'Bitter Sweet', 'Sour Grapes', 'Fresh Start',
  'New Beginning', 'Old Flame', 'Young Blood', 'Ancient Wisdom', 'Modern Times'
];

const adjectives = ['Brave', 'Dark', 'Silent', 'Hidden', 'Lost', 'Broken', 'Rising', 'Fallen', 'Secret', 'Final'];
const nouns = ['Warrior', 'Shadow', 'Echo', 'Dream', 'Truth', 'Mission', 'Journey', 'Paradise', 'Horizon', 'Dawn'];

const tvShowTitles = [
  'Chronicles', 'Legends', 'Tales', 'Stories', 'Mysteries', 'Adventures', 'Secrets', 'Shadows', 'Echoes', 'Dreams'
];

const genres = ['action', 'drama', 'comedy', 'thriller', 'animation', 'documentary', 'sports'];

function generateTitle(index: number, type: 'movie' | 'tv_show'): string {
  if (type === 'movie') {
    if (index < movieTitles.length) {
      return movieTitles[index];
    }
    const adj = adjectives[index % adjectives.length];
    const noun = nouns[Math.floor(index / adjectives.length) % nouns.length];
    const num = Math.floor(index / (adjectives.length * nouns.length)) + 1;
    return num > 1 ? `${adj} ${noun} ${num}` : `${adj} ${noun}`;
  } else {
    const base = tvShowTitles[index % tvShowTitles.length];
    const num = Math.floor(index / tvShowTitles.length) + 1;
    return num > 1 ? `${base} ${num}` : base;
  }
}

function generateDescription(title: string, type: string): string {
  const descriptions = [
    `An epic ${type} following the journey of unlikely heroes.`,
    `A thrilling ${type} that keeps you on the edge of your seat.`,
    `A heartwarming ${type} about love, loss, and redemption.`,
    `An action-packed ${type} with stunning visuals and intense drama.`,
    `A gripping ${type} that explores the depths of human nature.`,
    `A captivating ${type} set in a world of mystery and intrigue.`,
    `An unforgettable ${type} that will leave you wanting more.`,
    `A powerful ${type} about courage, sacrifice, and hope.`,
    `A mesmerizing ${type} with unexpected twists and turns.`,
    `An inspiring ${type} that celebrates the human spirit.`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Get genre IDs
    const genresResult = await pool.query('SELECT id, slug FROM genres');
    const genreMap = genresResult.rows.reduce((acc, row) => {
      acc[row.slug] = row.id;
      return acc;
    }, {} as Record<string, string>);

    console.log(`✅ Found ${Object.keys(genreMap).length} genres`);

    // Insert 400 movies
    console.log('🎬 Inserting 400 movies...');
    const movieIds: string[] = [];
    
    for (let i = 0; i < 400; i++) {
      const title = generateTitle(i, 'movie');
      const releaseYear = 2010 + (i % 15);
      const duration = 90 + (i % 60);
      const maturityRatings = ['G', 'PG', 'PG-13', 'R'];
      const maturity = maturityRatings[i % 4];
      const tier = i % 3 === 0 ? 'premium' : 'free';
      
      // Use different seed for each movie to get unique images
      const posterSeed = `movie-${i}-poster`;
      const thumbSeed = `movie-${i}-thumb`;
      
      const movie = await pool.query(`
        INSERT INTO content (type, title, description, release_date, duration_minutes, maturity_rating, 
          poster_url, thumbnail_url, trailer_url, workflow_state, tier_requirement, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id;
      `, [
        'movie',
        title,
        generateDescription(title, 'movie'),
        `${releaseYear}-${String((i % 12) + 1).padStart(2, '0')}-15`,
        duration,
        maturity,
        `https://picsum.photos/seed/${posterSeed}/400/600`,
        `https://picsum.photos/seed/${thumbSeed}/800/450`,
        'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        'published',
        tier,
        new Date()
      ]);

      movieIds.push(movie.rows[0].id);

      // Assign 1-3 random genres
      const numGenres = 1 + (i % 3);
      const selectedGenres = [];
      for (let j = 0; j < numGenres; j++) {
        const genreSlug = genres[(i + j) % genres.length];
        if (genreMap[genreSlug]) {
          selectedGenres.push(genreMap[genreSlug]);
        }
      }

      for (const genreId of selectedGenres) {
        await pool.query(`
          INSERT INTO content_genres (content_id, genre_id) VALUES ($1, $2)
          ON CONFLICT DO NOTHING;
        `, [movie.rows[0].id, genreId]);
      }

      // Add video variants
      const qualities = ['1080p', '720p', '480p'];
      const bitrates = [5000, 2500, 1000];
      
      for (let q = 0; q < qualities.length; q++) {
        await pool.query(`
          INSERT INTO video_variants (content_id, quality, hls_url, bitrate_kbps)
          VALUES ($1, $2, $3, $4);
        `, [movie.rows[0].id, qualities[q], 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', bitrates[q]]);
      }

      // Add audio tracks
      await pool.query(`
        INSERT INTO audio_tracks (content_id, language, label, url) VALUES 
        ($1, 'en', 'English', 'https://example.com/audio/en.m3u8'),
        ($1, 'hi', 'Hindi', 'https://example.com/audio/hi.m3u8');
      `, [movie.rows[0].id]);

      // Add subtitles
      await pool.query(`
        INSERT INTO subtitles (content_id, language, label, url) VALUES 
        ($1, 'en', 'English', 'https://example.com/subs/en.vtt'),
        ($1, 'hi', 'Hindi', 'https://example.com/subs/hi.vtt');
      `, [movie.rows[0].id]);

      if ((i + 1) % 50 === 0) {
        console.log(`   ✓ Inserted ${i + 1} movies...`);
      }
    }

    console.log('✅ 400 movies inserted successfully!');

    // Insert 100 TV shows
    console.log('📺 Inserting 100 TV shows...');
    
    for (let i = 0; i < 100; i++) {
      const title = generateTitle(i, 'tv_show');
      const releaseYear = 2015 + (i % 10);
      const maturityRatings = ['G', 'PG', 'PG-13', 'R'];
      const maturity = maturityRatings[i % 4];
      const tier = i % 2 === 0 ? 'premium' : 'free';
      
      const posterSeed = `tvshow-${i}-poster`;
      const thumbSeed = `tvshow-${i}-thumb`;
      
      const tvShow = await pool.query(`
        INSERT INTO content (type, title, description, release_date, maturity_rating,
          poster_url, thumbnail_url, workflow_state, tier_requirement, published_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;
      `, [
        'tv_show',
        title,
        generateDescription(title, 'series'),
        `${releaseYear}-01-01`,
        maturity,
        `https://picsum.photos/seed/${posterSeed}/400/600`,
        `https://picsum.photos/seed/${thumbSeed}/800/450`,
        'published',
        tier,
        new Date()
      ]);

      // Assign genres
      const numGenres = 1 + (i % 2);
      for (let j = 0; j < numGenres; j++) {
        const genreSlug = genres[(i + j) % genres.length];
        if (genreMap[genreSlug]) {
          await pool.query(`
            INSERT INTO content_genres (content_id, genre_id) VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `, [tvShow.rows[0].id, genreMap[genreSlug]]);
        }
      }

      // Add 1-3 seasons
      const numSeasons = 1 + (i % 3);
      
      for (let s = 1; s <= numSeasons; s++) {
        const season = await pool.query(`
          INSERT INTO seasons (content_id, season_number, title, release_date)
          VALUES ($1, $2, $3, $4)
          RETURNING id;
        `, [tvShow.rows[0].id, s, `Season ${s}`, `${releaseYear + s - 1}-01-01`]);

        // Add 6-10 episodes per season
        const numEpisodes = 6 + (i % 5);
        
        for (let e = 1; e <= numEpisodes; e++) {
          const episodeSeed = `episode-${i}-${s}-${e}`;
          
          const episode = await pool.query(`
            INSERT INTO episodes (season_id, episode_number, title, description, duration_minutes, thumbnail_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
          `, [
            season.rows[0].id,
            e,
            `Episode ${e}`,
            `An exciting episode of ${title} that continues the story.`,
            40 + (e % 20),
            `https://picsum.photos/seed/${episodeSeed}/800/450`
          ]);

          // Add video variants for episode
          await pool.query(`
            INSERT INTO video_variants (episode_id, quality, hls_url, bitrate_kbps)
            VALUES 
              ($1, '1080p', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 5000),
              ($1, '720p', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', 2500);
          `, [episode.rows[0].id]);

          // Add audio tracks for episode
          await pool.query(`
            INSERT INTO audio_tracks (episode_id, language, label, url) VALUES 
            ($1, 'en', 'English', 'https://example.com/audio/en.m3u8'),
            ($1, 'hi', 'Hindi', 'https://example.com/audio/hi.m3u8');
          `, [episode.rows[0].id]);

          // Add subtitles for episode
          await pool.query(`
            INSERT INTO subtitles (episode_id, language, label, url) VALUES 
            ($1, 'en', 'English', 'https://example.com/subs/en.vtt'),
            ($1, 'hi', 'Hindi', 'https://example.com/subs/hi.vtt');
          `, [episode.rows[0].id]);
        }
      }

      if ((i + 1) % 20 === 0) {
        console.log(`   ✓ Inserted ${i + 1} TV shows...`);
      }
    }

    console.log('✅ 100 TV shows inserted successfully!');
    console.log('');
    console.log('📊 Seeding Summary:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   ✓ 400 Movies (with multiple quality variants)');
    console.log('   ✓ 100 TV Shows (with 1-3 seasons each)');
    console.log('   ✓ ~1,500+ Episodes across all shows');
    console.log('   ✓ Unique images for each content item');
    console.log('   ✓ Mix of Free and Premium content');
    console.log('   ✓ Multi-language audio and subtitles');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🎉 Database seeded with 500+ content assets!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
