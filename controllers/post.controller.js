import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category_id, is_published } = req.body;
    const author_id = req.user.id;
    const banner_image = `/uploads/${req.file.filename}`;
    let is_publish = is_published == "true";

    const result = await Post.create({
      title,
      content,
      banner_image,
      author_id,
      category_id,
      is_publish,
    });

    responseHandler(res, 201, "Post created successfully", {
      post: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { is_published } = req.body;
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (post.author_id != req.user.id) {
      throw new AppError(401, "Unauthorized to update the post");
    }

    const updatedPost = await Post.update(
      { isPublished: is_published },
      { where: { id } }
    );

    return responseHandler(res, 200, "Post status updated successfully", {
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) {
      throw new AppError(404, "Post not found");
    }
    if (post.author_id != req.user.id) {
      throw new AppError(401, "Unauthorized to delete post");
    }

    const deletedPost = await Post.update(
      { isDeleted: true },
      { where: { id } }
    );

    return responseHandler(res, 200, "Post status deleted successfully", {
      post: deletedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: {
        isPublished: true,
        isDeleted: false,
      },
    });

    return responseHandler(res, 200, "All posts fetched successfully", {
      posts,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id);
    if (!post) {
      throw new AppError(404, "post not found");
    }
    return responseHandler(res, 200, "post fetched successfully", { post });
  } catch (error) {
    next(error);
  }
};

export const likePostAndComment = async (req, res, next) => {
  try {
    const { id, type } = req.query;
    const user_id = req.user.id;

    if (type == "post") {
      const post = await Post.findOne({
        where: { id: id },
      });
      if (!post) {
        throw new AppError(404, "post not found");
      }

      const PostLikedAlready = await Like.findOne({
        where: { postId: id, userId: user_id },
      });

      if (PostLikedAlready) {
        const deletedLike = await Like.destroy({
          where: {
            userId: user_id,
            postId: id,
          },
        });
        if (!deletedLike) {
          throw new AppError(500, "Failed to unlike post");
        }
        return responseHandler(res, 200, "Post unliked successfully", {
          post: post,
        });
      }

      const likedPost = await Like.create({
        postId: id,
        userId: user_id,
      });
      if (!likedPost) {
        return responseHandler(res, 404, "post not found");
      }

      return responseHandler(res, 201, "Post liked successfully", {
        post: likedPost,
      });
    } else {
      const comment = await Comment.findOne({
        where: { id: id },
      });
      if (!comment) {
        throw new AppError(404, "comment not found");
      }
      const CommentLikedAlready = await Like.findOne({
        where: { commentId: id, userId: user_id },
      });

      if (CommentLikedAlready) {
        const deletedLike = await Like.destroy({
          where: {
            userId: user_id,
            commentId: id,
          },
        });
        if (!deletedLike) {
          throw new AppError(500, "Failed to unlike post");
        }
        return responseHandler(res, 200, "comment unliked successfully", {
          deletedLike,
        });
      }

      const likedComment = await Like.create({
        commentId: id,
        userId: user_id,
      });
      if (!likedComment) {
        return responseHandler(res, 404, "comment not found");
      }

      return responseHandler(res, 200, "comment liked successfully", {
        likedComment,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const comment = async (req, res) => {
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
