import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";
import userRoutes from "./routes/user.route.js"; // <-- Import the single user router
import newsRoutes from "./routes/news.route.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("News Website Backend API is running!");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/news", newsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
});
export default app;
