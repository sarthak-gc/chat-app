import React, { useContext, useEffect, useRef, useState } from "react";
import get from "../../utils/api/getRoutes";
import post from "../../utils/api/postRoutes";
import UserContext from "../context/UserDetails";
const UserItem = ({ user, handleUserClick, isChecked }) => {
  return (
    <div key={user._id} onClick={() => handleUserClick(user)}>
      <div className="flex gap-2 p-1 h-fit text-[#A9B4C7] items-center w-full">
        <img
          src={`https://robohash.org/${user._id}?set=set5&size=100x100`}
          alt={user.username[0].toUpperCase()}
          className="w-8 rounded-full"
        />
        <div className="border-b border-[#dadada58] w-full text-[10px] pb-1 flex justify-between">
          <span className="p-0">{user.username}</span>
          <div
            className={`h-5 w-5  border-1 border-white rounded-full flex items-center justify-center ${
              isChecked ? "bg-[rgb(85,164,248)]" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className={`h-3.5 p-1/2 ${isChecked ? "block" : "hidden"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const creator = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState({});
  const [filterQuery, setFilterQuery] = useState("");
  const searchInpRef = useRef(null);
  const handleUserClick = (user) => {
    setCheckedUsers((prev) => ({
      ...prev,
      [user._id]: !prev[user._id],
    }));
  };

  const handleXClick = (user) => {
    setCheckedUsers((prev) => ({
      ...prev,
      [user._id]: !prev[user._id],
    }));
  };
  useEffect(() => {
    const getUsers = async () => {
      const res = await get("user/users/all");
      setUsers(res.data.users);
    };
    getUsers();
  }, []);
  const selectedMembers = Object.keys(checkedUsers).filter(
    (userId) => checkedUsers[userId]
  );

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleGroupCreate = async () => {
    try {
      const res = await post(
        {
          groupName:
            groupName ||
            creator.username + ` and ${selectedMembers.length} more`,

          members: selectedMembers,
          visibility: "Public",
        },
        "group/create"
      );
      if (res.status === "success") {
        setCheckedUsers({});
        setGroupName("");
        // to group page with the members added and the creator
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="w-full h-screen bg-[#121d2b] px-4 select-none">
      <div className="h-12 border-b border-[#dadada58] mb-4 text-white grid grid-cols-3 items-center justify-center">
        <h1 className="col-start-2 text-center grid grid-cols-4">
          <span className="col-start-2">Selected Users</span>{" "}
          <span className="col-start-3">{selectedMembers.length}</span>
        </h1>
        <span
          className="col-start-3 justify-self-end text-[10px]"
          onClick={handleGroupCreate}
        >
          {" "}
          Next
        </span>
      </div>
      <div className="w-full bg-[#24303f] rounded-2xl mb-4 relative px-2">
        <input
          onChange={(e) => {
            setFilterQuery(e.target.value);
          }}
          ref={searchInpRef}
          type="search"
          placeholder={
            selectedMembers.length === 0 ? "Who would you like to add" : ""
          }
          className="p-2 w-full  rounded-2xl text-white outline-none"
        />
        <div className="flex  gap-4 absolute top-2 ">
          {selectedMembers.map((memberId) => {
            const user = users.find((user) => user._id === memberId);
            return user ? (
              <div
                key={user._id}
                className="bg-blue-500  w-fit rounded-full px-3 flex gap-2 items-center text-white"
              >
                <span className="">{user.username}</span>
                <span
                  className="text-white"
                  onClick={() => {
                    handleXClick(user);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#95a0b3"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </span>
              </div>
            ) : null;
          })}
        </div>
      </div>
      <input
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
        type="text"
        name=""
        id=""
        placeholder="Group Name"
        className="p-2 w-full  rounded-2xl text-white outline-none  bg-[#24303f]  mb-4 relative px-2"
        value={groupName}
      />
      <div className="overflow-scroll h-[calc(100% - 104px)]">
        {filteredUsers.map((user) => (
          <UserItem
            key={user._id}
            user={user}
            handleUserClick={handleUserClick}
            isChecked={checkedUsers[user._id] || false}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateGroup;
