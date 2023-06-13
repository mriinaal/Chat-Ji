import React, { useState } from 'react';
import "./chats.css";

import socketIO from "socket.io-client";

import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import Message from '../Components/Message/Message';
import Call from '../Components/Call/Call';

import { useToast } from "@chakra-ui/react";

import ReactScrollToBottom from "react-scroll-to-bottom";

const ENDPOINT = "https://chatji.onrender.com/";

let socket;


export default function Chats() {

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

  const logout =() => {
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
          <input type="text" id='chatInput' placeholder='Send Message..'/>
          <button onClick={send} className='sendBtn'> <img src="http://cdn.onlinewebfonts.com/svg/img_372616.png"alt="send" /> </button>
        </div>
      </div>
    </>
  );
};
