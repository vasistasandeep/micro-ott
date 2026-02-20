// Detailed check of content in database
const { Client } = require('pg');

const client = new Client({
  host: 'ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_WJQ3sodu9Uyr',
  ssl: { rejectUnauthorized: false },
});

async function checkContent() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Count all content regardless of state
    const totalCount = await client.query('SELECT COUNT(*) FROM content');
    console.log('Total content items:', totalCount.rows[0].count);

    // Count by workflow state
    const byState = await client.query(`
      SELECT workflow_state, COUNT(*) 
      FROM content 
      GROUP BY workflow_state
    `);
    console.log('\nContent by workflow state:');
    byState.rows.forEach(row => {
      console.log(`  ${row.workflow_state}: ${row.count}`);
    });

    // Count by type
    const byType = await client.query(`
      SELECT type, COUNT(*) 
      FROM content 
      GROUP BY type
    `);
    console.log('\nContent by type:');
    byType.rows.forEach(row => {
      console.log(`  ${row.type}: ${row.count}`);
    });

    // Sample content
    const sample = await client.query(`
      SELECT id, title, type, workflow_state 
      FROM content 
      LIMIT 10
    `);
    console.log('\nSample content:');
    sample.rows.forEach(row => {
      console.log(`  - ${row.title} (${row.type}) [${row.workflow_state}]`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkContent();
