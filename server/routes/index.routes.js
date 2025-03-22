import express from "express";
import userRouter from "./user.routes";
import groupRouter from "./group.routes";
import messageRouter from "./message.routes";
import notificationRouter from "./notification.routes";

const router = express.Router();

router.use("/user", userRouter);
router.use("/group", groupRouter);
router.use("/message", messageRouter);
router.use("/notification", notificationRouter);

export default router;
