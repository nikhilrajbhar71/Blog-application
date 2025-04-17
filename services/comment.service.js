import Comment from "../models/comment.model.js";
import AppError from "../utils/AppError.js";

export const createComment = async (post_id, comment, user_id) => {
  return await Comment.create({
    post_id,
    comment,
    user_id,
  });
};

export const getCommentsByPostId = async (post_id) => {
  return await Comment.findAll({
    where: { post_id },
  });
};

export const findCommentById = async (id) => {
  const comment = await Comment.findOne({ where: { id } });
  if (!comment) {
    throw new AppError(404, "Post not found");
  }
  return comment;
};

export const deleteCommentById = async (id) => {
  return await Comment.destroy({ where: { id } });
};

export const findCommentByPk = async (id) => {
  return await Comment.findByPk(id);
};

export const createReplyOnComment = async ({
  parent_comment_id,
  comment,
  user_id,
}) => {
  return await Comment.create({
    parent_comment_id,
    comment,
    user_id,
  });
};

export const getRepliesByParentId = async (parent_comment_id) => {
  return await Comment.findAll({
    where: { parent_comment_id },
  });
};

export const verifyCommentOwnerShip = (userId, comment) => {
  if (userId !== comment.user_id) {
    throw new AppError(401, "Unauthorized");
  }
};
