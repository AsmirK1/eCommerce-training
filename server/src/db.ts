import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string);
let db: Db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db("BAA"); // your database name
    console.log("✅ Connected to MongoDB (BAA)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error("❌ Database not connected yet!");
  return db;
}

