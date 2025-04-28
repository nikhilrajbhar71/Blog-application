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
  foreignKey: "userId",
  otherKey: "authorId",
  onDelete: "CASCADE",
});

User.belongsToMany(User, {
  as: "Subscribers",
  through: Subscription,
  foreignKey: "authorId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

export default Subscription;
