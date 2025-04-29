import { notifySubscribers } from "../utils/notifySubscriber.js";
import responseHandler from "../utils/responseHandler.js";
import {
  createNewPost,
  deletePostById,
  fetchAllPosts,
  findPostById,
  getLikesByPostId,
  getPostWithDetails,
  toggleCommentLike,
  togglePostLike,
  updatePostStatus,
  verifyPostOwnership,
} from "../services/post.service.js";
import { getCommentsByPostId } from "../services/comment.service.js";
import PostResource from "../resources/post.resource.js";

export const createPost = async (req, res, next) => {
  try {
    const { title, content, categoryId, isPublished } = req.body;
    const authorId = req.user.id;
    if (!req.file) {
      return responseHandler(res, 400, "Banner image is required");
    }
    const bannerImage = req.file.location;
    console.log("image " + JSON.stringify(bannerImage));
    const post = await createNewPost({
      title,
      content,
      bannerImage,
      authorId,
      categoryId,
      isPublished,
    });
    console.log("post " + JSON.stringify(post));

    notifySubscribers(req.user, title, content);

    responseHandler(
      res,
      200,
      "Post created successfully",
      new PostResource(post).exec()
    );
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await findPostById(id);

    verifyPostOwnership(post, req.user._id);
    await updatePostStatus(id);

    return responseHandler(res, 200, "Post status updated successfully", {});
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await findPostById(req.params.id);

    verifyPostOwnership(post, req.user._id);

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

    // doubt : post.service is return json, that's why used postResource inside post.service
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

    const postDetails = await getPostWithDetails(id);

    return responseHandler(res, 200, "post fetched successfully", {
      postDetails,
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
    return responseHandler(res, liked ? 200 : 200, message, {});
  } catch (error) {
    next(error);
  }
};
