import { Sequelize } from "sequelize";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/AppError.js";

export const createNewPost = async ({
  title,
  content,
  bannerImage,
  author_id,
  category_id,
  isPublished,
}) => {
  return await Post.create({
    title,
    content,
    bannerImage,
    author_id,
    category_id,
    isPublished,
  });
};

export const findPostByPk = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new AppError(404, "Post not found");
  }
  return post;
};

export const updatePostStatus = async (id) => {
  await Post.update(
    { isPublished: Sequelize.literal("NOT isPublished") },
    { where: { id } }
  );
};

export const deletePostById = async (id) => {
  await Post.update({ isDeleted: true }, { where: { id } });
};

export const fetchAllPosts = async (page, limit, category, author) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const whereCondition = {
    isPublished: true,
    isDeleted: false,
  };

  if (category) whereCondition.category_id = category;
  if (author) whereCondition.author_id = author;

  return await Post.findAll({
    limit,
    offset,
    where: whereCondition,
    order: [["createdAt", "DESC"]],
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
  });
};

export const toggleCommentLike = async (commentId, userId) => {
  const comment = await Comment.findOne({ where: { id: commentId } });
  if (!comment) throw new AppError(404, "comment not found");

  const alreadyLiked = await Like.findOne({ where: { commentId, userId } });

  if (alreadyLiked) {
    await Like.destroy({ where: { commentId, userId } });
    return { liked: false };
  }

  await Like.create({ commentId, userId });
  return { liked: true };
};

export const togglePostLike = async (postId, userId) => {
  const post = await Post.findOne({ where: { id: postId } });
  if (!post) throw new AppError(404, "post not found");

  const alreadyLiked = await Like.findOne({ where: { postId, userId } });

  if (alreadyLiked) {
    await Like.destroy({ where: { postId, userId } });
    return { liked: false };
  }

  await Like.create({ postId, userId });
  return { liked: true };
};

export const verifyPostOwnership = (post, userId) => {
  if (!post || post.author_id !== userId) {
    throw new AppError(401, "Unauthorized to perform this action");
  }
};
