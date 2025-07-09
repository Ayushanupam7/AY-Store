const { connectToDatabase } = require('./mongodb-client');

exports.handler = async () => {
  const db = await connectToDatabase();
  const likes = await db.collection('likes').find({}).toArray();
  
  return {
    statusCode: 200,
    body: JSON.stringify(likes)
  };
};