import express from "express";
import http from "http";
import { Server } from "socket.io";
import "./db.js";
import router from "./routes/index.routes.js";

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {});

app.use(express.json());
app.use(router);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("message", (message) => {
    console.log(message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(3000);

// if (
//   connectDB() !==
//   "No connection string due to invalid env variable for ENVIRONMENT_STAGE"
// ) {
// } else {
//   console.log(connectDB());
// }
