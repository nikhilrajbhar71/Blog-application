import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255, 
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      maxlength: 255, 
    },
    password: {
      type: String,
      required: true,

    },
    role: {
      type: String,
      enum: ["viewer", "author", "admin"],
      default: "viewer", 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model("User", userSchema);

export default User;
