import express from "express";
import {
  deleteGroupMessage,
  deleteMessage,
  sendGroupMessage,
  sendMessage,
  getGroupMessages,
  getMessages,
  getNewGroupMessages,
  getNewMessage,
} from "../controllers/message.controllers.js";

const messageRouter = express.Router();

//send messages
messageRouter.post("/:senderId/to/:receiverId", sendMessage);
messageRouter.post("/:senderId/to/:groupId", sendGroupMessage);

// delete messages
messageRouter.delete("/:messageId", deleteMessage);
messageRouter.delete("/:messageId/group/:groupId", deleteGroupMessage);

// receive messages

// get old messages for new users + while reloading
messageRouter.get("/:groupId", getGroupMessages);
messageRouter.get("/:senderId", getMessages);

// mark as read here for new messages as fallback
// mostly will try to handle new messages using socket.io

messageRouter.get("/:groupId/new", getNewGroupMessages);
messageRouter.get("/:senderId/new", getNewMessage);

export default messageRouter;
