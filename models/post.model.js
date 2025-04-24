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
      allowNull: false,
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

Post.belongsTo(User, { foreignKey: "authorId", onDelete: "SET NULL" });
User.hasMany(Post, { foreignKey: "authorId" });

Post.belongsTo(Category, { foreignKey: "categoryId", onDelete: "SET NULL" });
Category.hasMany(Post, { foreignKey: "categoryId" });

export default Post;
