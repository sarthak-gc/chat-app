import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserItem = ({ user, creator }) => (
  <div key={user._id} className="w-full ">
    <div className="flex gap-4 p-2 h-16 text-[#A9B4C7] items-end bg-[#1a222c] w-full">
      <img
        src={`https://robohash.org/${user._id}?set=set5&size=100x100`}
        alt={user.username[0].toUpperCase()}
        className="w-8 h-8 rounded-full"
      />
      <div className="border-b border-[#dadada58] w-full pb-2 flex justify-between pr-8">
        <span>{user.username}</span>
        {creator && <span>admin</span>}
      </div>
    </div>
  </div>
);

const GroupDetailPage = () => {
  const location = useLocation();
  const { group } = location.state || {};
  const online = true;
  const [toShow, setToShow] = useState("all");

  const navigate = useNavigate();
  const handleSendMessage = () => {
    navigate(`/feed/groups/${group._id}/message`, {
      state: {
        group,
      },
    });
  };
  return (
    <div className="bg-[rgba(19,20,21)] w-full h-screen   scrollbar-none">
      {/* profile */}
      <div className="flex w-full items-center justify-center text-[#A9B4C7]  h-1/5 ">
        <div
          className={`w-30 h-30 rounded-full ${
            online ? "bg-green-400" : "bg-gray-500"
          } flex items-center justify-center`}
        >
          <img
            src={`https://robohash.org/${group._id}?set=set5&size=100x100`}
            alt={group.groupName[0].toUpperCase()}
            className={`w-27 h-27 rounded-full bg-black `}
          />
        </div>
      </div>
      {/* name */}
      <div className=" text-4xl text-white justify-center flex items-center flex-col">
        <span>
          {group.groupName[0].toUpperCase() + group.groupName.slice(1)}
        </span>
        <span className="text-sm mt-5">
          {group.members.length + 1}{" "}
          {group.members.length > 0 ? "members" : "member"}
        </span>
      </div>

      {/* contact info */}

      <div className=" my-10 flex justify-center">
        <div className="flex  w-2/3 lg:w-1/3 justify-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-20 md: md:p-4 p-2  bg-[#24303f] hover:bg-[#1a212c] hover:stroke-[#55a4f8] rounded-3xl cursor-pointer"
            onClick={handleSendMessage}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            ></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-20 md: md:p-4 p-2  bg-[#24303f] hover:bg-[#1a212c] hover:stroke-[#55a4f8] rounded-3xl cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="size-20 md: md:p-4 p-2  bg-[#24303f] hover:bg-[#1a212c] hover:stroke-[#55a4f8] rounded-3xl cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </div>
      </div>
      <div className="text-white justify-center h-full pb-20">
        <div className=" flex justify-center w-full ">
          <div className="h-1/2 text-[#A9B4C7] bg-[#1a222c] w-5/6 md:w-1/3 rounded-t-xl">
            <div className="border-b border-[#dadada58] w-full pt-6 flex justify-between px-10 ">
              <span
                className={`${
                  toShow === "all"
                    ? "text-[rgb(84,163,248)]  border-b-4  mb-4"
                    : ""
                } border-blue-500 min-w-1/10 w-fit text-center pb-1`}
                onClick={() => setToShow("all")}
              >
                All
              </span>
              <span
                className={`${
                  toShow === "admin"
                    ? "text-[rgb(84,163,248)]  border-b-4  mb-4"
                    : ""
                } border-blue-500 min-w-1/10 w-fit text-center pb-1`}
                onClick={() => setToShow("admin")}
              >
                Admin
              </span>
              <span
                className={`${
                  toShow === "members"
                    ? "text-[rgb(84,163,248)]  border-b-4  mb-4"
                    : ""
                } border-blue-500 min-w-1/10 w-fit text-center pb-1`}
                onClick={() => setToShow("members")}
              >
                Members
              </span>
            </div>
          </div>
        </div>
        <div className="h-full w-full flex  justify-center">
          <div className="text-white bg overflow-scroll h-1/2 w-5/6 md:w-1/3 scrollbar-none">
            <ul className="text-white flex flex-col  w-full">
              {(toShow === "admin" || toShow === "all") && (
                <UserItem
                  key={group.creator._id}
                  user={group.creator}
                  creator={true}
                />
              )}
              {(toShow === "members" || toShow === "all") &&
                group.members.map((member) => {
                  return (
                    <li>
                      <UserItem key={member._id} user={member} />
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
