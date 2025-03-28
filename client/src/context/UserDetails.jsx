import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export const UserDetails = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    id: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser({
        username: decoded.username,
        id: decoded.id,
      });
    }
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserContext;
