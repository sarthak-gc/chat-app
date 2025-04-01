import mongoose from "mongoose";
const visitorSchema = new mongoose.Schema({
  username: { type: String },
  ip: { type: String },
});

const VisitorModel = mongoose.model("Visitor", visitorSchema);

export default VisitorModel;
