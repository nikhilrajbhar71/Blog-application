import db from "../config/db.js";

export const createPost = async () => {
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, password, role]
  );

  const [newUser] = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [result.insertId]
  );

  return newUser[0];
};

export const getUsers = async () => {
  const sql = "SELECT * FROM users";
  const [rows] = await db.query(sql);
  return rows;
};

export const getUserById = async (id) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  const [rows] = await db.query(sql, [id]);
  return rows[0];
};
export const getUserByEmail = async (email) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  const row = await db.query(sql, [email]);

  return row;
};

export const updateUserAge = async (id, age) => {
  const sql = "UPDATE users SET age = ? WHERE id = ?";
  await db.query(sql, [age, id]);
};

export const deleteUser = async (id) => {
  const sql = "DELETE FROM users WHERE id = ?";
  await db.query(sql, [id]);
};
