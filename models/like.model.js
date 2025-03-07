import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./user.model.js";
import Post from "./post.model.js";
import Comment from "./comment.model.js";

const Like = sequelize.define(
  "Like",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true, // NULL if it's a comment like
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true, // NULL if it's a post like
    },
  },
  {
    timestamps: true,
  }
);


User.hasMany(Like, { foreignKey: "userId", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "userId" });

Post.hasMany(Like, { foreignKey: "postId", onDelete: "CASCADE" });
Like.belongsTo(Post, { foreignKey: "postId" });

Comment.hasMany(Like, { foreignKey: "commentId", onDelete: "CASCADE" });
Like.belongsTo(Comment, { foreignKey: "commentId" });

export default Like;
