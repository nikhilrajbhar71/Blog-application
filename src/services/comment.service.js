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
  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })
    .lean();
  return comments;
};

export const findCommentById = async (id) => {
  const comment = await Comment.findById(id).lean();
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }
  return comment;
};

export const deleteCommentById = async (id) => {
  return await Comment.findByIdAndDelete(id);
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
  return await Comment.find({ parentCommentId }).sort({ createdAt: -1 }).lean();
};

export const verifyCommentOwnerShip = (userId, comment) => {
  if (String(userId) !== String(comment.userId)) {
    throw new AppError(401, "Unauthorized");
  }
};
