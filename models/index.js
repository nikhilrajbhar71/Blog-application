import { sequelize } from "../config/db.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Like from "../models/like.model.js";
import Subscription from "../models/subscription.model.js";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log(" Database synced successfully.");
  } catch (error) {
    console.error(" Error syncing database:", error);
  }
};

export { User, Category, Post, Comment, Like, Subscription, syncDatabase };
