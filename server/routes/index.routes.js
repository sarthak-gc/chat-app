import express from "express";
import userRouter from "./user.routes.js";
import groupRouter from "./group.routes.js";
import messageRouter from "./message.routes.js";
import notificationRouter from "./notification.routes.js";
import loggerMiddleware from "../middlewares/logger.js";

const router = express.Router();
router.use(loggerMiddleware);
router.use("/user", userRouter);
router.use("/group", groupRouter);
router.use("/message", messageRouter);
router.use("/notification", notificationRouter);

export default router;
