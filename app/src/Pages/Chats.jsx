import React from 'react';

import socketIO from "socket.io-client";

import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ColorModeSwitcher from '../Components/ColorModeSwitcher';

const ENDPOINT = "http://localhost:5000/"



export default function Chats() {
  let userName;
  const socket = socketIO(ENDPOINT, {transports: ['websocket'] });

  useEffect(() => {
    document.title = 'CHAT ZONE';
  }, []);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) history.push("/");
    
  }, [history]);

  userName=JSON.parse(localStorage.getItem("userName"));
  
  useEffect(() => {
    socket.on("connect", () =>{
      // console.log("User Connected");
      // alert("User Connected");
    });
  
    return () => {
      
    }
  }, [socket]);
  




  return (
    <>
      <div className='chatPage'>
        <div className='chatContainer'>
          <div className='header'></div>
          <div className='chatBox'></div>
          <div className="inputBox"></div>
        </div>
      </div>
      <div>
        <ColorModeSwitcher/>
      </div>
    </>
  );
};
