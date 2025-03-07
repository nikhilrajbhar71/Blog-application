import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "../models/user.model.js";

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

Category.belongsTo(User, { foreignKey: "author_id", onDelete: "CASCADE" });
User.hasMany(Category, { foreignKey: "author_id" });

export default Category;
