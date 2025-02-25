import mysql from "mysql2/promise"; 

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test@123",
});


await connection.query("CREATE DATABASE IF NOT EXISTS testdatabase");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "test@123",
  database: "testdatabase",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  const connection = await db.getConnection();
  console.log("Connected to MySQL!");
  connection.release();
} catch (err) {
  console.error("Database connection failed:", err);
}

export default db;
