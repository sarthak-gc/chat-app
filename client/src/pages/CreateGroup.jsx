import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const CreateGroup = () => {
  const [newGroupData, setNewGroupData] = useState({
    groupName: "",
    members: [],
    visibility: "",
  });

  // const promptGroupCreation = () => {
  //   setNewGroupData({
  //     groupName: "",
  //     members: [],
  //     visibility: "",
  //   });
  // };
  // const handleGroupCreation = () => {};
  return (
    <>
      {/* <Sidebar /> */}
      <div>CreateGroup</div>
    </>
  );
};

export default CreateGroup;
