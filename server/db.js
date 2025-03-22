import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const getURL = () => {
  if (process.env.ENVIRONMENT_STAGE == "development") {
    return process.env.DEV_MONGO_URL;
  } else if (process.env.ENVIRONMENT_STAGE == "deployment") {
    return process.env.DEP_MONGO_URL;
  } else {
    return "invalid env variable";
  }
};

const connectDB = async () => {
  const MONGO_URL = getURL();

  if (MONGO_URL == "invalid env variable") {
    return "No connection string due to invalid env variable for ENVIRONMENT_STAGE";
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DATABASE CONNECTED");
  } catch (e) {
    console.log("ERROR : ", e);
  }
};
connectDB();
