import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import MessageModel from "../models/message.model.js";

import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userSockets = new Map();
const groupSockets = new Map();
export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`New client connected`);

    socket.on("login", async (token) => {
      try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        const { username } = decodedToken;
        const user = await UserModel.findOne({ username }).select("username");

        if (!user) {
          socket.emit("login-failure", "User not found");
          socket.disconnect();
          return;
        }

        const { _id } = user;
        const userId = _id.toString();

        userSockets.set(userId, socket.id);
      } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
          console.log("Token has expired");
        } else if (e instanceof jwt.JsonWebTokenError) {
          console.log("Invalid token");
        } else {
          console.log("Error during token verification", e);
        }
        socket.disconnect();
      }
    });

    socket.on("group-click", (groupId, userId) => {
      if (!groupSockets.has(groupId)) {
        groupSockets.set(groupId, new Set());
      }
      socket.join(groupId);
      groupSockets.get(groupId).add(userId);
      broadcastGroupJoin(io, groupId, userId);
    });

    socket.on("send-group-message", (sender, message, groupId) => {
      broadcastGroupMessage(io, sender, message, groupId);
    });

    socket.on("message", async (senderId, message, receiverId) => {
      const sender = await UserModel.findById(senderId).select("-password");
      broadcastNewMessage(io, message, sender, receiverId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

const broadcastGroupMessage = async (io, sender, message, groupId) => {
  io.to(groupId).emit("new-group-message", { sender, message, groupId });
  await MessageModel.create({
    sender: sender,
    message,
    group: groupId,
    readBy: [],
  });
};

const broadcastNewMessage = async (io, message, sender, receiverId) => {
  const targetSocketId = userSockets.get(receiverId);
  if (targetSocketId) {
    io.to(targetSocketId).emit("new-message", { message, sender });

    await MessageModel.create({
      sender: sender._id,
      message,
      receiver: receiverId,
    });
  } else {
    console.log("Receiver is not online");
    await MessageModel.create({
      sender: sender._id,
      message,
      receiver: receiverId,
    });
  }
};

const broadcastGroupJoin = (io, groupId, userId) => {
  io.to(groupId).emit("user-joined", { userId });
};
