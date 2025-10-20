import React, { useState, useEffect } from "react";
import { useToast, Button, Box, Tooltip } from "@chakra-ui/react";
import Newchat from "../Components/Message/Newchat";
import UserChats from "../Components/Message/UserChats";
import UserOps from "../Components/Message/UserOps";

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
    const loadChat = (chat) => {
        setChat(chat);
    };
    
    return ( 
        <Box width='100%' height={'100vh'} display={'flex'} alignItems={'center'}>
            <Box className="left" borderRight={'1px'} borderRightColor="white" width='30%' height='100vh' bgGradient="linear(to-l, #2F7336, #AA3A38)">
                <Box height={'10%'} borderBottom={'1px'} borderBottomColor={'white'}>
                    <Newchat renderUserChats={renderChats}/>
                </Box>
                <Box color={'white'} height='80%'>
                    <UserChats reload={reload} loadChat={loadChat}/>
                </Box>
                <Box borderTop={'1px'} borderTopColor={'white'} height='10%' cursor="pointer" _hover={{ bg: "black" }} key={userId} padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <UserOps/>
                </Box>
            </Box>
            <Box color={'white'} className='right' width='70%' height='100vh' bgColor={'black'}>
                {
                chat.length!==0?
                    <>
                    <Box color={"white"} height={'10%'} style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent:'center' }}>
                        <img 
                        src={chat[2]} 
                        alt={`pfp`} 
                        style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '20px', display: 'inline' }} 
                        />
                        <Box>
                            <h3 style={{ color:'white', margin: '0'}}>{chat[1]}</h3>
                        </Box>
                    </Box>
                    <Box color={'white'} height='80%'>
                    </Box>
                    <Box height='10%' padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div className="inputBox">
                            <div id="chatInput">  
                            <input type="text" id="sendInput" placeholder='Send Message..'/>
                            <Tooltip label='Send'>
                                <button className='sendBtn'> <img src="https://cdn-icons-png.flaticon.com/128/9380/9380620.png"alt="send" /> </button>
                            </Tooltip>
                            </div>
                        </div>
                    </Box>
                    </>
                    : <></>
                }
            </Box>
        </Box>
    );
}

export default Messages;