import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bannerImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);


Post.belongsTo(User, { foreignKey: "author_id", onDelete: "SET NULL" });
User.hasMany(Post, { foreignKey: "author_id" });

Post.belongsTo(Category, { foreignKey: "category_id", onDelete: "SET NULL" });
Category.hasMany(Post, { foreignKey: "category_id" });

export default Post;
