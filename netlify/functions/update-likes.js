const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
  });
  
  const { appName } = JSON.parse(event.body);
  
  try {
    // Check if document exists
    const existing = await client.query(
      q.Get(q.Match(q.Index('app_by_name'), appName))
      .catch(() => null);
    
    let result;
    if (existing) {
      // Update existing
      result = await client.query(
        q.Update(existing.ref, {
          data: { likes: existing.data.likes + 1 }
        })
      );
    } else {
      // Create new
      result = await client.query(
        q.Create(q.Collection('app_likes'), {
          data: { app_name: appName, likes: 1 }
        })
      );
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ likes: result.data.likes })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};