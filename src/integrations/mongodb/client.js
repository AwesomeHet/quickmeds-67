import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/inventory_system";
const client = new MongoClient(uri);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db();
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export const getCollection = async (collectionName) => {
  const db = await connectDB();
  return db.collection(collectionName);
};