import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast, Skeleton, SkeletonCircle, Box } from "@chakra-ui/react";
import { useLocation } from 'react-router-dom';

function UserChats({ reload, loadChat, setMessages, setChatsLoading }) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchChats = async () => {
            if(!userInfo)return;
            try {
                setLoading(true);        
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
                setChats(data)
                data.forEach(chat => {
                    fetchMessages(chat);
                });
                setLoading(false);
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
                setLoading(false);
            }
        };
        fetchChats();
    }, [reload, location]);

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
                "/api/message?chat=" + chat._id,
                config
            );
            setMessages(data);
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
                chats.map((chat) => {
                    const isGroupChat = chat.isGroupChat;
                    const chatPic = isGroupChat ? 
                                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" : 
                                    chat.users.find(user => user._id !== userId).pic
                    const chatName = isGroupChat ? chat.chatName : chat.users.find(user => user._id !== userId).name
                    const userMail = isGroupChat ? null : chat.users.find(user => user._id !== userId).email
                    return (
                        <Box 
                            onClick={() => loadChat([chat._id,chatName,chatPic,userMail,isGroupChat])} 
                            cursor="pointer" 
                            _hover={{ bg: "grey" }} 
                            key={chat._id} 
                            padding={4} 
                            style={{ color: 'white', display: 'flex', alignItems: 'center' }}
                        >
                            <img 
                                src={chatPic} 
                                alt={`pfp`} 
                                style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
                            />
                            <Box>
                                <h3 style={{ color: 'white', margin: '0' }}>
                                    {chatName}
                                </h3>
                                <h3 style={{ color: 'white', margin: '0' }}>
                                    {chat.latestMessage}
                                </h3>
                            </Box>
                        </Box>
                    );
                })
            )}
        </Box>
    );
}

export default UserChats;