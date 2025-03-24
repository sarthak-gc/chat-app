import React, { useEffect, useState } from "react";
import get from "../../utils/api/getRoutes.js";
import { io } from "socket.io-client";

const URL = "http://localhost:3000";

import Sidebar from "../components/Sidebar.jsx";
import MessageArea from "../components/MessageArea.jsx";
import Welcome from "./Welcome.jsx";
let socket;
const Feed = () => {
  const [joinedGroups, setJoinedGroups] = useState([]);

  const users = [{ name: "John Doe" }, { name: "Jane Smith" }];

  useEffect(() => {
    const getJoinedGroup = async () => {
      const res = await get("group/joined");

      setJoinedGroups(res.data.groups);
    };

    getJoinedGroup();
  }, []);

  useEffect(() => {
    socket = io(URL);
    socket.on("connect", () => {
      console.log("socket connected");
      if (!localStorage.getItem("socketId")) {
        localStorage.setItem("socketId", socket.id);
      }
      const socketId = localStorage.getItem("socketId");
      console.log(socketId);
      socket.emit(
        "login",
        localStorage.getItem("token"),
        localStorage.getItem("socketId")
      );
    });
  }, []);
  return (
    <div className="flex">
      <Sidebar joinedGroups={joinedGroups} users={users} />
      <Welcome />
    </div>
  );
};

export default Feed;
