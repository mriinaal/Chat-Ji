import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const UserContext = createContext();
export const useUserInfo = () => useContext(UserContext);
const UserInfoProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) history.push("/");
    else setUser(userInfo); 
  }, [history]);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserInfoProvider;