import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/user.model.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const authentication = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ status: "error", message: "unauthorized" });
  }
  const jwtToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(jwtToken, JWT_SECRET);
    req.id = decoded.id;
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User Not Found" });
    }

    next();
  } catch (e) {
    let message;
    if (e instanceof jwt.TokenExpiredError) {
      console.log("Token has expired");
      message = "Token has expired";
    } else if (e instanceof jwt.JsonWebTokenError) {
      console.log("Invalid token");
      message = "Invalid token";
    } else {
      console.log("Error during token verification", e);
      message = "Error during token verification" + e;
    }
    return res.status(403).json({ status: "error", message });
  }
};
export default authentication;
