const { Pool } = require('pg');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Get current likes
    const { rows } = await pool.query('SELECT likes_count FROM store_likes ORDER BY id DESC LIMIT 1');
    const currentLikes = rows[0]?.likes_count || 0;
    
    // Update likes
    await pool.query('INSERT INTO store_likes (likes_count) VALUES ($1)', [currentLikes + 1]);
    await pool.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ likes: currentLikes + 1 }),
    };
  } catch (error) {
    await pool.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update likes' }),
    };
  }
};