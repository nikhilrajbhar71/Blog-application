import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

const Like = sequelize.define(
  "Like",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
  }
);


User.belongsToMany(Post, { through: Like, foreignKey: "user_id" });
Post.belongsToMany(User, { through: Like, foreignKey: "post_id" });

User.belongsToMany(Comment, { through: Like, foreignKey: "user_id" });
Comment.belongsToMany(User, { through: Like, foreignKey: "comment_id" });

export default Like;
