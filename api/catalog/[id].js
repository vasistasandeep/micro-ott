// Vercel Serverless Function for Single Content Item
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD || ''),
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 1,
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const contentQuery = `
      SELECT 
        c.*,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', g.id, 'name', g.name, 'slug', g.slug)
          ) FILTER (WHERE g.id IS NOT NULL),
          '[]'
        ) as genres
      FROM content c
      LEFT JOIN content_genres cg ON c.id = cg.content_id
      LEFT JOIN genres g ON cg.genre_id = g.id
      WHERE c.id = $1 AND c.workflow_state = 'published'
      GROUP BY c.id
    `;

    const contentResult = await pool.query(contentQuery, [id]);

    if (contentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    const content = contentResult.rows[0];

    // Get video variants
    const variantsQuery = `
      SELECT quality, hls_url, dash_url, bitrate_kbps
      FROM video_variants
      WHERE content_id = $1
      ORDER BY bitrate_kbps DESC
    `;
    const variantsResult = await pool.query(variantsQuery, [id]);

    // Get audio tracks
    const audioQuery = `
      SELECT language, label, url
      FROM audio_tracks
      WHERE content_id = $1
    `;
    const audioResult = await pool.query(audioQuery, [id]);

    // Get subtitles
    const subtitlesQuery = `
      SELECT language, label, url
      FROM subtitles
      WHERE content_id = $1
    `;
    const subtitlesResult = await pool.query(subtitlesQuery, [id]);

    // Get seasons and episodes for TV shows
    let seasons = [];
    if (content.type === 'tv_show') {
      const seasonsQuery = `
        SELECT s.*, 
          COALESCE(
            json_agg(
              jsonb_build_object(
                'id', e.id,
                'episode_number', e.episode_number,
                'title', e.title,
                'description', e.description,
                'duration_minutes', e.duration_minutes,
                'thumbnail_url', e.thumbnail_url
              ) ORDER BY e.episode_number
            ) FILTER (WHERE e.id IS NOT NULL),
            '[]'
          ) as episodes
        FROM seasons s
        LEFT JOIN episodes e ON s.id = e.season_id
        WHERE s.content_id = $1
        GROUP BY s.id
        ORDER BY s.season_number
      `;
      const seasonsResult = await pool.query(seasonsQuery, [id]);
      seasons = seasonsResult.rows;
    }

    res.status(200).json({
      success: true,
      data: {
        ...content,
        video_variants: variantsResult.rows,
        audio_tracks: audioResult.rows,
        subtitles: subtitlesResult.rows,
        seasons: seasons,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content details',
      message: error.message,
    });
  }
};
