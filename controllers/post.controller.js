import {
  addComment,
  create,
  getAll,
  getPostById,
  isLiked,
  like,
  unlike,
  update,
} from "../models/post.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";
export const createPost = async (req, res) => {
  try {
    const { title, content, category_id, is_published } = req.body;
    const author_id = req.user.id;
    const banner_image = `/uploads/${req.file.filename}`;
    console.log("banner image: " + banner_image);
    let is_publish = false;
    if (is_published == "true") {
      is_publish = true;
    } else {
      is_publish = false;
    }
    const result = await create(
      title,
      content,
      banner_image,
      author_id,
      category_id,
      is_publish
    );
    if (result) {
      return responseHandler(res, 200, "Post created successfully", {
        post: result,
      });
    } else {
      return responseHandler(res, 401, "Failed to create post");
    }
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    console.log("here");
    const { is_published } = req.body;
    const { id } = req.params;
    let status = false;
    if (is_published == "true") {
      status = true;
    } else {
      status = false;
    }

    const updatedPost = await update(id, status);

    if (!updatedPost) {
      throw new AppError(404, "Post not found");
    }

    return responseHandler(res, 200, "Post status updated successfully", {
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await getAll();
    if (!posts) {
      return responseHandler(res, 404, "No posts found");
    }
    return responseHandler(res, 200, "OK", { posts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await getPostById(id);
    console.log(JSON.stringify(post));
    if (post.length === 0) {
      throw new AppError(404, "post not found");
    }
    return responseHandler(res, 200, "post fetched successfully", { post });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const post = await getPostById(id);
    if (!post) {
      throw new AppError(404, "post not found");
    }
    console.log(`user id is ${user_id} and post id ${id}`);
    if (await isLiked(id, user_id)) {
      const unlikedPost = unlike(id, user_id);

      return responseHandler(res, 200, "Post unliked successfully", {
        post: unlikedPost,
      });
    }
    const likedPost = await like(id, user_id);
    if (!likedPost) {
      return responseHandler(res, 404, "post not found");
    }

    return responseHandler(res, 200, "Post liked successfully", {
      post: likedPost,
    });
  } catch (error) {
    next(error);
  }
};

export const comment = async (req, res) => {
  try {
    const post_id = req.params.id;
    const user_id = req.user.id;
    const { comment } = req.body;
    const addcomment = await addComment(post_id, comment, user_id);
    if (!addcomment) {
      return responseHandler(res, 404, "Failed to comment");
    }
    return responseHandler(res, 200, "Comment added successfully", {
      comment: addcomment,
    });
  } catch (error) {
    next(error);
  }
};
