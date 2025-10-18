import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import socketIO from "socket.io-client";
import Message from '../Components/Message/Message';
import Call from '../Components/Call/Call';
import { effect, Spinner, useToast, Button, Input, Box, useDisclosure } from "@chakra-ui/react";
import ReactScrollToBottom from "react-scroll-to-bottom";
import { ChatState } from "../Context/ChatProvider";
import SearchModal from "../Components/Search/SearchModal";

function Messages() {
    const { user } = ChatState();
    useEffect(() => {
        document.title = 'Messages | Chat-Ji';
    }, []);
    const toast = useToast();
    
    return ( 
        <Box className="main-container">
            
        </Box>
    );
}

export default Messages;