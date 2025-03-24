import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// userRouter.get("/:username", getUser);
export const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    res
      .status(200)
      .json({ status: "success", message: "User found", data: { user } });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: "error", message: "Failed to get user. Try again" });
  }
};
// userRouter.post("/register", userRegistration);
export const userRegistration = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }
  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ username }, JWT_SECRET);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        username,
        token,
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: "error", message: "Failed to register user. Try again" });
  }
};
// userRouter.post("/login", login);
export const login = async (req, res) => {
  const { username, password } = req.body.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing username or password" });
  }
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({
      status: "success",
      message: "Login successful",
      data: { username, token },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Failed to login. Try again" });
  }
};
// userRouter.post("/logout", logout);
export const logout = async (req, res) => {
  res.json({ message: "Logout successful" });
};

export const searchUser = async (req, res) => {
  const { filterQuery } = req.query;
  if (!filterQuery || filterQuery.trim() === "") {
    return res.status(400).json({
      status: "error",
      message: "Search query is required",
    });
  }
  try {
    const results = await UserModel.find({
      username: { $regex: filterQuery, $options: "i" },
    }).select("username");
    if (results.length === 0) {
      return res.status(404).json({
        status: "success",
        message: "No users found with that name",
        data: {
          results: [],
        },
      });
    }
    res.status(200).json({
      status: "success",
      message: "Users Retrieved successfully",
      data: {
        results,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to search users. Try again",
    });
  }
};
