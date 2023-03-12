const { MongoClient } = require('mongodb');

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

// check the MongoDB URI
if (!MONGO_CONNECTION_STRING) {
  throw new Error("Define the MONGO_CONNECTION_STRING environmental variable");
}

const client = new MongoClient(MONGO_CONNECTION_STRING, {
  useUnifiedTopology: true,
});

let db;
let collection;

const connectToDB = async () => {
    try {
      await client.connect();
      console.log('Connected to MongoDB'.cyan.underline.bold);
      db = client.db(process.env.DB_NAME);
      collection = db.collection(process.env.USERS_COLLECTION_NAME);
    } catch (error) {
      console.log(error);
    }
}

const getCollection=() => {
    return collection;
}

module.exports = { connectToDB, getCollection };
