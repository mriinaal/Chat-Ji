import React, { useState, useEffect } from "react";
import { useToast, Button, Box } from "@chakra-ui/react";
import Newchat from "../Components/Message/Newchat";
import UserChats from "../Components/Message/UserChats";

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
    
    return ( 
        <Box className="left" width='100%' height={'100vh'} display={'flex'} alignItems={'center'}>
            <Box borderRight={'1px'} borderRightColor="white" width='30%' height='100vh' bgGradient="linear(to-l, #2F7336, #AA3A38)">
                <Box _hover={{ bg: "black" }} height={'10%'} borderBottom={'1px'} borderBottomColor={'white'}>
                    <Newchat renderUserChats={renderChats}/>
                </Box>
                <Box color={'white'} height='80%'>
                    <UserChats reload={reload}/>
                </Box>
                <Box borderTop={'1px'} borderTopColor={'white'} height='10%' cursor="pointer" _hover={{ bg: "black" }} key={userId} padding={4} style={{ color:'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <h3 style={{ color:'white', margin: '0'}}>{userName}</h3>
                        <h3 style={{ color:'white', margin: '0'}}>{`${userEmail}`}</h3>
                    </Box>
                    <img 
                    src={userPic} 
                    alt={`pfp`} 
                    style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
                    />
                </Box>
            </Box>
            <Box className='right' width='70%' height='100vh' bgColor='black'>
            </Box>
        </Box>
    );
}

export default Messages;