import UserModel from "../models/user.model";
import MessageModel from "../models/message.model";
import NotificationModel from "../models/notification.model";
import GroupModel from "../models/group.model";
import mongoose from "mongoose";

// messageRouter.post("/:senderId/to/:receiverId", sendMessage);
export const sendMessage = async (req, res) => {
  const { senderId, receiverId } = req.params;
  const { message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid sender ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid receiver ID" });
  }

  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ status: "error", message: "Message cannot be empty" });
  }

  try {
    const [sender, receiver] = await Promise.all([
      UserModel.findById(senderId),
      UserModel.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({
        status: "error",
        message: !sender ? "Sender not found" : "Receiver Not Found",
      });
    }
    const sentMessage = await MessageModel.create({
      sender: senderId,
      receiver: receiverId,
      message: message.trim(),
    });

    if (!sentMessage) {
      return res.status(400).json({
        status: "error",
        message: "Something went wrong. Try sending msg again",
      });
    }

    await NotificationModel.create({
      receiver: receiverId,
      sender: senderId,
      type: "message",
      content: message.trim(),
      messageId: sentMessage._id,
    });

    res.json({
      status: "success",
      message: "Message sent successfully",
      data: {
        sentMessage,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Something went wrong. Try sending msg again",
    });
  }
};

// messageRouter.delete("/:messageId", deleteMessage);
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid message ID" });
  }
  try {
    const messageExist = await MessageModel.findById(messageId);

    if (!messageExist) {
      return res.status(404).json({
        status: "error",
        message: "Message not found",
      });
    }
    await MessageModel.findByIdAndUpdate(messageId, {
      message: "This message was deleted by the sender",
    });

    const notification = await NotificationModel.findOne({
      messageId: messageExist._id,
    });

    if (notification) {
      await notification.deleteOne();
    }

    res.json({
      status: "success",
      message: "Message deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: "error", message: "Cannot delete message. Try again" });
  }
};

// messageRouter.post("/:senderId/to/:groupId", sendGroupMessage);
export const sendGroupMessage = async (req, res) => {
  const { senderId, groupId } = req.params;
  const { message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid sender ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid group ID" });
  }
  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ status: "error", message: "Message cannot be empty" });
  }
  try {
    const groupExists = await GroupModel.findById(groupId).select(
      "members creator"
    );
    if (!groupExists) {
      return res
        .status(404)
        .json({ status: "error", message: "group not found" });
    }

    if (
      !groupExists.members.includes(senderId) &&
      groupExists.creator.toString() !== senderId
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "You are not part of the group" });
    }
    const sentMessage = await MessageModel.create({
      sender: senderId,
      group: groupId,
      message: message,
      readBy: [],
    });

    const members = [...groupExists.members, groupExists.creator].filter(
      (elem) => elem.toString() !== senderId
    );

    if (members.length > 0) {
      const notifications = members.map((elem) => ({
        receiver: elem,
        sender: senderId,
        type: "groupMessage",
        content: message,
        groupId: groupId,
        messageId: sentMessage._id,
      }));
      await NotificationModel.insertMany(notifications);
    }

    res.json({
      status: "success",
      message: "Message sent to group",
      data: {
        message,
      },
    });
  } catch (e) {
    console.log("Error sending group message:", e);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// messageRouter.delete("/:messageId/group/:groupId", deleteMessage);
export const deleteGroupMessage = async (req, res) => {
  const { messageId, groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid message ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid group ID" });
  }

  try {
    const messageExist = await MessageModel.findById(messageId);

    if (!messageExist) {
      return res.status(404).json({
        status: "error",
        message: "Message not found",
      });
    }

    const groupExists = await GroupModel.findById(groupId).select("messages");
    if (!groupExists.messages.includes(messageId)) {
      return res.status(400).json({
        status: "error",
        message: "The message is not the part of this group",
      });
    }

    await MessageModel.findByIdAndUpdate(messageId, {
      message: "This message was deleted by the sender",
    });

    const notification = await NotificationModel.findOne({
      messageId: messageExist._id,
    });

    if (notification) {
      await notification.deleteOne();
    }

    res.json({
      status: "success",
      message: "Message deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: "error", message: "Cannot delete message. Try again" });
  }
};

// messageRouter.get("/status/:messageId", getMessageStatus);
export const getMessageStatus = async (req, res) => {
  const { messageId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid message ID" });
  }

  const message = await MessageModel.findById(messageId);
  if (!message) {
    return res.status(404).json({ status: "message not found" });
  }
  res.json({
    status: "success",
    message: "Status retrieved",
    data: {
      status: message.status,
    },
  });
};

// messageRouter.get("/:groupId", getGroupMessages);
export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid group ID" });
  }
  try {
    const group = await GroupModel.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ status: "error", message: "Group not found" });
    }

    const messages = await MessageModel.find({ group: groupId })
      .select("senderId group readBy message")
      .populate("senderId", "userName")
      .populate("group", "groupName")
      .populate("readBy", "userName");

    if (messages.length == 0) {
      res.json({
        status: "success",
        message: "Messages Retrieved Successfully",
        data: {
          messages: [],
        },
      });
    }
    res.json({
      status: "success",
      message: "Messages Retrieved Successfully",
      data: {
        messages,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Internal error while fetching old messages",
    });
  }
};
// messageRouter.get("/:senderId", getMessage);
export const getMessages = async (req, res) => {
  const { senderId } = req.params;
  const receiverId = req.id;

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid sender ID" });
  }
  try {
    const messages = await MessageModel.find({
      sender: senderId,
      receiver: receiverId,
    });

    if (messages.length === 0) {
      return res.status(404).json({
        status: "success",
        message: "No messages",
        data: {
          messages: [],
        },
      });
    }
    res.json({
      status: "success",
      message: "Messages Retrieved Successfully",
      data: {
        messages,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Internal error while fetching old messages",
    });
  }
};

// messageRouter.get("/:groupId/new", getNewGroupMessages);
export const getNewGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid group ID" });
  }
  try {
    const groupExists = await GroupModel.findById(groupId);
    if (!groupExists) {
      return res
        .status(404)
        .json({ status: "error", message: "Group not found" });
    }

    if (
      !groupExists.members.includes(req.id) &&
      groupExists.creator.toString() !== req.id
    ) {
      return res.status(403).json({
        status: "error",
        message:
          "You are not the part of the group. Join group to see messages",
      });
    }

    const groupMessages = await MessageModel.find({
      group: groupId,
      readBy: { $ne: req.id },
    });

    if (groupMessages.length === 0) {
      return res.json({
        status: "success",
        message: "No messages exist",
        data: {
          messages: [],
        },
      });
    }

    //  adding the reader to the readBy array
    await MessageModel.updateMany(
      { group: groupId, readBy: { $ne: req.id } },
      { $push: { readBy: req.id } }
    );
    res.json({
      status: "success",
      message: "Messages Retrieved",
      data: {
        messages: groupMessages,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "Internal Error" });
  }
};

// messageRouter.get("/:senderId/new", getNewMessage);
export const getNewMessage = async (req, res) => {
  const { senderId } = req.params;
  const receiverId = req.id;

  if (!mongoose.Types.ObjectId.isValid(senderId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid sender ID" });
  }
  try {
    const newMessage = await MessageModel.find({
      sender: senderId,
      receiver: receiverId,
      status: {
        $in: ["Sent", "Delivered"],
      },
    });

    if (newMessage.length === 0) {
      return res.json({
        status: "success",
        message: "No new Message",
        data: {
          message: [],
        },
      });
    }

    // marking all old message as seen
    for (const message of newMessage) {
      message.status = "Read";
      await message.save();
    }

    res.json({
      status: "success",
      message: "New messages retrieved",
      data: {
        message: newMessage,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "Internal Error" });
  }
};
