import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (error) {
    console.error(" Database connection failed:", error);
    process.exit(1);
  }
};

export { sequelize, dbConnection };
