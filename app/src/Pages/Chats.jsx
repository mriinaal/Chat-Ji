import React, { useState } from 'react';
import "./chats.css";

import socketIO from "socket.io-client";

import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import ColorModeSwitcher from '../Components/ColorModeSwitcher';

import Message from '../Components/Message/Message';

import ReactScrollToBottom from "react-scroll-to-bottom";

const ENDPOINT = "http://localhost:5000/";

let socket;


export default function Chats() {
  let userName;
  let userPic;

  useEffect(() => {
    document.title = 'CHAT ZONE';
  }, []);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo) history.push("/");
    
  }, [history]);

  userName=JSON.parse(localStorage.getItem("userName"));
  userPic=JSON.parse(localStorage.getItem("userPic"));

  const [id, setid] = useState("");
  const send = () => {
    const message =document.getElementById('chatInput').value;
    socket.emit('message', ({message, id, userPic}));
    document.getElementById('chatInput').value = "";
  }


  useEffect(() => {
    socket = socketIO(ENDPOINT, {transports: ['websocket'] });

    socket.on("connection", () =>{
      // console.log("User Connected");
      // alert("User Connected");

    });
    socket.emit('joined', {userName: `${userName}`});
    

    socket.on(`welcome`, (data)=>{
      setmessages(messages=>[...messages, data]);
      // console.log(socket.id);
      setid(`${socket.id}`);
      // console.log(data.user, data.message);
    });

    socket.on(`userJoined`, (data)=>{
      setmessages(messages=>[...messages, data]);
      // console.log(data.user, data.message);
    });
  
    socket.on('user-disconnect', (data)=>{
      setmessages(messages=>[...messages, data]);
      // console.log(data.user, data.message);
    });
  }, [userName]);

  const [messages, setmessages] = useState([]);
  
  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setmessages([...messages, data]);
      // console.log(data.user, data.message, data.id);
    });
  
    return () => {
      socket.off();
    }
  }, [messages]);



  return (
    <>
      <div className='chatPage'>
        <div className='header'></div>
        <div className='chatContainer'>
          <ReactScrollToBottom className='chatBox'>
            {messages.map((item, i)=> <Message user= {item.id===id?``:item.user} message={item.message} classs={item.id===id?`right`:`left`} pic={item.userPic}/>)}
          </ReactScrollToBottom>
        </div>
        <div className="inputBox">
          <input type="text" id='chatInput' />
          <button onClick={send} className='sendBtn'> <img src="https://cdn-icons-png.flaticon.com/512/60/60525.png"alt="send" /> </button>
        </div>
      </div>
      <div className='ColorModeSwitcher'><ColorModeSwitcher/></div>
    </>
  );
};
