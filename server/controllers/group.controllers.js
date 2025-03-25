import mongoose from "mongoose";
import GroupModel from "../models/group.model.js";
import UserModel from "../models/user.model.js";
// groupRouter.post("/create", createGroup);
export const createGroup = async (req, res) => {
  const { groupName, members, visibility } = req.body.body;
  if (!groupName || groupName.trim() === "") {
    return res
      .status(400)
      .json({ status: "error", message: "Group name is required" });
  }
  const uniqueMembers = [...new Set(members)];
  const creator = req.id;

  try {
    const newGroup = await GroupModel.create({
      groupName,
      members: uniqueMembers,
      creator,
      visibility: visibility === "Private" ? "Private" : "Public",
    });

    res.status(201).json({
      status: "success",
      message: "Group Created Successfully",
      data: { group: newGroup },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to create group. Try again",
    });
  }
};
// groupRouter.delete("/delete/:groupId", deleteGroup);
export const deleteGroup = async (req, res) => {
  const { groupId } = req.params;
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
        message: "You are not the part of this group",
      });
    }
    if (groupExists.creator.toString() !== req.id) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this group",
      });
    }

    await groupExists.deleteOne();

    res.json({
      status: "success",
      message: "Group deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to delete group. Try again",
    });
  }
};
// groupRouter.post("/:groupId/member/:userId", addMember);
export const addMember = async (req, res) => {
  const { userId, groupId } = req.params;

  try {
    const groupExists = await GroupModel.findById(groupId);
    if (!groupExists) {
      return res
        .status(404)
        .json({ status: "error", message: "Group not found" });
    }

    if (
      groupExists.visibility === "Private" &&
      groupExists.creator.toString() !== req.id
    ) {
      return res.status(403).json({
        status: "error",
        message: "Group is private. Only group creator can add members.",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (
      groupExists.members.includes(userId) ||
      groupExists.creator.toString() === userId
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Member already exists in group" });
    }

    const addedMember = await GroupModel.findByIdAndUpdate(
      groupId,
      {
        $push: { members: userId },
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "Member added successfully",
      data: { group: addedMember },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to add member. Try again",
    });
  }
};

// groupRouter.get("/:groupId/members", getMembers);
export const getMembers = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await GroupModel.findById(groupId)
      .select("visibility")
      .populate("creator", "username")
      .populate("members", "username");

    const isMember = group.members.find((member) => member._id.equals(req.id));

    if (group.visibility === "Private") {
      if (group.creator._id.toString() !== req.id && !isMember) {
        return res.status(403).json({
          status: "error",
          message: "You cannot view private group members.",
        });
      }
    }

    const members = [group.creator, ...group.members];
    console.log(members);
    res.json({
      status: "success",
      message: "Members Retrieved successfully",
      data: { members },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to get members. Try again",
    });
  }
};

// groupRouter.get("/:groupId", getGroupDetails);
export const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid group ID" });
  }
  try {
    const groupExists = await GroupModel.findById(groupId)
      .select("visibility")
      .populate("creator", "username")
      .populate("members", "username");

    if (!groupExists) {
      return res
        .status(404)
        .json({ status: "error", message: "Group not found" });
    }

    const isMember = groupExists.members.find((member) =>
      member._id.equals(req.id)
    );

    if (groupExists.visibility === "Private") {
      if (groupExists.creator._id.toString() !== req.id && !isMember) {
        return res.status(403).json({
          status: "error",
          message: "You cannot view private group details.",
        });
      }
    }

    res.json({
      status: "success",
      message: "Group Details Retrieved successfully",
      data: { group: groupExists },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to get group details. Try again",
    });
  }
};
// groupRouter.get("/search", searchGroup);
export const searchGroup = async (req, res) => {
  try {
    const { filterQuery } = req.query;
    if (!filterQuery || filterQuery.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }
    const results = await GroupModel.find({
      groupName: { $regex: filterQuery, $options: "i" },
      visibility: "Public",
    })
      .populate("members", "username ")
      .populate("creator", "username ");
    const privateGroups = await GroupModel.aggregate([
      {
        $match: {
          groupName: { $regex: filterQuery, $options: "i" },
          visibility: "Private",
        },
      },
      {
        $project: {
          groupName: 1,
          visibility: 1,
          membersCount: { $size: "$members" },
        },
      },
    ]);

    if (results.length === 0 && privateGroups.length === 0) {
      return res.status(404).json({
        status: "success",
        message: "No groups found with that name",
        data: {
          results: [],
        },
      });
    }
    res.status(200).json({
      status: "success",
      message: "Groups Retrieved successfully",
      data: {
        results: [...results, ...privateGroups],
      },
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ status: "error", message: "Failed to search groups." });
  }
};
// groupRouter.post("/:groupId/join", joinGroup);
export const joinGroup = async (req, res) => {
  const { groupId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid group ID" });
  }
  try {
    const groupExists = await GroupModel.findOne({
      _id: groupId,
    });

    if (!groupExists) {
      return res
        .status(404)
        .json({ status: "error", message: "Group not found" });
    }
    if (groupExists.visibility === "Private") {
      return res.status(403).json({
        status: "error",
        message: "Group is private. Ask Admin to add you",
      });
    }

    if (groupExists.members.includes(req.id)) {
      return res.status(400).json({
        status: "error",
        message: "You are already a member of this group",
      });
    }

    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      {
        $push: { members: req.id },
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "You have joined the group",
      data: { group: updatedGroup },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "Failed to join group" });
  }
};
// groupRouter.delete("/:groupId/leave", leaveGroup);
export const leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res
      .status(400)
      .json({ status: "error", message: "Invalid group ID" });
  }

  try {
    const groupExists = await GroupModel.findOne({
      _id: groupId,
    });

    if (!groupExists) {
      return res
        .status(404)
        .json({ status: "error", message: "Group not found" });
    }

    if (!groupExists.members.includes(req.id)) {
      return res.status(403).json({
        status: "error",
        message: "You are not a member of this group",
      });
    }

    if (
      groupExists.creator.toString() === req.id &&
      groupExists.members.length > 1
    ) {
      return res.status(403).json({
        status: "error",
        message:
          "Cannot leave the group as it is created by you. Transfer ownership before leaving",
      });
    }
    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      {
        $pull: { members: req.id },
      },
      { new: true }
    );
    if (updatedGroup.members.length === 0) {
      await GroupModel.findByIdAndDelete(groupId);
      return res.json({
        status: "success",
        message:
          "You have left the group. The group is now deleted as it has no members.",
      });
    }

    res.json({
      status: "success",
      message: "You have left the group",
      data: { group: updatedGroup },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: "Failed to leave group" });
  }
};
// groupRouter.put("/:groupId/visibility", toggleVisibility);
export const toggleVisibility = async (req, res) => {
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

    if (groupExists.creator.toString() !== req.id) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to change visibility",
      });
    }
    if (groupExists.visibility === "Public") {
      groupExists.visibility = "Private";
    } else if (groupExists.visibility === "Private") {
      groupExists.visibility = "Public";
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid visibility value" });
    }
    await groupExists.save();
    return res.status(200).json({
      status: "success",
      message: "Visibility updated successfully",
      visibility: groupExists.visibility,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to update visibility" });
  }
};

// groupRouter.delete("/:groupId/member/:memberId/kick", kickMember);
export const kickMember = async (req, res) => {
  const { groupId, memberId } = req.params;

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

    if (groupExists.creator.toString() !== req.id) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to kick members",
      });
    }

    if (!groupExists.members.includes(memberId)) {
      return res
        .status(404)
        .json({ status: "error", message: "Member not found in the group" });
    }
    if (req.id === memberId) {
      return res
        .status(403)
        .json({ status: "error", message: "Cannot kick yourself" });
    }
    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      {
        $pull: { members: memberId },
      },
      { new: true }
    );
    res.json({
      status: "success",
      message: "Member kicked successfully",
      data: { group: updatedGroup },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Failed to kick member. Try again",
    });
  }
};

// groupRouter.put("/:groupId/transfer/admin/:memberId", transferOwnership);
export const transferOwnership = async (req, res) => {
  const { groupId, memberId } = req.params;

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

    if (groupExists.creator.toString() !== req.id) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to transfer ownership",
      });
    }

    if (!groupExists.members.includes(memberId)) {
      return res
        .status(404)
        .json({ status: "error", message: "Member not found in the group" });
    }

    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      { creator: memberId },
      { new: true }
    );
    res.json({
      status: "success",
      message: "Ownership transferred successfully",
      data: { group: updatedGroup },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to transfer ownership. Try again",
    });
  }
};

// groupRouter.get("/joined", getJoinedGroup);
export const getJoinedGroup = async (req, res) => {
  try {
    const groups = await GroupModel.find({})
      .populate("creator", "username")
      .populate("members", "username");
    if (groups.length === 0) {
      return res.json({
        status: "success",
        message: "No groups found",
        data: { groups: [] },
      });
    }

    const joinedGroups = groups.filter((group) => {
      let isMember;
      if (group.members.length > 0) {
        isMember = group.members.some(
          (member) => member._id.toString() === req.id
        );
      }
      const isCreator = group.creator._id.toString() === req.id;
      return isMember || isCreator;
    });

    if (joinedGroups.length === 0) {
      return res.json({
        status: "success",
        message: "No joined groups found",
        data: { groups: [] },
      });
    }
    res.json({
      status: "success",
      message: "Joined groups fetched successfully",
      data: { groups: joinedGroups },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Failed to find group. Try again",
    });
  }
};
