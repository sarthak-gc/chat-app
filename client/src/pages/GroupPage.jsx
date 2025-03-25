import React from "react";
import CurrentPageContext from "../context/CurrentPageProvider";
import Sidebar from "../components/Sidebar";

const GroupPage = ({ joinedGroups }) => {
  return (
    <div className="space-y-4 p-4">
      hi
      {joinedGroups &&
        joinedGroups.map((group) => (
          <div key={group._id} onClick={() => handleJoinedGroupClick(group)}>
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
        ))}
    </div>
  );
};

export default GroupPage;
