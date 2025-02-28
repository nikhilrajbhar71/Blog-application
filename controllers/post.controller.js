import {
  create,
  getAll,
  getPostById,
  isLiked,
  like,
  unlike,
  update,
} from "../models/post.model.js";
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
      return res.status(201).json({
        message: "Post created successfully",
        post: result,
      });
    } else {
      return res.status(500).json({ message: "Failed to create post" });
    }
  } catch (error) {
    console.log("error creating post", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateStatus = async (req, res) => {
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
    if (!id || status === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedPost = await update(id, status);

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post status updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await getAll();
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error getting all posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await getPostById(id);
    return res.status(200).json({
      message: "post fetched successfully",
      post,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const post = await getPostById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    console.log(`user id is ${user_id} and post id ${id}`);
    if (await isLiked(id, user_id)) {
      const unlikedPost = unlike(id, user_id);
      return res.status(200).json({
        message: "Post unliked successfully",
        post: unlikedPost,
      });
    }
    const likedPost = await like(id, user_id);
    if (!likedPost) {
      return res.status(404).json({ message: "post not found" });
    }
    return res.status(200).json({
      message: "Post liked successfully",
      post: likedPost,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
