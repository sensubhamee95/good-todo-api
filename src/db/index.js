const { Pool } = require('pg');
require('dotenv').config();

// Create pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(res => {
    console.log('DB Connected:', res.rows[0]);
  })
  .catch(err => {
    console.error('DB Connection Error:', err);
  });

// Export query function
const query = (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  query,
};