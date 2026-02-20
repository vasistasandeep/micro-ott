// Direct seed script to test database insertion
const { Client } = require('pg');

const client = new Client({
  host: 'ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_WJQ3sodu9Uyr',
  ssl: { rejectUnauthorized: false },
});

async function seedTest() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Insert a test movie
    const result = await client.query(`
      INSERT INTO content (
        type, title, description, release_date, duration_minutes, 
        maturity_rating, poster_url, thumbnail_url, workflow_state, 
        tier_requirement, published_at
      ) VALUES (
        'movie', 'Test Movie', 'This is a test movie', '2024-01-01', 120,
        'PG-13', 'https://picsum.photos/seed/test1/400/600', 
        'https://picsum.photos/seed/test2/400/225', 'published',
        'free', NOW()
      ) RETURNING id, title
    `);

    console.log('✅ Inserted test movie:', result.rows[0]);

    // Verify it's there
    const check = await client.query('SELECT COUNT(*) FROM content');
    console.log('Total content items:', check.rows[0].count);

    // Get the test movie
    const movie = await client.query('SELECT * FROM content WHERE title = $1', ['Test Movie']);
    console.log('\nTest movie details:', movie.rows[0]);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

seedTest();
