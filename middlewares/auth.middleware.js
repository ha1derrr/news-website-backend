import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import User from "../models/user.model.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(
      401,
      "You are not logged in! Please log in to get access."
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select("-password -__v");
  if (!currentUser) {
    throw new ApiError(
      401,
      "The user belonging to this token no longer exists."
    );
  }

  req.user = currentUser;
  next();
});
