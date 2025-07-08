const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
  });
  
  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('app_likes'))),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );
    
    const likes = result.data.reduce((acc, { data }) => {
      acc[data.app_name] = data.likes;
      return acc;
    }, {});
    
    return {
      statusCode: 200,
      body: JSON.stringify(likes)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.toString() })
    };
  }
};
