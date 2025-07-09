const { connectToDatabase } = require('./mongodb-client');

exports.handler = async (event) => {
  const { appName } = JSON.parse(event.body);
  const db = await connectToDatabase();
  
  const result = await db.collection('likes').findOneAndUpdate(
    { appName },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ newCount: result.value.count })
  };
};