import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, useToast, Button, Input, Box, useDisclosure, color } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, Checkbox,
} from '@chakra-ui/react'


function Newchat({renderUserChats}) {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();
    const firstField = React.useRef()
    const [selectedUsers, setSelectedUsers] = useState({});
    const [searchTerm, setSearchTerm] = useState(""); 
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value); 
    };
    const handleSearch = () => {
        if(searchTerm.trim() === "") {
            toast({
                title: "PLEASE ENTER A SEARCH TERM!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        } 
        fetchData();
    };

    async function fetchData(){
        try {
            setLoading(true);
            const config = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.get(
                "/api/user?search=" + searchTerm,
                config
            );
            setSearchResult(response.data); 
            setLoading(false);
        } catch (error) {
            toast({
                title: "ERROR OCCURED!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }
    const toggleUserSelection = (userId) => {
        setSelectedUsers((prevSelected) => ({
            ...prevSelected,
            [userId]: !prevSelected[userId]
        }));
    };
    const[creatingUser, setCreatingUser] = useState(false);
    async function createChat(){
        setCreatingUser(true);
        const selectedIds = Object.keys(selectedUsers).filter(id => selectedUsers[id]);
        const isGroupChat = selectedIds.length > 1;
        const usersArray = [...selectedIds, userId];
        const newChatData = {
            chatName: isGroupChat ? "NEW GROUP CHAT" : null,
            isGroupChat: isGroupChat,
            users: usersArray,
            groupAdmin: isGroupChat ? userId : null, 
        };
        try {
            const config = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.post(
                "/api/chat/", newChatData,
                config
                
            );
            toast({
                title: "CHAT CREATED SUCCESSFULLY!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setCreatingUser(false);
            renderUserChats();
            onClose();
        } catch (error) {
            setCreatingUser(false);
            toast({
                title: error.response.status===400?error.response.data.message:"ERROR OCCURED WHILE CREATING CHAT!",
                description: error.response.status===400?"":error.response.data.message,
                status: error.response.status===400?"warning":"error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    return (
        <>
            <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height='100%'>
                <Button 
                    width={'100%'}
                    height={'100%'}
                    borderRadius='0px'
                    bg='transparent' 
                    color={'white'}
                    onClick={onOpen}
                    display="flex"
                    alignItems="center"
                    _hover={{ bg: 'black', color: 'white' }} 
                >
                    NEW CHAT
                    <img 
                        src="https://cdn-icons-png.flaticon.com/128/11741/11741042.png" 
                        alt="icon" 
                        style={{ width: '24px', height: '24px', marginLeft: '8px' }} 
                    />
                </Button>
                
            </Box>
            <Modal onClose={onClose} isOpen={isOpen} size='xl' isCentered>
            <ModalOverlay />
            <ModalContent borderRadius='0px' bgGradient="linear(to-l, #2F7336, #AA3A38)">
                <ModalHeader color='white'>SEARCH FOR USER(s)</ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody>
                    <Box display='flex' justifyContent='space-between'>
                        <Input
                            ref={firstField}
                            value={searchTerm}
                            onChange={handleInputChange}
                            borderRadius='0px'
                            placeholder='PLEASE ENTER NAME OR EMAIL TO SEARCH'
                            bg="white" 
                            color="black" 
                            _placeholder={{ color: 'rgba(0, 0, 0, 0.4)', fontSize: '0.9rem' }} 
                            _focus={{ border: 'none', boxShadow: 'none' }}
                        />
                        <Button borderRadius='0px'
                            bg='white' 
                            color={'black'}
                            _hover={{ bg: 'black', color: 'white' }} 
                            onClick={handleSearch}
                        >
                            SEARCH
                        </Button>
                    </Box>
                    <Box width="100%" height="9rem" overflow='auto'>
                        {loading ? (
                            <Box style={{
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                height: '100%',
                                }}>
                                <Spinner size="md" color="white" />
                            </Box>
                        ) : (
                            searchResult.map((user) => (
                                <Box cursor="pointer" _hover={{ bg: "grey" }} paddingTop={3} key={user._id} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Checkbox 
                                        isChecked={!!selectedUsers[user._id]} 
                                        onChange={() => toggleUserSelection(user._id)} 
                                        marginRight="10px"
                                        width="100%"
                                        disaplay="flex" 
                                        alignItems="center"
                                    >
                                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                                            <img 
                                            src={user.pic} 
                                            alt={`${user.name}'s profile`} 
                                            style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
                                            />
                                            <Box>
                                                <h3 style={{ margin: '0', color: 'white', display: 'inline' }}>{user.name}</h3>
                                                <h4 style={{ margin: '0', color: 'white' }}>{user.email}</h4>
                                            </Box>
                                        </Box>
                                    </Checkbox>
                                </Box>
                            ))
                        )}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    {creatingUser ? (
                            <Button 
                                borderRadius='0px'
                                bg='transparent'    
                                _hover={{ bg: 'transparent'}}                              
                            >
                                <Spinner size="md" color="black" />
                            </Button>

                        ) : (
                            <Button 
                                borderRadius='0px'
                                bg='white' 
                                color={'black'}
                                _hover={{ bg: 'black', color: 'white' }} 
                                onClick={() => {
                                    createChat(); 
                                }} 
                                isDisabled={Object.values(selectedUsers).every(selected => !selected)} 
                            >
                                CREATE
                            </Button>
                        )}
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
}

export default Newchat;