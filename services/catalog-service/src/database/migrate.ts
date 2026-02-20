import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'ott_catalog',
  user: process.env.POSTGRES_USER || 'ott_user',
  password: process.env.POSTGRES_PASSWORD || 'ott_password',
});

async function migrate() {
  console.log('Starting database migration...');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../../../../infrastructure/sql/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await pool.query(sql);

    console.log('✅ Migration completed successfully!');
    console.log('Created:');
    console.log('  - 3 ENUM types');
    console.log('  - 15 tables');
    console.log('  - 10 genres');
    console.log('  - Multiple indexes');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate();
