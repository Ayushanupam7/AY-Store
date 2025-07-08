const { connectToDatabase } = require('./mongodb-client');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { appName } = JSON.parse(event.body);
    const db = await connectToDatabase();
    
    // Update or create like count in MongoDB
    const result = await db.collection('likes').findOneAndUpdate(
      { appName },
      { $inc: { count: 1 } },
      { 
        upsert: true,
        returnDocument: 'after' 
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        newCount: result.value.count 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: error.message 
      })
    };
  }
};