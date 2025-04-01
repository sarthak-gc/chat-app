import VisitorModel from "../models/visitor.model.js";

const loggerMiddleware = async (req, res, next) => {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const ipExists = await VisitorModel.findOne({ ip: data.ip });

    if (!ipExists) {
      await VisitorModel.create({
        username: "visitor at " + new Date(),
        ip: data.ip,
      });
    }

    const method = req.method;
    const route = req.originalUrl;
    console.log(
      `[${new Date().toLocaleDateString()}] / ${new Date().toLocaleTimeString()} : ${
        data.ip
      } - ${method} ${route}`
    );
    next();
  } catch (error) {
    console.error("Error in loggerMiddleware:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default loggerMiddleware;
