import express from "express";
import http from "http";
import { Server } from "socket.io";
import "./db.js";
import router from "./routes/index.routes.js";
import { socketHandler } from "./socket.io/socketHandler.js";
import cors from "cors";
const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(router);
socketHandler(io);
httpServer.listen(3000);

// if (
//   connectDB() !==
//   "No connection string due to invalid env variable for ENVIRONMENT_STAGE"
// ) {
// } else {
//   console.log(connectDB());
// }
