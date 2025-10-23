import React, { useState, useEffect } from "react";
import { useToast, Button, Box, Tooltip, Skeleton, Text } from "@chakra-ui/react";
import Newchat from "../Components/Message/Newchat";
import axios from "axios";
import UserChats from "../Components/Message/UserChats";
import UserOps from "../Components/Message/UserOps";
import Message from "../Components/Message/Message";
import socketIO from 'socket.io-client';
import ReactScrollToBottom from "react-scroll-to-bottom";
import CustomNotificationToast from "../Components/CustomNotificationToast";
import './Messages.css';

const PROD = "production";
const ENDPOINT = process.env.REACT_APP_ENV === PROD?"https://chatji.onrender.com/":"http://localhost:5000/";
let socket;
let chatId;

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
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatsLoading, setChatsLoading] = useState(false);
    const [chat, setChat] = useState(["","","","",""]);
    const loadChat = (newChat) => {
        setChat(newChat);
    };

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

    const [lastMsg, setLastMsg]=useState(null);
    const [chatsList, setChatsList] = useState([]);

    useEffect(()=>{
        const latestMsg = messages[messages.length - 1];
        setLastMsg(latestMsg);
        if(latestMsg&&latestMsg!==lastMsg&&chatsList.includes(latestMsg.chat)&&latestMsg.chat!==chat[0]&&latestMsg.userEmail!==userEmail){
            toast({
                title: latestMsg.userName,
                description: latestMsg.message,
                duration: 2500,
                position: "top-left",
                render: () => (
                    <CustomNotificationToast loadChat={loadChat} latestMsg={latestMsg}/>
                ),
            });                
        }
    },[chat, chatsList, messages, lastMsg])
    
    const send = (chat) => {
        const message=document.getElementById('sendInput').value;
        if(message.trim().length===0)return;
        socket.emit('message', ({chat, _id:Date.now(), message, userName, userEmail, userPic}));
        document.getElementById('sendInput').value = "";
    } 
    
    return ( 
        <Box width='100%' height={'100vh'} display={'flex'} alignItems={'center'}>
            <Box className="left" borderRight={'1px'} borderRightColor="white" width='25%' height='100vh' bgGradient="linear(to-l, #2F7336, #AA3A38)">
                <Box height={'10%'} borderBottom={'1px'} borderBottomColor={'white'}>
                    <Newchat renderUserChats={() => renderChats}/>
                </Box>
                <Box color={'white'} height='80%'>
                    <UserChats onlineUsers={onlineUsers} setChatsList={setChatsList} reload={reload} loadChat={loadChat} setMessages={setMessages} setChatsLoading={setChatsLoading}/>
                </Box>
                <Box borderTop={'1px'} borderTopColor={'white'} height='10%' cursor="pointer" _hover={{ bg: "black" }} padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <UserOps/>
                </Box>
            </Box>
            <Box color={'white'} className='right' width='75%' height='100vh' bgColor={'black'}>
                {
                chat[0]!==""?
                    <>
                    <Box key={chat[0]} color={"white"} height={'10%'} style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent:'center' }}>
                        <img 
                        src={chat[2]} 
                        alt={`pfp`} 
                        style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
                        />
                        <Box _>
                            <h3 style={{ display:'inline', color:'white', margin: '0'}}>{chat[1]}</h3>
                            { chat[4]? <></>:
                                <div style={{ display:'inline', color:'white', marginLeft: '4px'}}>
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
                                                    msgId={msg._id}
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
                            <input type="text" id="sendInput" placeholder='SEND MESSAGE..'/>
                            <Tooltip label='Send'>
                                <Button onClick={()=>send(chat[0])} className='sendBtn'> <img src="https://cdn-icons-png.flaticon.com/128/9380/9380620.png"alt="send" /> </Button>
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