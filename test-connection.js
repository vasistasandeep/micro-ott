// Simple script to test database connections
// Run with: node test-connection.js

const { Pool } = require('pg');

// You can paste your credentials here temporarily to test
const POSTGRES_HOST = 'your-host-here';
const POSTGRES_PORT = 5432;
const POSTGRES_DB = 'your-db-here';
const POSTGRES_USER = 'your-user-here';
const POSTGRES_PASSWORD = 'your-password-here';

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection...\n');
  
  const pool = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const result = await pool.query('SELECT COUNT(*) FROM content');
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${result.rows[0].count} content items in database\n`);
    
    const genres = await pool.query('SELECT COUNT(*) FROM genres');
    console.log(`🎭 Found ${genres.rows[0].count} genres\n`);
    
    console.log('🎉 Your database is ready for deployment!');
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    console.log('\n💡 Tips:');
    console.log('1. Check if credentials are correct');
    console.log('2. Verify SSL is enabled');
    console.log('3. Check if database has been migrated and seeded');
  } finally {
    await pool.end();
  }
}

testConnection();
