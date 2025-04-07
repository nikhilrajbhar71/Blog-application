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

Comment.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Comment, { foreignKey: "user_id" });

Comment.belongsTo(Post, { foreignKey: "post_id", onDelete: "CASCADE" });
Post.hasMany(Comment, { foreignKey: "post_id" });

Comment.belongsTo(Comment, {
  foreignKey: "parent_comment_id",
  onDelete: "CASCADE",
});

export default Comment;
