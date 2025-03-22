import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, trim: true, unique: true },
  password: { type: String, trim: true },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
