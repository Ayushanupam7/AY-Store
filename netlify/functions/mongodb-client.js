const { MongoClient } = require('mongodb');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDb = client.db(); // Uses the database name from your connection string
  return cachedDb;
}

module.exports = { connectToDatabase };