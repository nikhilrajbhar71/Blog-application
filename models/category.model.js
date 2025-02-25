import db from "../config/db.js";
export const create = async (name, author_id) => {
  const [result] = await db.query(
    `INSERT INTO categories (name, author_id) VALUES  (?, ?)`,
    [name, author_id]
  );

  const [rows] = await db.query(
    `SELECT id, name, author_id FROM categories WHERE id = ?`,
    [result.insertId]
  );

  return rows[0];
};

export const getAll = async (author_id) => {
  const categories = await db.query(
    "SELECT * FROM categories where author_id =?",
    [author_id]
  );
  return categories[0];
};
