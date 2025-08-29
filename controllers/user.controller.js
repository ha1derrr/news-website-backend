import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import validator from "validator";

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  };

  res.cookie("token", token, cookieOptions);

  const userWithoutSensitiveData = user.toObject();
  delete userWithoutSensitiveData.password;
  delete userWithoutSensitiveData.__v;

  res
    .status(statusCode)
    .json(
      new ApiResponse(
        statusCode,
        { user: userWithoutSensitiveData, token },
        "Authentication successful"
      )
    );
};
export const signup = catchAsync(async (req, res, next) => {
  const { name, username, email, password, avatar } = req.body;

  if (!name || !username || !email || !password) {
    throw new ApiError(
      400,
      "Please provide name, username, email, and password for signup."
    );
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long.");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    if (existingUser.username === username) {
      throw new ApiError(
        409,
        "Username already taken. Please choose a different one."
      );
    }
    if (existingUser.email === email) {
      throw new ApiError(
        409,
        "Email already registered. Please use a different email or login."
      );
    }
  }

  const newUser = await User.create({
    name,
    username,
    email,
    password,
    avatar: avatar || "",
  });

  sendTokenResponse(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password for login.");
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  sendTokenResponse(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
};

export const getMe = catchAsync(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user },
        "User profile fetched successfully."
      )
    );
});

export const updateMe = catchAsync(async (req, res) => {
  if (req.body.password) {
    throw new ApiError(400, "Password updates are not allowed on this route.");
  }

  const filteredBody = {};
  const allowedFields = ["name", "username", "email"];
  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      filteredBody[field] = req.body[field];
    }
  });

  if (req.body.avatarUrl) {
    filteredBody.avatar = req.body.avatarUrl;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select("-password -__v");

  if (!updatedUser) {
    throw new ApiError(404, "User not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "User profile updated successfully."
      )
    );
});
