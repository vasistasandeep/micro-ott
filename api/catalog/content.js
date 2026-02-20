// Vercel Serverless Function for Catalog API
const { Client } = require('pg');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Create a new client for each request (serverless best practice)
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    
    const { limit = 20, offset = 0, type, genre } = req.query;

    let query = `
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
        c.trailer_url,
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
    `;

    const params = [];
    let paramCount = 1;

    if (type) {
      query += ` AND c.type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }

    if (genre) {
      query += ` AND EXISTS (
        SELECT 1 FROM content_genres cg2
        JOIN genres g2 ON cg2.genre_id = g2.id
        WHERE cg2.content_id = c.id AND g2.slug = $${paramCount}
      )`;
      params.push(genre);
      paramCount++;
    }

    query += `
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const result = await client.query(query, params);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        passwordType: typeof process.env.POSTGRES_PASSWORD,
        passwordLength: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD.length : 0
      } : undefined
    });
  } finally {
    await client.end();
  }
};
