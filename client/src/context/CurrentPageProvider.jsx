import React, { createContext, useEffect, useState } from "react";

const CurrentPageContext = createContext();

export const CurrentPageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState("users");
  useEffect(() => {
    if (window.location.pathname.startsWith("/feed/")) {
      setCurrentPage(window.location.pathname.split("/")[2]);
    }
  }, []);
  const SetToUsersPage = () => setCurrentPage("users");
  const SetToGroupPage = () => setCurrentPage("groups");
  const SetToSettingPage = () => setCurrentPage("settings");

  return (
    <CurrentPageContext.Provider
      value={{ currentPage, SetToUsersPage, SetToGroupPage, SetToSettingPage }}
    >
      {children}
    </CurrentPageContext.Provider>
  );
};

export default CurrentPageContext;
