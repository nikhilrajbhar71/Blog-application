import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255, // Equivalent to Sequelize's `STRING(255)`
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      maxlength: 255, // Maximum length for the email field
    },
    password: {
      type: String,
      required: true,

    },
    role: {
      type: String,
      enum: ["viewer", "author", "admin"], // Enum to restrict values
      default: "viewer", // Default value if not provided
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model("User", userSchema);

export default User;
