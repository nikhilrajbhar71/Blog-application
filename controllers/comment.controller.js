import {
  createComment,
  createReplyOnComment,
  deleteCommentById,
  findCommentById,
  findCommentByPk,
  getCommentsByPostId,
  getRepliesByParentId,
  verifyCommentOwnerShip,
} from "../services/comment.service.js";

import responseHandler from "../utils/responseHandler.js";

export const comment = async (req, res, next) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user.id;
    const { comment } = req.body;

    const newComment = await createComment(post_id, comment, user_id);

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
    const parent_comment_id = req.params.id;
    const user_id = req.user.id;
    const { comment } = req.body;

    await findCommentById(parent_comment_id);

    await createReplyOnComment({ parent_comment_id, comment, user_id });

    return responseHandler(res, 200, "Comment added successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllReplies = async (req, res, next) => {
  try {
    const parent_comment_id = req.params.id;

    const replies = await getRepliesByParentId(parent_comment_id);

    return responseHandler(res, 200, "Replies fetched successfully", {
      replies,
    });
  } catch (error) {
    next(error);
  }
};
