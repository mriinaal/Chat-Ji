import React from 'react';
import { useEffect } from "react";
import { useHistory } from "react-router-dom";


export default function Chats() {
  useEffect(() => {
    document.title = 'CHAT ZONE';
  }, []);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) history.push("/");
  
  }, [history]);



  return (
    <div>
      Chats
    </div>
  );
};
