import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
