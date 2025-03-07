import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "../models/user.model.js";

const Subscription = sequelize.define(
  "Subscription",
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

// Relationships
User.belongsToMany(User, {
  as: "Authors",
  through: Subscription,
  foreignKey: "user_id",
  otherKey: "author_id",
  onDelete: "CASCADE",
});

User.belongsToMany(User, {
  as: "Subscribers",
  through: Subscription,
  foreignKey: "author_id",
  otherKey: "user_id",
  onDelete: "CASCADE",
});

export default Subscription;
