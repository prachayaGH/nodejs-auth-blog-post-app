import { MongoClient } from "mongodb";

const connectionString = "mongodb://localhost:27017";

export const client = new MongoClient(connectionString, {
  useUnifiedTopology: true,
});

export let db;

try {
  await client.connect(); // เชื่อมต่อกับ MongoDB
  db = client.db("practice-mongo"); // กำหนด database ที่จะใช้
  console.log("✅ Connected to MongoDB successfully.");
} catch (error) {
  console.error("❌ Failed to connect to MongoDB:", error);
}