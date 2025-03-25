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
  getJoinedGroup,
} from "../controllers/group.controllers.js";
import authentication from "../middlewares/authentication.js";

const groupRouter = express.Router();

groupRouter.use(authentication);
groupRouter.post("/create", createGroup);
groupRouter.delete("/delete/:groupId", deleteGroup);
groupRouter.post("/:groupId/member/:userId", addMember);
groupRouter.get("/:groupId/members", getMembers);
groupRouter.get("/:groupId/details", getGroupDetails);
groupRouter.get("/joined", getJoinedGroup);
groupRouter.get("/search/group", searchGroup);
groupRouter.post("/:groupId/join", joinGroup);
groupRouter.delete("/:groupId/leave", leaveGroup);
groupRouter.put("/:groupId/visibility", toggleVisibility);
groupRouter.delete("/:groupId/member/:memberId/kick", kickMember);
groupRouter.put("/:groupId/transfer/admin/:memberId", transferOwnership);

export default groupRouter;
