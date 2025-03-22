import express from "express";
import {
  getUser,
  login,
  logout,
  searchUser,
  userRegistration,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/:username", getUser);
userRouter.post("/register", userRegistration);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/search", searchUser);

export default userRouter;
