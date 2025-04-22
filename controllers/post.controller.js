import { notifySubscribers } from "../utils/notifySubscriber.js";
import responseHandler from "../utils/responseHandler.js";
import {
  createNewPost,
  deletePostById,
  fetchAllPosts,
  findPostByPk,
  getLikesByPostId,
  toggleCommentLike,
  togglePostLike,
  updatePostStatus,
  verifyPostOwnership,
} from "../services/post.service.js";
import { getCommentsByPostId } from "../services/comment.service.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, categoryId, isPublished } = req.body;
    const authorId = req.user.id;
    if (!req.file) {
      return responseHandler(res, 400, "Banner image is required");
    }
    const bannerImage = req.file.location;
    const post = await createNewPost({
      title,
      content,
      bannerImage,
      authorId,
      categoryId,
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
    const post = await findPostByPk(id);

    verifyPostOwnership(post, req.user);
    await updatePostStatus(id);

    return responseHandler(res, 200, "Post status updated successfully", {});
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await findPostByPk(req.params.id);

    verifyPostOwnership(post, req.user);

    await deletePostById(req.params.id);

    return responseHandler(res, 200, "Post status deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const getAllPost = async (req, res, next) => {
  try {
    let { page, limit, category, author } = req.query;

    const posts = await fetchAllPosts(page, limit, category, author);

    return responseHandler(res, 200, "All posts fetched successfully", {
      ...posts,
    });
  } catch (error) {
    next(error);
  }
};
export const getPost = async (req, res, next) => {
  try {
    const id = req.params.id;

    const [post, comments, likes] = await Promise.all([
      findPostByPk(id),
      getCommentsByPostId(id),
      getLikesByPostId(id),
    ]);

    return responseHandler(res, 200, "post fetched successfully", {
      post,
      comments,
      likes,
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { liked } = await toggleCommentLike(id, userId);

    const message = liked
      ? "comment liked successfully"
      : "comment unliked successfully";
    return responseHandler(res, 200, message, {});
  } catch (error) {
    next(error);
  }
};
export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const { liked } = await togglePostLike(id, user_id);

    const message = liked
      ? "Post liked successfully"
      : "Post unliked successfully";
    return responseHandler(res, liked ? 201 : 200, message, {});
  } catch (error) {
    next(error);
  }
};
