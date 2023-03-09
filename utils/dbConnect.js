const { MongoClient } = require("mongodb");

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

// check the MongoDB URI
if (!MONGO_CONNECTION_STRING) {
  throw new Error("Define the MONGO_CONNECTION_STRING environmental variable");
}

const connectToDatabase = async (dataBaseName, collectionName) => {
  // Connect to cluster
  const client = await MongoClient.connect(MONGO_CONNECTION_STRING);
  try {
    // Accessing the dataBase
    const db = client.db(dataBaseName);
    // Accessing the collection
    const yourCollection = db.collection(collectionName);

    console.log("successfully connected to database".cyan.underline);

    return yourCollection;
  } catch (error) {
    console.log(error.red.underline.bold);
  }
};

module.exports = connectToDatabase;
