import Like from "../models/like.model.js";
import Post from "../models/post.model.js";
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
    const result = await Post.create({
      title,
      content,
      banner_image,
      author_id,
      category_id,
      is_publish,
    });
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
    const post = await Post.findByPk(id);
    if (!post) {
      throw new AppError(404, "Post not found");
    }
    if (post.author_id != req.user.id) {
      throw new AppError(401, "Unauthorized to update post");
    }
    console.log("post" + JSON.stringify(post));

    console.log("req use " + JSON.stringify(req.user));

    const updatedPost = await Post.update(
      { isPublished: is_published },
      { where: { id } }
    );

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
    const posts = await Post.findAll({
      isPublished: true,
    });
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
    const post = await Post.findByPk(id);
    console.log(JSON.stringify(post));
    if (!post) {
      throw new AppError(404, "post not found");
    }
    return responseHandler(res, 200, "post fetched successfully", { post });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const { post_id } = req.params;
    const user_id = req.user.id;

    const post = await Post.findOne({
      where: { id: post_id },
    });
    console.log("post " + JSON.stringify(post));
    if (!post) {
      throw new AppError(404, "post not found");
    }

    const PostLikedAlready = await Like.findOne({
      where: { post_id, user_id },
    });

    if (PostLikedAlready) {
      const deletedLike = await Like.destroy({
        where: {
          user_id: user_id,
          post_id: post_id,
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
      post_id,
      user_id,
    });
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
