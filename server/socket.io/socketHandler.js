import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import MessageModel from "../models/message.model.js";

import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userSockets = new Map();

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

        broadcastOnlineUser(io, username, true);

        console.log("user connected : ", userId, "socket id : ", socket.id);
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

    socket.on("join-group", (groupId, userId) => {
      socket.join(groupId);
      handleGroupJoin(io, groupId, userId);
      broadcastGroupJoin(io, groupId, userId);
    });

    socket.on("send-group-message", (message, groupId) => {
      broadcastGroupMessage(io, message, groupId);
    });

    socket.on("remove-group-message", (messageId, groupId) => {
      broadcastRemoveMessage(io, messageId, groupId);
    });

    socket.on("leave-group", (groupId, userId) => {
      socket.leave(groupId);
      broadcastGroupLeave(io, groupId, userId);
    });

    socket.on("message", (senderId, message, receiverId) => {
      broadcastNewMessage(io, message, senderId, receiverId);
    });

    socket.on("logout", (userId) => {
      broadcastOnlineUser(io, userId, false);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

const handleGroupJoin = (io, groupId, userId) => {
  io.to(groupId).emit("user-joined", { userId });
};
const broadcastGroupLeave = (io, groupId, userId) => {
  io.to(groupId).emit("user-left", { userId });
};
const broadcastGroupMessage = (io, message, groupId) => {
  io.to(groupId).emit("new-message", message);
};

const broadcastRemoveMessage = (io, messageId, groupId) => {
  io.to(groupId).emit("remove-message", messageId);
};

const broadcastNewMessage = async (io, message, senderId, receiverId) => {
  const targetSocketId = userSockets.get(receiverId);
  console.log(message);
  console.log(senderId, " senderId");
  if (targetSocketId) {
    console.log(targetSocketId);
    io.to(targetSocketId).emit("new-message", { message, senderId });
    await MessageModel.create({
      sender: senderId,
      message,
      receiver: receiverId,
    });
  } else {
    console.log("Receiver is not online");
    await MessageModel.create({
      sender: senderId,
      message,
      receiver: receiverId,
    });
  }
};

const broadcastOnlineUser = (io, username, isOnline) => {
  io.emit("online-users", { username, isOnline });
};

const broadcastGroupJoin = (io, groupId, userId) => {
  io.emit("group-join", { groupId, userId });
};
