import db from "../config/db.js";

export const create = async (
  title,
  content,
  banner_image,
  author_id,
  category_id,
  is_published
) => {
  const [result] = await db.query(
    "INSERT INTO posts (title, content, banner_image, author_id,category_id,is_published) VALUES (?, ?, ?, ?,?,?)",
    [title, content, banner_image, author_id, category_id, is_published]
  );

  const [newUser] = await db.query("SELECT * FROM posts WHERE id = ?", [
    result.insertId,
  ]);

  return newUser[0];
};

export const update = async (id, status) => {
  const [result] = await db.query(
    "UPDATE posts SET is_published = ? WHERE id = ?",
    [status, id]
  );

  const [post] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);

  return post[0];
};
