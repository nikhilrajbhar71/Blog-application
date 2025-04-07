import Comment from "../models/comment.model.js";

import responseHandler from "../utils/responseHandler.js";

export const comment = async (req, res, next) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user.id;
    const { comment } = req.body;

    const newcomment = await Comment.create({
      post_id,
      comment,
      user_id,
    });

    return responseHandler(res, 200, "Comment added successfully", {
      comment: newcomment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllComment = async (req, res, next) => {
  try {
    const post_id = req.params.id;

    const comments = await Comment.findAll({
      where: {
        post_id: post_id,
      },
    });

    return responseHandler(res, 200, "Comments fetched successfully", {
      comments,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  // TODO : author can delete comments on his posts as well
  try {
    const commentId = req.params.id;
    const comment = await Comment.findOne({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      return responseHandler(res, 404, "comment not found", {});
    }

    if (req.user.id != comment.user_id) {
      return responseHandler(res, 401, "Unauthorized", {});
    }
    await Comment.destroy({
      where: {
        id: commentId,
      },
    });

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
    const parentComment = await Comment.findByPk(parent_comment_id);
    if (!parentComment) {
      return responseHandler(res, 404, "comment not found", {});
    }
    await Comment.create({
      parent_comment_id,
      comment,
      user_id,
    });

    return responseHandler(res, 200, "Comment added successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllReplies = async (req, res, next) => {
  try {
    const parent_comment_id = req.params.id;

    const replies = await Comment.findAll({
      where: {
        parent_comment_id: parent_comment_id,
      },
    });

    return responseHandler(res, 200, "Replies fetched successfully", {
      replies,
    });
  } catch (error) {
    next(error);
  }
};
