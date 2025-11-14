import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});


pool.connect()
  .then(() => console.log(' Connected to Neon PostgreSQL'))
  .catch((err) => console.error(' Error connecting to Neon DB:', err));


export default pool;



