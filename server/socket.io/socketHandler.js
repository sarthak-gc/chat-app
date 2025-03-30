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

    socket.on("group-click", (groupId, userId) => {
      socket.join(groupId);

      if (!groupSockets.has(groupId)) {
        groupSockets.set(groupId, new Set());
      }

      groupSockets.get(groupId).add(userId);

      broadcastGroupJoin(io, groupId, userId);
    });

    socket.on("send-group-message", (sender, message, groupId) => {
      broadcastGroupMessage(io, sender, message, groupId);
    });

    socket.on("remove-group-message", (messageId, groupId) => {
      broadcastRemoveMessage(io, messageId, groupId);
    });

    socket.on("group-create", (members) => {
      console.log(members);
    });
    socket.on("join-group", (groupId, userId) => {
      socket.leave(groupId);
      broadcastGroupLeave(io, groupId, userId);
    });
    socket.on("leave-group", (groupId, userId) => {
      socket.leave(groupId);
      broadcastGroupLeave(io, groupId, userId);
    });

    socket.on("message", async (senderId, message, receiverId) => {
      const sender = await UserModel.findById(senderId).select("-password");
      broadcastNewMessage(io, message, sender, receiverId);
    });

    socket.on("logout", (userId) => {
      broadcastOnlineUser(io, userId, false);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};

const handleGroupClick = (io, groupId, userId) => {};
const broadcastGroupLeave = (io, groupId, userId) => {
  io.to(groupId).emit("user-left", { userId });
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

const broadcastRemoveMessage = (io, messageId, groupId) => {
  io.to(groupId).emit("remove-message", messageId);
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

const broadcastOnlineUser = (io, username, isOnline) => {
  io.emit("online-users", { username, isOnline });
};

const broadcastGroupJoin = (io, groupId, userId) => {
  io.to(groupId).emit("user-joined", { userId });
};
