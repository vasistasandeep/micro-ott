// Fixed migration script that handles existing types
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_WJQ3sodu9Uyr',
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'infrastructure/sql/init.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    // Remove comments
    sql = sql.replace(/--.*$/gm, '');
    
    // Split on semicolons but keep multi-line statements together
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      try {
        await client.query(statement + ';');
        successCount++;
        
        // Log important operations
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE (\w+)/)?.[1];
          console.log(`✅ Created table: ${tableName}`);
        } else if (statement.includes('CREATE TYPE')) {
          const typeName = statement.match(/CREATE TYPE (\w+)/)?.[1];
          console.log(`✅ Created type: ${typeName}`);
        } else if (statement.includes('INSERT INTO genres')) {
          console.log(`✅ Inserted genres`);
        } else if (statement.includes('CREATE INDEX')) {
          const indexName = statement.match(/CREATE INDEX (\w+)/)?.[1];
          console.log(`✅ Created index: ${indexName}`);
        }
      } catch (error) {
        // Skip if already exists
        if (error.code === '42710' || error.code === '42P07' || error.code === '42P16') {
          skipCount++;
          const match = statement.match(/CREATE (?:TABLE|TYPE|INDEX) (\w+)/);
          if (match) {
            console.log(`⏭️  Skipped (already exists): ${match[1]}`);
          }
        } else {
          console.error(`❌ Error:`, error.message);
          console.error(`Statement:`, statement.substring(0, 100) + '...');
        }
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`  ✅ Success: ${successCount}`);
    console.log(`  ⏭️  Skipped: ${skipCount}`);

    // Verify tables were created
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('\n📋 Tables in database:');
    tableCheck.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n✅ Migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

runMigration();
