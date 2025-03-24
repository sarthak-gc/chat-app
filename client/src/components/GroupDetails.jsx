import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const GroupDetails = () => {
  const [members, setMembers] = useState([]);
  const location = useLocation();
  const { group } = location.state || {};

  useEffect(() => {
    setMembers(group.members);
  }, [group.members]);

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        {group.groupName[0].toUpperCase() + group.groupName.slice(1)}
      </h1>
      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mr-4">
              {member.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-lg font-medium text-gray-800">
              {member.username}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDetails;
