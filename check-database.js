// Quick script to check what's in the database
const { Client } = require('pg');

const client = new Client({
  host: 'ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_WJQ3sodu9Uyr',
  ssl: { rejectUnauthorized: false },
});

async function checkDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check if content table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'content'
      );
    `);
    
    console.log('Content table exists:', tableCheck.rows[0].exists);

    if (tableCheck.rows[0].exists) {
      // Count content
      const contentCount = await client.query('SELECT COUNT(*) FROM content');
      console.log('Content items:', contentCount.rows[0].count);

      // Count genres
      const genreCount = await client.query('SELECT COUNT(*) FROM genres');
      console.log('Genres:', genreCount.rows[0].count);

      // List some content
      const sample = await client.query('SELECT id, title, type FROM content LIMIT 5');
      console.log('\nSample content:');
      sample.rows.forEach(row => {
        console.log(`  - ${row.title} (${row.type})`);
      });
    } else {
      console.log('\n❌ Content table does not exist. Need to run migrations.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
