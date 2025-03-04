import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Connected to MySQL!");

    return connection;
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

const connection = await connectDB();

export default connection;
