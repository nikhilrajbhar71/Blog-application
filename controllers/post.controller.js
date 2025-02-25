import { create, update } from "../models/post.model.js";
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

    // Success response
    res.status(200).json({
      message: "Post status updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
