import React from 'react';
import "./chats.css";

import socketIO from "socket.io-client";

import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ColorModeSwitcher from '../Components/ColorModeSwitcher';

const ENDPOINT = "http://localhost:5000/";



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
    socket.on("connection", () =>{
      // console.log("User Connected");
      // alert("User Connected");
    });
    socket.emit('joined', {userName: `${userName}`});
    socket.on(`welcome`, (data)=>{
      console.log(data.user, data.message);
    });
    socket.on(`userJoined`, (data)=>{
      console.log(data.user, data.message);
    });
  
    socket.on('user-disconnect', (data)=>{
      console.log(data.user, data.message);
    });
  }, [socket]);
  




  return (
    <>
      <div className='chatPage'>
        <div className='header'></div>
        <div className='chatContainer'>
          <div className='chatBox'></div>
        </div>
        <div className="inputBox">
          <input type="text" id='chatInput' />
          <button className='sendBtn'> <img src="https://cdn-icons-png.flaticon.com/512/60/60525.png"alt="send" /> </button>
        </div>
      </div>
      <div className='ColorModeSwitcher'><ColorModeSwitcher/></div>
    </>
  );
};
