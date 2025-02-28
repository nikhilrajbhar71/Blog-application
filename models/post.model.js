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

export const getAll = async () => {
  const [posts] = await db.query("SELECT * FROM posts where is_published =?", [
    true,
  ]);
  return posts;
};
export const getPostById = async (id) => {
  const [post] = await db.query(`SELECT * FROM posts WHERE id=?`, [id]);
  return post;
};

export const like = async (post_id, user_id) => {
  const [post] = await db.query(
    `INSERT into likes (post_id,user_id) VALUES (?, ?)`,
    [post_id, user_id]
  );
  return post;
};
export const unlike = async (post_id, user_id) => {
  const [post] = await db.query(
    `DELETE FROM likes  where post_id=? AND user_id=?`,
    [post_id, user_id]
  );
  return post;
};
export const isLiked = async (post_id, user_id) => {
  const [likes] = await db.query(
    `SELECT * FROM likes WHERE post_id=? AND user_id=?`,
    [post_id, user_id]
  );


  return likes.length > 0;
};
