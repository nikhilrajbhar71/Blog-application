import { Sequelize } from "sequelize";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/AppError.js";
import { notifySubscribers } from "../utils/notifySubscriber.js";
import responseHandler from "../utils/responseHandler.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category_id, isPublished } = req.body;
    const author_id = req.user.id;
    console.log("req fil e" + JSON.stringify(req.file));
    const bannerImage = req.file.location;
    if (!req.file) {
      return responseHandler(res, 400, "Banner image is required");
    }
    const post = await Post.create({
      title,
      content,
      bannerImage,
      author_id,
      category_id,
      isPublished,
    });

    notifySubscribers(req.user, title, content);

    responseHandler(res, 201, "Post created successfully", {
      post,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (post.author_id != req.user.id) {
      throw new AppError(401, "Unauthorized to update the post");
    }

    const updatedPost = await Post.update(
      { isPublished: Sequelize.literal("NOT isPublished") },
      { where: { id } }
    );

    return responseHandler(res, 200, "Post status updated successfully", {});
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

    return responseHandler(res, 200, "Post status deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllPost = async (req, res, next) => {
  try {
    let { page, limit, category, author } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;
    const whereCondition = {
      isPublished: true,
      isDeleted: false,
    };

    if (category) {
      whereCondition.category_id = category;
    }

    if (author) {
      whereCondition.author_id = author;
    }
    const posts = await Post.findAll({
      limit: limit,
      offset: offset,
      include: [
        {
          model: Comment,
          attributes: ["id", "comment", "user_id", "createdAt"],
        },
        {
          model: Like,
          attributes: ["id", "userId", "createdAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
      where: whereCondition,
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
    //TODO : we can send all related likes and comments
    const post = await Post.findByPk(id);
    if (!post) {
      throw new AppError(404, "post not found");
    }
    return responseHandler(res, 200, "post fetched successfully", { post });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

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

      return responseHandler(res, 200, "comment unliked successfully", {});
    }

    const likedComment = await Like.create({
      commentId: id,
      userId: user_id,
    });

    return responseHandler(res, 200, "comment liked successfully", {});
  } catch (error) {
    next(error);
  }
};
export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
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
      await Like.destroy({
        where: {
          userId: user_id,
          postId: id,
        },
      });

      return responseHandler(res, 200, "Post unliked successfully", {});
    }

    const likedPost = await Like.create({
      postId: id,
      userId: user_id,
    });

    return responseHandler(res, 201, "Post liked successfully", {});
  } catch (error) {
    next(error);
  }
};
