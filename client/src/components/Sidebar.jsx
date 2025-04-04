import { useContext, useEffect, useState } from "react";
import CurrentPageContext from "../context/CurrentPageProvider";
import Navbar from "./Navbar";
import get from "../../utils/api/getRoutes";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserDetails";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchInput = ({ searchQuery, setSearchQuery, setDisplay }) => (
  <span className="">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6 absolute transform right-10 top-16/30 text-[#848fa2] hidden sm:block"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
    <input
      onBlur={() => {
        if (!searchQuery) setDisplay(true);
      }}
      onFocus={() => setDisplay(false)}
      type="search"
      className="bg-[#24303f] w-full py-2 placeholder:text-[#848fa2] placeholder:text-center outline-none text-white sm:pl-4 sm:pr-10 pl-1"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </span>
);

const UserItem = ({ user, handleUserClick }) => {
  return (
    <div key={user._id} onClick={() => handleUserClick(user)}>
      <div className="flex gap-4 p-2 h-16 text-[#A9B4C7] items-end justify-center sm:border-0 border-b border-[#dadada58] ">
        <img
          src={`https://robohash.org/${user._id}?set=set5&size=100x100`}
          alt={user.username[0].toUpperCase()}
          className="w-8 h-8 rounded-full "
        />
        <div className="border-b border-[#dadada58] w-full pb-2 hidden sm:block">
          <span>{user.username}</span>
        </div>
      </div>
    </div>
  );
};

const GroupItem = ({ group, handleGroupClick }) => (
  <div key={group._id} onClick={() => handleGroupClick(group)}>
    <div className="flex gap-4 p-2 h-16 text-[#A9B4C7] items-end justify-center sm:border-0 border-b border-[#dadada58]">
      <img
        src={`https://robohash.org/${group._id}?set=set5&size=100x100`}
        alt={group.groupName[0].toUpperCase()}
        className={`w-8 h-8 rounded-full`}
      />
      <div className="border-b border-[#dadada58] w-full pb-2 hidden sm:block">
        <span>{group.groupName}</span>
      </div>
    </div>
  </div>
);

const Sidebar = ({ joinedGroups, chattedUsers, socket, setChattedUsers }) => {
  const user = useContext(UserContext);
  const { currentPage } = useContext(CurrentPageContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showChattedUser, setShowChattedUser] = useState(true);
  const [isLoading, setIsLoading] = useState("");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showJoinedGroups, setShowJoinedGroups] = useState(true);

  const debouncedQuery = useDebounce(searchQuery, 500);
  useEffect(() => {
    if (!searchQuery) {
      setUsers([]);
      setGroups([]);
    }
  }, [searchQuery]);
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      if (currentPage === "users") {
        const res = await get(
          `user/search/query/?filterQuery=${debouncedQuery.trim()}`
        );
        setUsers(res.data.results);
      } else if (currentPage === "groups") {
        const res = await get(
          `group/search/group/?filterQuery=${debouncedQuery.trim()}`
        );
        setGroups(res.data.results);
      } else {
        console.log("Invalid query");
      }
    } catch (e) {
      setUsers([]);
      setGroups([]);
      console.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery("");
    setUsers([]);
    setGroups([]);
  }, [currentPage]);

  useEffect(() => {
    setIsLoading(true);
    if (debouncedQuery) {
      handleSearch();
    }
  }, [debouncedQuery]);

  const handleUserClick = (user) => {
    navigate(`users/${user._id}/message`, { state: { user } });
    setSearchQuery("");
    setShowChattedUser(true);
  };

  const handleGroupClick = (group) => {
    let isMember;
    group.members.forEach((member) => {
      if (member._id === user.id) {
        isMember = true;
      }
    });
    const isCreator = group.creator._id == user.id;

    if (isMember || isCreator) {
      navigate(`groups/${group._id}/message`, {
        state: { group, isMember, isCreator },
      });
    } else {
      navigate(`groups/${group._id}/detail`, {
        state: { group, isMember, isCreator },
      });
    }
    setSearchQuery("");
    setShowJoinedGroups(true);
  };

  const handleGroupCreate = () => {
    navigate("groups/create");
  };
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("login", localStorage.getItem("token"), socket.id);
    });

    socket.on("new-message", (messageInfo) => {
      const newUser = {
        username: messageInfo.sender.username,
        _id: messageInfo.sender._id,
      };

      setChattedUsers((prev) => {
        const userExists = prev.some((user) => user._id === newUser._id);
        if (!userExists) {
          return [...prev, newUser];
        }
        return prev;
      });
    });

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("new-message");
      }
    };
  }, [socket]);
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="w-32 sm:w-[320px]  bg-[#1a212c] h-[100vh] relative flex-none overflow-hidden">
      <div className="sm:p-4 py-4 px-2 flex flex-col gap-2 border-b border-gray-200 relative justify-center min-h-[104px] ">
        <div className="flex sm:block ">
          <h1 className="text-white  text-center flex-none">
            {currentPage && currentPage[0].toUpperCase() + currentPage.slice(1)}
          </h1>

          {currentPage === "groups" && (
            <span
              onClick={handleGroupCreate}
              className="absolute top-3.5 right-1/5 sm:right-10 hover:bg-[#24303f] flex items-center justify-center rounded-full cursor-pointer text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </span>
          )}
        </div>

        {currentPage !== "settings" && (
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setDisplay={
              currentPage === "users" ? setShowChattedUser : setShowJoinedGroups
            }
          />
        )}
      </div>
      {currentPage === "groups" && showJoinedGroups && (
        <div className="overflow-scroll h-[83%] scrollbar-none">
          {joinedGroups.map((group) => (
            <GroupItem
              key={group._id}
              group={group}
              handleGroupClick={handleGroupClick}
            />
          ))}
        </div>
      )}

      {currentPage === "users" && showChattedUser && (
        <div className="overflow-scroll h-[83%] scrollbar-none">
          {chattedUsers.map((chattedUser) => (
            <UserItem
              key={chattedUser._id}
              user={chattedUser}
              handleUserClick={handleUserClick}
            />
          ))}
        </div>
      )}
      {currentPage === "settings" && (
        <div className="text-white h-full px-4">
          <div className="flex gap-4 mt-4 items-center hover:bg-[#1e2939] py-4  ">
            <img
              src={`https://robohash.org/${user._id}?set=set5&size=100x100`}
              alt={user.username[0].toUpperCase()}
              className="w-12 h-12 rounded-full "
            />
            <div className="flex-col  sm:flex hidden">
              <span>{user.username[0] + user.username.slice(1)}</span>
              <span>{user.id}</span>
            </div>
          </div>

          <div
            className="flex py-4 items-center px-2  text-red-500 gap-4 w-full hover:bg-[#1e2939]  cursor-pointer "
            onClick={() => {
              handleLogout();
            }}
          >
            <svg
              xmlns="http://ww.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="red"
              className="w-10 h-10  rounded-3xl  "
            >
              <path d="M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12L16 12" />
            </svg>
            <span className="text-red-500 sm:block hidden">Logout</span>
          </div>
        </div>
      )}
      {users.length > 0 && !showChattedUser && (
        <div className="overflow-scroll h-[calc(100% - 104px)">
          {users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handleUserClick={handleUserClick}
            />
          ))}
        </div>
      )}

      {users.length === 0 && !showChattedUser && currentPage === "users" && (
        <div className="w-full text-white h-1/2 items-center flex justify-center">
          <span>{!searchQuery && "Search User"}</span>
          <span>
            {searchQuery && (isLoading ? <Loader /> : "No user found")}
          </span>
        </div>
      )}

      {groups.length > 0 && !showJoinedGroups && (
        <div className="overflow-scroll h-[calc(100% - 104px)">
          {groups.map((group) => (
            <GroupItem
              key={group._id}
              group={group}
              handleGroupClick={handleGroupClick}
            />
          ))}
        </div>
      )}

      {groups.length === 0 && !showJoinedGroups && currentPage === "groups" && (
        <div className="w-full text-white h-1/2 items-center flex justify-center">
          <span>{!searchQuery && "Search Group"}</span>
          <span>
            {searchQuery && (isLoading ? <Loader /> : "No group found")}
          </span>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Sidebar;
