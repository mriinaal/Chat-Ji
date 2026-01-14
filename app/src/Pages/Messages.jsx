import React, { useState, useEffect } from "react";
import { useToast, Button, Box, Tooltip, Skeleton } from "@chakra-ui/react";
import Newchat from "../Components/Message/Newchat";
import axios from "axios";
import UserChats from "../Components/Message/UserChats";
import UserOps from "../Components/Message/UserOps";
import Message from "../Components/Message/Message";
import socketIO from 'socket.io-client';
import { useHistory } from "react-router-dom";
import ReactScrollToBottom from "react-scroll-to-bottom";
import CustomNotificationToast from "../Components/CustomNotificationToast";
import Call from '../Components/Call/Call';
import './Messages.css';
import CallModal from "../Components/Call/CallModal";

const PROD = "production";
const ENDPOINT = process.env.REACT_APP_ENV === PROD?"https://chatji.onrender.com/":"http://localhost:5000/";
let socket;

function Messages() {
    const history = useHistory();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const userName = JSON.parse(localStorage.getItem("userName"));
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
    const [isTyping, setIsTyping] = useState(true);
    const [typeData, setTypeData] = useState(null);

    useEffect(() => {
        if(!userInfo)return;
        socket = socketIO(ENDPOINT, {transports: ['websocket'] });
        socket.on("connection", () =>{
            console.log("User Connected");
            // alert("User Connected");
        });

        //status
        socket.emit('joined', (userId));
        const handelStatus = (data) =>{
            setOnlineUsers(data);
            // console.log(data);
        }
        socket.on('status', handelStatus);
        
        //Receive messages
        const handleReceiveMessage = (data) => {
            // console.log(data);
            setMessages(prevMessages => [...prevMessages, data]); // Using functional update
        };
        socket.on("sendMessage", handleReceiveMessage);

        //Receive call
        const handleCall = (data) => {
            // console.log(data);
            toast({
                title: 'latestMsg.userName',
                description: 'latestMsg.message',
                duration: 10000,
                position: "bottom",
                render: () => (
                    <CallModal data={data}/>
                ),
            });    
        };
        socket.on("sendCall", handleCall);

        //typing event
        const handleTyping = (data) => {
            setTypeData(data)
        }
        socket.on("typingSocketEvent", handleTyping);
    }, []);

    const [chats, setChats] = useState([]);
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

    useEffect(() => {
        setIsTyping(true);
        // Stop typing indicator after a timeout
        setTimeout(() => {
            setIsTyping(false);
            setTypeData(null);
        }, 3000);
    }, [chat, typeData]);

    const [lastMsg, setLastMsg]=useState(null);
    const [chatsList, setChatsList] = useState([]);

    useEffect(()=>{
        const latestMsg = messages[messages.length - 1];
        // console.log(latestMsg);
        setLastMsg(latestMsg);
        updateLatestMessages(latestMsg);
        if(latestMsg&&latestMsg!==lastMsg&&(typeof latestMsg._id === 'number')){
            if(!chatsList.includes(latestMsg.chat[0])){
                renderChats();
            }
            if(latestMsg.chat[0]!==chat[0]&&latestMsg.userId!==userId){
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
        }
    },[chat, chatsList, messages])

    const updateLatestMessages = (newMessage) => {
        if(newMessage !== undefined && newMessage !== null){   
            const updatedChats = chats.map(chat => {
                if (newMessage.chat[0] === chat._id) {
                    return { ...chat, latestMessage: newMessage, updatedAt: Date.now() };
                }
                return chat;
            });            
            const sortedChats = updatedChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setChats(sortedChats);                   
        }
    };
    
    const send = (chat) => {
        const message=document.getElementById('sendInput').value;
        if(message.trim().length===0)return;
        socket.emit('message', ({chat, _id:Date.now(), message, userName, userId, userPic}));
        updateMsgCollection(chat[0], userId, message);
        document.getElementById('sendInput').value = "";
    } 

    async function updateMsgCollection(chat, user, message){
        const msgData = {
            chatId: chat,
            userId: user,
            msg: message
        };
        try {
            const config = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.post(
                "/api/message/", msgData,
                config
            );
        } catch (error) {
            toast({
                title: "ERROR OCCURED WHILE SENDING MESSAGE!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            send(chat);
        }
        else {
            socket.emit('typingSocketEvent', ({chat, userName, userId, userPic}))
        }
    };

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
        <Box width='100%' height={'100vh'} display={'flex'} alignItems={'center'}>
            <Box className="left" borderRight={'1px'} borderRightColor="white" width='25%' height='100vh' bgGradient="linear(to-l, #2F7336, #AA3A38)">
                <Box height={'10%'} borderBottom={'1px'} borderBottomColor={'white'}>
                    <Newchat renderUserChats={renderChats}/>
                </Box>
                <Box color={'white'} height='80%'>
                    <UserChats onlineUsers={onlineUsers} chatsList={chatsList} setChatsList={setChatsList} reload={reload} loadChat={loadChat} setMessages={setMessages} setChatsLoading={setChatsLoading} chats={chats} setChats={setChats} updateLatestMessages={updateLatestMessages} isTyping={isTyping} typeData={typeData} currentChat={chat}/>
                </Box>
                <Box borderTop={'1px'} borderTopColor={'white'} height='10%' cursor="pointer" _hover={{ bg: "black" }} padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <UserOps/>
                </Box>
            </Box>
            <Box color={'white'} className='right' width='75%' height='100vh' bgColor={'black'}>
                {
                chat[0]!==""?
                    <>
                    <Box key={chat[0]} color={"white"} height={'10%'} style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent:'space-between', paddingLeft:'1.4rem', paddingRight:'1.4rem' }}>
                        <Call chat={chat} socket={socket}/>
                        <Box style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent:'center' }}>
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
                        <Tooltip label='LOGOUT'>
                            <img onClick={logout} style={{ width: '1.8rem', filter: 'invert(100)'}} src="https://cdn-icons-png.flaticon.com/512/4739/4739887.png" alt="LOGOUT"/>
                        </Tooltip>
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
                                        const currentChat = msg.chat[0];
                                        if (currentChat === chat[0]) {
                                            return (
                                                <Message
                                                    key={msg._id}
                                                    msgId={msg._id}
                                                    user={msg.userId === userId ? '' : msg.userName}
                                                    message={msg.message}
                                                    classs={msg.userId === userId ? 'right' : 'left'}
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
                    {isTyping && typeData && typeData.chat[0]===chat[0]?<div className="typing-indicator">{chat[4]?typeData.userName+' is':''} typing...</div>:''}
                    <Box height='10%' padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="inputBox">
                            <div id="chatInput">  
                            <input onKeyDown={handleKeyDown} type="text" id="sendInput" placeholder='SEND MESSAGE..'/>
                            <Tooltip label='Send'>
                                <Button onClick={()=>send(chat)} className='sendBtn'> <img src="https://cdn-icons-png.flaticon.com/128/9380/9380620.png"alt="send" /> </Button>
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