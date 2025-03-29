import express from "express";
import {
  getUser,
  login,
  logout,
  searchUser,
  userRegistration,
  getAllUsers,
} from "../controllers/user.controllers.js";
import authentication from "../middlewares/authentication.js";

const userRouter = express.Router();

userRouter.get("/:username", authentication, getUser);
userRouter.get("/users/all", authentication, getAllUsers);
userRouter.post("/register", userRegistration);
userRouter.post("/login", login);
userRouter.post("/logout", authentication, logout);
userRouter.get("/search/query", authentication, searchUser);

export default userRouter;
