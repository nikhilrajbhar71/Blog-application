import express from "express";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import postRoutes from "./routes/post.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/posts", postRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
