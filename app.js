import express from "express";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";

import dotenv from "dotenv";
import errorMiddleware from "./middleware/errorMiddleware.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use("/api/subscriptions", subscriptionRoutes);

app.use(errorMiddleware);

export default app;
