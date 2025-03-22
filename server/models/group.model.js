import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      required: true,
      default: "Public",
    },
    messages: { type: [mongoose.Schema.Types.ObjectId], ref: "Message" },
  },
  {
    timestamps: true,
  }
);
const GroupModel = mongoose.model("Group", groupSchema);
export default GroupModel;
