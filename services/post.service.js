import { Sequelize } from "sequelize";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/AppError.js";
import PostResource from "../resources/post.resource.js";
import { getCommentsByPostId } from "./comment.service.js";
import CommentResource from "../resources/comment.resource.js";
import LikeResource from "../resources/like.resource.js";

export const createNewPost = async ({
  title,
  content,
  bannerImage,
  authorId,
  categoryId,
  isPublished,
}) => {
  return await Post.create({
    title,
    content,
    bannerImage,
    authorId,
    categoryId,
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

  if (category) whereCondition.categoryId = category;
  if (author) whereCondition.authorId = author;

  const totalCount = await Post.count({ where: whereCondition });
  const totalPages = Math.ceil(totalCount / limit);

  const posts = await Post.findAll({
    limit,
    offset,
    where: whereCondition,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment", "userId", "createdAt"],
      },
      {
        model: Like,
        attributes: ["id", "userId", "createdAt"],
      },
    ],
  });

  const formattedPosts = posts.map((post) => {
    const postJson = post.toJSON();
    return {
      ...postJson,
      likesCount: postJson.Likes?.length || 0,
      commentsCount: postJson.Comments?.length || 0,
    };
  });

  return {
    posts: PostResource.collection(formattedPosts),
    currentPage: page,
    totalPages,
  };
};

export const toggleCommentLike = async (commentId, userId) => {
  const comment = await Comment.findByPk(commentId);
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
  const post = await Post.findByPk(postId);
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
  if (!post || post.authorId !== userId.id) {
    throw new AppError(401, "Unauthorized to perform this action");
  }
};

export const getLikesByPostId = async (postId) => {
  return await Like.findAll({
    where: { postId },
  });
};




export const getPostWithDetails = async (id) => {
  const [post, comments, likes] = await Promise.all([
    findPostByPk(id),
    getCommentsByPostId(id),
    getLikesByPostId(id),
  ]);

  const formattedPost = new PostResource(post).exec();
  const formattedComments = CommentResource.collection(comments);
  const formattedLikes = LikeResource.collection(likes);

  return {
    post: formattedPost,
    likes: formattedLikes,
    comments: formattedComments,
  };
};
