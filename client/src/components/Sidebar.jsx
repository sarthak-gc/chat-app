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

const SearchInput = ({ searchQuery, setSearchQuery, setShowChattedUser }) => (
  <span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6 absolute transform right-5 top-16/29 text-[#848fa2]"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
    <input
      onBlur={() => {
        if (!searchQuery) setShowChattedUser(true);
      }}
      onFocus={() => setShowChattedUser(false)}
      type="search"
      className="bg-[#24303f] w-full py-2 placeholder:text-[#848fa2] placeholder:text-center outline-none text-white pl-4 pr-10"
      placeholder="Search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </span>
);

const UserItem = ({ user, handleUserClick }) => (
  <div key={user._id} onClick={() => handleUserClick(user)}>
    <div className="flex gap-4 p-2 h-16 text-[#A9B4C7] items-end hover:bg-[#24303f]">
      <img
        src={`https://robohash.org/${user._id}?set=set5&size=100x100`}
        alt={user.username[0].toUpperCase()}
        className="w-8 h-8 rounded-full"
      />
      <div className="border-b border-[#dadada58] w-full pb-2">
        <span>{user.username}</span>
      </div>
    </div>
  </div>
);

const GroupItem = ({ group, handleGroupClick }) => (
  <div key={group._id} onClick={() => handleGroupClick(group)}>
    <div className="flex gap-4 p-2 h-16 text-[#A9B4C7] items-end ">
      <img
        src={`https://robohash.org/${group._id}?set=set5&size=100x100`}
        alt={group.groupName[0].toUpperCase()}
        className={`w-8 h-8 rounded-full`}
      />
      <div className="border-b border-[#dadada58] w-full pb-2">
        <span>{group.groupName}</span>
      </div>
    </div>
  </div>
);

const Sidebar = ({ joinedGroups, chattedUsers }) => {
  const user = useContext(UserContext);
  const { currentPage } = useContext(CurrentPageContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showChattedUser, setShowChattedUser] = useState(true);
  const [isLoading, setIsLoading] = useState("");
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

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
    navigate(`users/${user._id}/detail`, { state: { user } });
  };

  const handleGroupClick = (group) => {
    if (group.visibility === "Private") {
      alert("This group is private. Only members can view the contents.");
      return;
    }
    navigate(`/details/group/${group._id}`, { state: { group } });
  };

  const handleGroupCreate = () => {
    navigate("groups/create");
    prompt("Enter group name");
  };

  return (
    <div className="w-96 bg-[#1a212c] h-screen relative flex-none">
      <div className="p-4 flex flex-col gap-2 border-b border-gray-200 relative ">
        <h1 className="text-white  text-center">
          {currentPage &&
            currentPage[0].toUpperCase() + currentPage.slice(1) + user.username}
        </h1>

        {currentPage === "groups" && (
          <span
            onClick={handleGroupCreate}
            className="absolute top-0 right-10  hover:bg-[#24303f] w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </span>
        )}

        {currentPage !== "settings" && (
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setShowChattedUser={setShowChattedUser}
          />
        )}
      </div>

      {currentPage === "groups" && (
        <div className="space-y-4 p-4">
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
        <div className="pb-40  overflow-scroll h-screen">
          {chattedUsers.map((chattedUser) => (
            <UserItem
              key={chattedUser._id}
              user={chattedUser}
              handleUserClick={handleUserClick}
            />
          ))}
        </div>
      )}

      {users.length > 0 && !showChattedUser && (
        <div className="pb-40 overflow-scroll h-screen">
          {users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              handleUserClick={handleUserClick}
            />
          ))}
        </div>
      )}

      {users.length === 0 && !showChattedUser && (
        <div className="w-full text-white h-1/2 items-center flex justify-center">
          <span>{!searchQuery && "Search User"}</span>
          <span>
            {searchQuery && (isLoading ? <Loader /> : "No user found")}
          </span>
        </div>
      )}

      {groups.length > 0 && (
        <div className="pb-40 overflow-scroll h-screen">
          {groups.map((group) => (
            <GroupItem
              key={group._id}
              group={group}
              handleGroupClick={handleGroupClick}
            />
          ))}
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default Sidebar;
