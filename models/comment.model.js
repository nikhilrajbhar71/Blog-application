import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Comment.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Comment, { foreignKey: "userId" });

Comment.belongsTo(Post, { foreignKey: "postId", onDelete: "CASCADE" });
Post.hasMany(Comment, { foreignKey: "postId" });

Comment.belongsTo(Comment, {
  foreignKey: "parentCommentId",
  onDelete: "CASCADE",
});

export default Comment;
