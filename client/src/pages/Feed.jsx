import React, { useEffect, useState } from "react";
import get from "../../utils/api/getRoutes.js";
import socket from "../socket.js";

import Sidebar from "../components/Sidebar.jsx";
// import MessageArea from "../components/MessageArea.jsx";
import Welcome from "./Welcome.jsx";
import { Outlet, useLocation } from "react-router-dom";
const Feed = () => {
  const [joinedGroups, setJoinedGroups] = useState([]);
  // const users = [{ name: "John Doe" }, { name: "Jane Smith" }];
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot initialize socket connection");
      return;
    }
    socket.emit("login", token);
  }, []);

  useEffect(() => {
    const getJoinedGroup = async () => {
      try {
        const res = await get("group/joined");
        setJoinedGroups(res.data.groups);
      } catch (e) {
        console.log(e.message);
      }
    };

    getJoinedGroup();
  }, []);

  const location = useLocation();
  const isFeed = location.pathname === "/feed";
  return (
    <div className="flex">
      <Sidebar joinedGroups={joinedGroups} />
      <div className="flex-1 bg-red-500">
        {isFeed && <Welcome />}
        <Outlet context={{ joinedGroups, socket }} />
      </div>
    </div>
  );
};

export default Feed;
