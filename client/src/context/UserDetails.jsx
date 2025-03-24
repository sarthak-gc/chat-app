import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();
export const UserDetails = ({ children }) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  return (
    <UserContext.Provider value={{ username }}>{children}</UserContext.Provider>
  );
};

export default UserContext;
