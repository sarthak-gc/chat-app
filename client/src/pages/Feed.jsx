import React, { useContext, useEffect, useState } from "react";
import get from "../../utils/api/getRoutes.js";
import socket from "../socket.js";

import Sidebar from "../components/Sidebar.jsx";
// import MessageArea from "../components/MessageArea.jsx";
import Welcome from "./Welcome.jsx";
import { Outlet, useLocation } from "react-router-dom";
import UserContext from "../context/UserDetails.jsx";
const Feed = () => {
  const user = useContext(UserContext);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [chattedUsers, setChattedUsers] = useState([]);
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

    const getChattedUser = async () => {
      try {
        const res = await get("message/messages/history");
        setChattedUsers(res.data.uniqueUsersList);
      } catch (e) {
        console.log(e.message);
      }
    };

    getChattedUser();
    getJoinedGroup();
  }, []);

  const location = useLocation();
  const isFeed = location.pathname === "/feed";
  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar joinedGroups={joinedGroups} chattedUsers={chattedUsers} />

      <div className="flex-1 ">
        {isFeed && <Welcome />}
        <Outlet context={{ joinedGroups, socket }} />
      </div>
    </div>
  );
};

export default Feed;
