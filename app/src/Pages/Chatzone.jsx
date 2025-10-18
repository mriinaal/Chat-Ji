import React, { useState } from 'react';
import "./chatzone.css";

import socketIO from "socket.io-client";

import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Message from '../Components/Message/Message';
import Call from '../Components/Call/Call';

import { useToast } from "@chakra-ui/react";

import ReactScrollToBottom from "react-scroll-to-bottom";

const PROD = "production";
const ENDPOINT = process.env.REACT_APP_ENV === PROD?"https://chatji.onrender.com/":"http://localhost:5000/";

let socket;

export default function Chatzone() {

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'image/gif';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'https://res.cloudinary.com/di5oia1wa/image/upload/v1680889446/MK2_xy1vwi.gif';
  }, []);

  let userName;
  let userPic;
  const toast = useToast();

  useEffect(() => {
    document.title = 'CHAT ZONE | Chat-Ji';
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
    const message =document.getElementById('sendInput').value;
    socket.emit('message', ({message, id, userPic}));
    document.getElementById('sendInput').value = "";
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

  const logout =() => {
    socket.disconnect();
    localStorage.clear(); 
    history.push('/');
    toast({
      title: "Logout Successful",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  }


  return (
    <>
      <div className='chatPage'>
        <div className='header'>
          <Call/>
          <p className='neonText'>{`{ CHAT ZONE }`}</p>
          <img onClick={logout} className="logout" src="https://cdn-icons-png.flaticon.com/512/25/25376.png" alt="LOGOUT"/>
        </div>
        <div className='chatContainer'>
          <ReactScrollToBottom className='chatBox'>
            {messages.map((item, i)=> <Message user= {item.id===id?``:item.user} message={item.message} classs={item.id===id?`right`:`left`} pic={item.userPic}/>)}
          </ReactScrollToBottom>
        </div>
        <div className="inputBox">
          <div id="chatInput">  
            <input type="text" id="sendInput" placeholder='Send Message..'/>
            <button onClick={send} className='sendBtn'> <img src="https://cdn-icons-png.flaticon.com/128/3177/3177384.png"alt="send" /> </button>
          </div>
        </div>
      </div>
    </>
  );
};
