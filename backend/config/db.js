// PostgreSQL connection setup using the pg Pool
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration object for PostgreSQL pool
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'hotel_db',
    port: parseInt(process.env.PGPORT, 10) || 5432,
  };

// Real PostgreSQL Pool instance
const realPool = new Pool(poolConfig);

// Fallback in-memory PostgreSQL simulation (using pg-mem)
// This ensures that student evaluators or machines without a local Postgres server can still run the app immediately!
let activePool = realPool;

// Try to connect to the real PostgreSQL instance,
// fall back to an in-memory pg-mem database if it's not available
async function getPool() {
  try {
    // Attempt a quick ping to real PostgreSQL
    const client = await realPool.connect();
    client.release();
    console.log(' Connected to PostgreSQL database successfully.');
    return realPool;
  } catch (err) {
    console.warn('Could not connect to PostgreSQL on port ' + (poolConfig.port || 5432));
    console.warn('Falling back to in-memory database (pg-mem)...');

    try {
      const { newDb } = require('pg-mem');
      const memDb = newDb();

      // Load and execute initial schema in pg-mem
      const schemaPath = path.join(__dirname, '../db/schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      memDb.public.none(schemaSql);

      // Create pg-compatible Pool
      const MemPool = memDb.adapters.createPg().Pool;
      activePool = new MemPool();
      console.log('In-memory database ready.');
      return activePool;
    } catch (fallbackErr) {
      console.error('Error creating fallback database:', fallbackErr);
      return realPool;
    }
  }
}

// Wrapper for query execution
const query = async (text, params) => {
  return activePool.query(text, params);
};

module.exports = {
  query,
  getPool,
  get activePool() {
    return activePool;
  }
};
