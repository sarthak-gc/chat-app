import express from "express";
import {
  createGroup,
  deleteGroup,
  addMember,
  getMembers,
  getGroupDetails,
  searchGroup,
  joinGroup,
  leaveGroup,
  toggleVisibility,
  kickMember,
  transferOwnership,
} from "../controllers/group.controllers.js";

const groupRouter = express.Router();

groupRouter.post("/create", createGroup);
groupRouter.delete("/delete/:groupId", deleteGroup);
groupRouter.post("/:groupId/member/:userId", addMember);
groupRouter.get("/:groupId/members", getMembers);
groupRouter.get("/:groupId", getGroupDetails);
groupRouter.get("/search/group", searchGroup);
groupRouter.post("/:groupId/join", joinGroup);
groupRouter.delete("/:groupId/leave", leaveGroup);
groupRouter.put("/:groupId/visibility", toggleVisibility);
groupRouter.delete("/:groupId/member/:memberId/kick", kickMember);
groupRouter.put("/:groupId/transfer/admin/:memberId", transferOwnership);

export default groupRouter;
