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
  const post = await Post.create({
    title,
    content,
    bannerImage,
    authorId,
    categoryId,
    isPublished,
  });
  return post;
};

export const findPostById = async (id) => {
  const post = await Post.findById(id);
  if (!post) throw new AppError(404, "Post not found");
  return post;
};

export const updatePostStatus = async (id) => {
  const post = await Post.findById(id);
  if (!post) throw new AppError(404, "Post not found");

  post.isPublished = !post.isPublished;
  await post.save();
};

export const deletePostById = async (id) => {
  await Post.findByIdAndUpdate(id, { isDeleted: true });
};

export const fetchAllPosts = async (page = 1, limit = 10, category, author) => {
  const filter = { isPublished: true, isDeleted: false };
  if (category) filter.categoryId = category;
  if (author) filter.authorId = author;

  const totalCount = await Post.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  const posts = await Post.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("categoryId", "name")
    .populate("authorId", "name")
    .lean();

  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const [Likes, Comments] = await Promise.all([
        Like.countDocuments({ postId: post._id }),
        Comment.countDocuments({ postId: post._id }),
      ]);

      return {
        ...post,
        Likes,
        Comments,
      };
    })
  );

  return {
    posts: PostResource.collection(postsWithCounts),
    currentPage: page,
    totalPages,
  };
};

export const togglePostLike = async (postId, userId) => {
  const existing = await Like.findOne({ postId, userId });

  if (existing) {
    await existing.deleteOne();
    return { liked: false };
  }

  await Like.create({ postId, userId });
  return { liked: true };
};

export const toggleCommentLike = async (commentId, userId) => {
  const existing = await Like.findOne({ commentId, userId });

  if (existing) {
    await existing.deleteOne();
    return { liked: false };
  }

  await Like.create({ commentId, userId });
  return { liked: true };
};

export const verifyPostOwnership = (post, userId) => {

  if (!post || post.authorId.toString() !== userId.toString()) {
    throw new AppError(401, "Unauthorized to perform this action");
  }
};

export const getLikesByPostId = async (postId) => {
  return await Like.find({ postId });
};

export const getPostWithDetails = async (id) => {
  const [post, comments, likes] = await Promise.all([
    Post.findById(id).lean(),
    Comment.find({ postId: id }).lean(),
    Like.find({ postId: id }).lean(),
  ]);

  if (!post) throw new AppError(404, "Post not found");

  return {
    post: new PostResource(post).exec(),
    comments: CommentResource.collection(comments),
    likes: LikeResource.collection(likes),
  };
};
