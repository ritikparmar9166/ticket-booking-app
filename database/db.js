import pkg from 'pg';
const { Pool } = pkg;
import { DATABASE_URL  } from '../config.js';

const pool = new Pool({
  connectionString: DATABASE_URL, 
  ssl: {
    rejectUnauthorized: false, 
  },
});

export default pool;

