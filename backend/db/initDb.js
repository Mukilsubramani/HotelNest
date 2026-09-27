// Script to initialize the PostgreSQL database schema
// Run with: npm run init-db
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST || 'localhost',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'hotel_db',
        port: parseInt(process.env.PGPORT, 10) || 5432,
      }
);

async function initDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema SQL queries
    await pool.query(schemaSql);
    console.log('✅ Database initialized successfully: "hotels" table created.');

    // Check existing count
    const res = await pool.query('SELECT COUNT(*) FROM hotels');
    console.log(`Current hotel count: ${res.rows[0].count}`);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    console.error('Make sure PostgreSQL is running and your .env credentials are correct.');
    process.exit(1);
  }
}

initDatabase();
