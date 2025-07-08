const { connectToDatabase } = require('./mongodb-client');

exports.handler = async (event) => {
  try {
    const db = await connectToDatabase();
    const likes = await db.collection('likes').find({}).toArray();
    
    const likesMap = likes.reduce((acc, { appName, count }) => {
      acc[appName] = count;
      return acc;
    }, {});
    
    return {
      statusCode: 200,
      body: JSON.stringify(likesMap)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};