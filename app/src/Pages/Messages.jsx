import React, { useState, useEffect } from "react";
import { useToast, Button, Box, Tooltip, Skeleton } from "@chakra-ui/react";
import Newchat from "../Components/Message/Newchat";
import axios from "axios";
import UserChats from "../Components/Message/UserChats";
import UserOps from "../Components/Message/UserOps";
import Message from "../Components/Message/Message";
import socketIO from 'socket.io-client';
import ReactScrollToBottom from "react-scroll-to-bottom";

const PROD = "production";
const ENDPOINT = process.env.REACT_APP_ENV === PROD?"https://chatji.onrender.com/":"http://localhost:5000/";
let socket;

function Messages() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const userName = JSON.parse(localStorage.getItem("userName"));
    const userEmail = JSON.parse(localStorage.getItem("userEmail"));
    const userPic = JSON.parse(localStorage.getItem("userPic"));
    useEffect(() => {
        document.title = 'Messages | Chat-Ji';
    }, []);
    const toast = useToast();

    const [reload, setReload] = useState(Date.now());
    const renderChats = () => {
        setReload(Date.now());
    };

    const [chat, setChat] = useState([]);
    const loadChat = (newChat) => {
        if (JSON.stringify(chat) !== JSON.stringify(newChat)) {
            setChat(newChat); // Update the chat state only if it's different
        }
    };

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatsLoading, setChatsLoading] = useState(false);
    useEffect(() => {
        if(!userInfo)return;
        socket = socketIO(ENDPOINT, {transports: ['websocket'] });
        socket.on("connection", () =>{
            console.log("User Connected");
            // alert("User Connected");
        });

        //status
        socket.emit('joined', (userEmail));
        const handelStatus = (data) =>{
            setOnlineUsers(data);
            // console.log(data);
        }
        socket.on('status', handelStatus);
        
        //Receive messages
        const handleReceiveMessage = (data) => {
            setMessages(prevMessages => [...prevMessages, data]); // Using functional update
        };
        socket.on("sendMessage", handleReceiveMessage);
    }, []);
    
    const send = () => {
        const message=document.getElementById('sendInput').value;
        if(message.trim().length===0)return;
        socket.emit('message', ({chat:chat[0], _id:Date.now(), message, userName, userEmail, userPic}));
        document.getElementById('sendInput').value = "";
    }
    
    const [msgLoading, setMsgLoading] = useState();
    const [chatHistory, setChatHistory] = useState([]);
    useEffect(() => {
        if(!chatHistory.includes(chat[0])){
            setMsgLoading(true);
            const timer = setTimeout(() => {
                setMsgLoading(false); 
            }, 500); 
            setChatHistory([...chatHistory, chat[0]]);
            return () => clearTimeout(timer);
        }
    }, [chat]);
    
    return ( 
        <Box width='100%' height={'100vh'} display={'flex'} alignItems={'center'}>
            <Box className="left" borderRight={'1px'} borderRightColor="white" width='30%' height='100vh' bgGradient="linear(to-l, #2F7336, #AA3A38)">
                <Box height={'10%'} borderBottom={'1px'} borderBottomColor={'white'}>
                    <Newchat renderUserChats={() => renderChats}/>
                </Box>
                <Box color={'white'} height='80%'>
                    <UserChats reload={reload} loadChat={loadChat} setMessages={setMessages} setChatsLoading={setChatsLoading}/>
                </Box>
                <Box borderTop={'1px'} borderTopColor={'white'} height='10%' cursor="pointer" _hover={{ bg: "black" }} padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <UserOps/>
                </Box>
            </Box>
            <Box color={'white'} className='right' width='70%' height='100vh' bgColor={'black'}>
                {
                chat.length!==0?
                    <>
                    <Box key={chat[0]} color={"white"} height={'10%'} style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent:'center' }}>
                        <img 
                        src={chat[2]} 
                        alt={`pfp`} 
                        style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
                        />
                        <Box>
                            <h3 style={{ display:'inline', color:'white', margin: '0'}}>{chat[1]}</h3>
                            { chat[4]? <></>:
                                <div style={{ display:'inline', color:'white', marginLeft: '4px'}}>
                                {onlineUsers.includes(chat[3]) ? (
                                    <span style={{ color: 'green' }}>🟢</span>
                                ) : (
                                    <span style={{ color: 'red' }}>🔴</span>
                                )}
                            </div>
                            }
                        </Box>
                    </Box>
                    <Box color={'white'} height='80%'>
                        <ReactScrollToBottom className='chatBox'>
                            {
                                msgLoading ? (
                                    <Box>
                                        <Box display="flex" justifyContent="flex-start" mb={2}>
                                        <Skeleton height="50px" width="30%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-end" mb={2}>
                                            <Skeleton height="50px" width="40%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-start" mb={2}>
                                            <Skeleton height="50px" width="40%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-end" mb={2}>
                                            <Skeleton height="50px" width="50%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-start" mb={2}>
                                            <Skeleton height="50px" width="40%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-start" mb={2}>
                                            <Skeleton height="50px" width="30%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-start" mb={2}>
                                            <Skeleton height="50px" width="50%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-end" mb={2}>
                                            <Skeleton height="50px" width="40%" borderRadius="md" />
                                        </Box>
                                        <Box display="flex" justifyContent="flex-end" mb={2}>
                                            <Skeleton height="50px" width="30%" borderRadius="md" />
                                        </Box>
                                    </Box>
                                ) : (
                                    messages.map((msg) => {
                                        const currentChat = msg.chat;
                                        if (currentChat === chat[0]) {
                                            return (
                                                <Message
                                                    key={msg._id}
                                                    user={msg.userEmail === userEmail ? '' : msg.userName}
                                                    message={msg.message}
                                                    classs={msg.userEmail === userEmail ? 'right' : 'left'}
                                                    pic={msg.userPic}
                                                />
                                            );
                                        }
                                        return null; // Explicitly return null for clarity
                                    })
                                )
                            }
                        </ReactScrollToBottom>
                    </Box>
                    <Box height='10%' padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="inputBox">
                            <div id="chatInput">  
                            <input type="text" id="sendInput" placeholder='Send Message..'/>
                            <Tooltip label='Send'>
                                <Button onClick={()=>send()} className='sendBtn'> <img src="https://cdn-icons-png.flaticon.com/128/9380/9380620.png"alt="send" /> </Button>
                            </Tooltip>
                            </div>
                        </div>
                    </Box>
                    </>
                    : 
                    <>
                        {chatsLoading ? (
                            <Box className="chatsLoading-box">
                                <span style={{ marginRight: '10px' }}>{``}</span>
                                {`{ ⏳ LOADING CHATS }`}
                            </Box>
                            ) : <></>
                        }
                    </>
                }
            </Box>
        </Box>
    );
}

export default Messages;