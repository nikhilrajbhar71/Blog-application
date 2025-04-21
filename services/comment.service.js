import Comment from "../models/comment.model.js";
import AppError from "../utils/AppError.js";

export const createComment = async (postId, comment, userId) => {
  return await Comment.create({
    postId,
    comment,
    userId,
  });
};

export const getCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { postId },
  });
};

export const findCommentById = async (id) => {
  const comment = await Comment.findByPk(id);
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }
  return comment;
};

export const deleteCommentById = async (id) => {
  return await Comment.destroy({ where: { id } });
};

export const findCommentByPk = async (id) => {
  const comment =  await Comment.findByPk(id);
};

export const createReplyOnComment = async ({
  parentCommentId,
  comment,
  userId,
}) => {
  return await Comment.create({
    parentCommentId,
    comment,
    userId,
  });
};

export const getRepliesByParentId = async (parentCommentId) => {
  return await Comment.findAll({
    where: { parentCommentId },
  });
};

export const verifyCommentOwnerShip = (userId, comment) => {
  if (userId !== comment.userId) {
    throw new AppError(401, "Unauthorized");
  }
};
