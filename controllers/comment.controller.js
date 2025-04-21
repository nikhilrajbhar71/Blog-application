import {
  createComment,
  createReplyOnComment,
  deleteCommentById,
  findCommentById,
  getCommentsByPostId,
  getRepliesByParentId,
  verifyCommentOwnerShip,
} from "../services/comment.service.js";
import { findPostByPk } from "../services/post.service.js";

import responseHandler from "../utils/responseHandler.js";

export const comment = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;
    await findPostByPk(postId);
    const newComment = await createComment(postId, comment, userId);

    return responseHandler(res, 200, "Comment added successfully", {
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComment = async (req, res, next) => {
  try {
    const post_id = req.params.id;

    const comments = await getCommentsByPostId(post_id);

    return responseHandler(res, 200, "Comments fetched successfully", {
      comments,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const comment = await findCommentById(commentId);

    // TODO: Allow post author to delete comments on their post
    verifyCommentOwnerShip(req.user.id, comment);

    await deleteCommentById(commentId);

    return responseHandler(res, 200, "Comment deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const ReplyOnComment = async (req, res, next) => {
  try {
    const parentCommentId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    await findCommentById(parentCommentId);

    await createReplyOnComment({ parentCommentId, comment, userId });

    return responseHandler(res, 200, "Comment added successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllReplies = async (req, res, next) => {
  try {
    const parentCommentId = req.params.id;
    await findCommentById(parentCommentId);
    const replies = await getRepliesByParentId(parentCommentId);

    return responseHandler(res, 200, "Replies fetched successfully", {
      replies,
    });
  } catch (error) {
    next(error);
  }
};
