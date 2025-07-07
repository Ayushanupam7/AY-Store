const { Pool } = require('pg');

exports.handler = async (event, context) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { rows } = await pool.query('SELECT likes_count FROM store_likes ORDER BY id DESC LIMIT 1');
    await pool.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ likes: rows[0]?.likes_count || 0 }),
    };
  } catch (error) {
    await pool.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch likes' }),
    };
  }
};