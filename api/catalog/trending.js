// Vercel Serverless Function for Trending Content
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
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
    const { limit = 10 } = req.query;

    // Get random trending content (in production, this would be based on view counts)
    const query = `
      SELECT 
        c.id,
        c.type,
        c.title,
        c.description,
        c.release_date,
        c.duration_minutes,
        c.maturity_rating,
        c.poster_url,
        c.thumbnail_url,
        c.tier_requirement,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object('id', g.id, 'name', g.name, 'slug', g.slug)
          ) FILTER (WHERE g.id IS NOT NULL),
          '[]'
        ) as genres
      FROM content c
      LEFT JOIN content_genres cg ON c.id = cg.content_id
      LEFT JOIN genres g ON cg.genre_id = g.id
      WHERE c.workflow_state = 'published'
      GROUP BY c.id
      ORDER BY RANDOM()
      LIMIT $1
    `;

    const result = await pool.query(query, [parseInt(limit)]);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending content',
      message: error.message,
    });
  }
};
