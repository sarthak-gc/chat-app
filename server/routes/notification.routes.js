import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotification,
  getUserNotifications,
  markAsRead,
  markAsUnread,
} from "../controllers/notification.controllers.js";

const notificationRouter = express.Router();

notificationRouter.post("/create", createNotification);
notificationRouter.get("/:notificationId", getNotification);
notificationRouter.get("/:userId", getUserNotifications);
notificationRouter.put("/:notificationId/read/:userId", markAsRead);
notificationRouter.delete("/:notificationId/delete/", deleteNotification);
notificationRouter.put("/:notificationId/unread/:userId", markAsUnread);

export default notificationRouter;
