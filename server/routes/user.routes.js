import express from "express";
import {
  getUser,
  login,
  logout,
  userRegistration,
} from "../controllers/user.controllers";

const userRouter = express.Router();

userRouter.get("/:username", getUser);
userRouter.post("/register", userRegistration);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

export default userRouter;
