const { Pool } = require('pg');

exports.handler = async (event, context) => {
  // Check if database URL is set
  if (!process.env.DATABASE_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database connection not configured" }),
    };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // First check if table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS store_likes (
        id SERIAL PRIMARY KEY,
        likes_count INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT NOW()
      )
    `);

    // Initialize with 0 likes if empty
    const { rowCount } = await pool.query('SELECT * FROM store_likes');
    if (rowCount === 0) {
      await pool.query('INSERT INTO store_likes (likes_count) VALUES (0)');
    }

    // Get current likes
    const { rows } = await pool.query('SELECT likes_count FROM store_likes ORDER BY id DESC LIMIT 1');
    await pool.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ likes: rows[0].likes_count }),
    };
  } catch (error) {
    await pool.end();
    console.error('Database error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch likes", details: error.message }),
    };
  }
};