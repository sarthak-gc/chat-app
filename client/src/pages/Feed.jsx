import React, { useEffect, useState } from "react";
import get from "../../utils/api/getRoutes.js";
import { io } from "socket.io-client";

const URL = "http://localhost:3000";

import Sidebar from "../components/Sidebar.jsx";
import MessageArea from "../components/MessageArea.jsx";
import Welcome from "./Welcome.jsx";
import { Outlet, useLocation } from "react-router-dom";
let socket;
const Feed = () => {
  const [joinedGroups, setJoinedGroups] = useState([]);

  // const users = [{ name: "John Doe" }, { name: "Jane Smith" }];

  useEffect(() => {
    const getJoinedGroup = async () => {
      try {
        const res = await get("group/joined");
        console.log(res);
        setJoinedGroups(res.data.groups);
      } catch (e) {
        console.log(e.message);
      }
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
  const location = useLocation();
  const isFeed = location.pathname === "/feed";

  return (
    <div className="flex">
      {/* <Sidebar joinedGroups={joinedGroups} users={users} /> */}
      <Sidebar joinedGroups={joinedGroups} />
      <div className="flex-1 bg-red-500">
        {isFeed && <Welcome />}
        <Outlet context={{ joinedGroups }} />
        {/* <Outlet context={{ joinedGroups, users }} /> */}
        {/* <Outlet context={{ joinedGroups, users }} /> */}
      </div>
    </div>
  );
};

export default Feed;
