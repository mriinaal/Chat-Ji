import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast, Skeleton, SkeletonCircle, Box } from "@chakra-ui/react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

function UserChats({ onlineUsers, chatsList, setChatsList, reload, loadChat, setMessages, setChatsLoading, chats, setChats }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [firstFetchChat, setFirstFetchChat] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            if(!userInfo)return;
            try {
                if(firstFetchChat){
                    setLoading(true);
                }        
                const config = {
                    headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const {data} = await axios.get(
                    "/api/chat?user=" + userId,
                    config
                );
                // console.log(data);
                setChats(data);
                data.forEach(chat => {
                    if(!chatsList.includes(chat._id)){
                        setChatsList(chatsList =>[...chatsList, chat._id]);
                        if(firstFetchChat){
                            fetchMessages(chat);
                        }
                    }
                });
                setFirstFetchChat(false);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast({
                    title: "ERROR OCCURED WHILE FETCHING CHATS!",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }finally{
                setLoading(false);
            }
        };
        fetchChats();
    }, [location, reload]);

    const fetchMessages = async (chat) => {
        if(!userInfo)return;
        try {
            setChatsLoading(true);        
            const config = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const {data} = await axios.get(
                "/api/message?user=" + chat._id,
                config
            );
            data.forEach(msg => {
                const chatId = msg.chat._id;
                const isGroupChat = msg.chat.isGroupChat;
                const chatPic = isGroupChat ? 
                                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" : 
                                chat.users.find(user => user._id !== userId).pic
                const chatName = isGroupChat ? msg.chat.chatName : chat.users.find(user => user._id !== userId).name
                const chatUserId = isGroupChat ? msg.chat.users : chat.users.find(user => user._id !== userId)._id

                // console.log(msg);

                const chatArray = [chatId, chatName, chatPic, chatUserId, isGroupChat];
                const msgObj = {
                    chat: chatArray,
                    message: msg.message,
                    userId: msg.userId,
                    userName: msg.userName,
                    userPic: msg.userPic,
                    _id : msg._id
                }
                setMessages(prevMessage => [...prevMessage, msgObj]);
            });
        } catch (error) {
            toast({
                title: "ERROR OCCURED WHILE FETCHING CHATS!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }finally{
            setChatsLoading(false);
        }
    };

    return (
        <Box height={'100%'} width="100%" color='white' overflow='auto'>
            {loading ? (
                <Box display="flex" flexDirection="column" p={4}>
                    {[...Array(10)].map((_, index) => (
                        <Box 
                            key={index} 
                            display="flex" 
                            alignItems="center" 
                            mb={4}
                        >
                            <SkeletonCircle size="45px" />
                            <Box ml={3}>
                                <Skeleton mb={2} height="10px" width="100px" />
                                <Skeleton height="10px" width="150px" mb={2} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <TransitionGroup>
                {chats.map((chat) => {
                    const isGroupChat = chat.isGroupChat;
                    const chatPic = isGroupChat ? 
                                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" : 
                                    chat.users.find(user => user._id !== userId).pic
                    const chatName = isGroupChat ? chat.chatName : chat.users.find(user => user._id !== userId).name
                    const chatUserId = isGroupChat ? chat.users : chat.users.find(user => user._id !== userId)._id
                    const latestMessage = chat.latestMessage;
                    
                    return (
                        <CSSTransition
                            key={chat._id}
                            timeout={300} // Duration of animation
                            classNames="chat-item"
                        >
                        <Box 
                            onClick={() => loadChat([chat._id,chatName,chatPic,chatUserId,isGroupChat])} 
                            cursor="pointer" 
                            _hover={{ bg: "grey" }} 
                            key={chat._id} 
                            padding={4} 
                            style={{ color: 'white', display: 'flex', alignItems: 'center' }}
                        >
                            <img 
                                src={chatPic} 
                                alt={`pfp`} 
                                style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '0px', display: 'inline' }} 
                            />
                            {
                            isGroupChat ?
                                <span style={{transform: 'translateX(-65%) translateY(65%)', color: 'green' }}>&nbsp;&nbsp;</span>
                            : 
                                onlineUsers.includes(chatUserId) ? (
                                    <span style={{transform: 'translateX(-65%) translateY(65%)', color: 'green' }}>🟢</span>
                                ) : (
                                    <span style={{transform: 'translateX(-65%) translateY(65%)', color: 'red' }}>🔴</span>
                                )
                            }
                            <Box className="chatUsersName">
                                <h3 style={{ color: 'white', margin: '0' }}>
                                    {chatName}
                                </h3>
                                
                                    {
                                        (latestMessage!==null && latestMessage!==undefined) ?
                                        <h3 style={{ color: 'white', margin: '0' }}>
                                            {latestMessage.userId === userId ? "You: " : isGroupChat?(latestMessage.userName+": "):""}
                                            {latestMessage.message}
                                        </h3>
                                        :""
                                    }
                                    
                            </Box>
                        </Box>
                        </CSSTransition>
                    );
                })}
                </TransitionGroup>
            )}
        </Box>
    );
}

export default UserChats;