import { Sequelize } from "sequelize";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
import AppError from "../utils/AppError.js";
import PostResource from "../resources/post.resource.js";
import CommentResource from "../resources/comment.resource.js";
import LikeResource from "../resources/like.resource.js";
import mongoose from "mongoose";
import { updatableFields } from "../config/constants.js";

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
  console.log(`limit is ${limit} AND page is ${page}`);
  const result = await Post.aggregate([
    { $match: filter },
    {
      $facet: {
        posts: [
          { $sort: { createdAt: -1 } },
          { $skip: parseInt((page - 1) * limit) },
          { $limit: parseInt(limit) },

          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "category",
            },
          },

          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },

          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "postId",
              as: "comments",
            },
          },
          {
            $addFields: {
              Comments: { $size: "$comments" },
            },
          },

          {
            $lookup: {
              from: "likes",
              localField: "_id",
              foreignField: "postId",
              as: "likes",
            },
          },
          {
            $addFields: {
              Likes: { $size: "$likes" },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const posts = result[0].posts;
  const totalCount = result[0].totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    posts: PostResource.collection(posts),
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
  const objectId = new mongoose.Types.ObjectId(id);

  const result = await Post.aggregate([
    { $match: { _id: objectId } },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "postId",
        as: "likes",
      },
    },
  ]);

  const post = result[0];
  if (!post) throw new AppError(404, "Post not found");

  return {
    post: new PostResource(post).exec(),
    comments: CommentResource.collection(post.comments),
    likes: LikeResource.collection(post.likes),
  };
};

export const updatePostService = async (reqBody, id) => {
  const updateData = {};
  console.log("body " + JSON.stringify(reqBody));
  updatableFields.forEach((field) => {
    if (reqBody[field] !== undefined) {
      updateData[field] = reqBody[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw new AppError(400, "No valid fields provided for update");
  }

  const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedPost) {
    throw new AppError(404, "Post not found");
  }
};
