import { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, useToast, Button, Input, Box } from "@chakra-ui/react";

function SearchModal() {
    const toast = useToast();
    const token = JSON.parse(localStorage.getItem("token"));
    const [searchTerm, setSearchTerm] = useState(""); 
    const [isVisible, setIsVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value); 
    };
    const handleFocus = () => {
        setIsVisible(true); 
    };
    const handleBlur = () => {
        setIsVisible(false); 
    };
    const handleSearch = () => {
        if(searchTerm.trim() === "") {
            toast({
                title: "Please enter a search term",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        } 
        setIsVisible(true);
        fetchData();
    };

    useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'image/gif';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'https://res.cloudinary.com/di5oia1wa/image/upload/v1680889446/MK2_xy1vwi.gif';
    }, []);

    async function fetchData(){
        try {
            setLoading(true);
            const config = {
                headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(
                "/api/user?search=" + searchTerm,
                config
            );
            
            setUsers(data);
            setLoading(false);
            
            // console.log(JSON.stringify(data));
            toast({
                title: "User(s) fetched",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    return ( 
        <>
            <div style={{ display: 'flex', height:'6%', alignItems: 'center', border: '2px solid black' }}>
                <Input
                    placeholder="SEARCH ONLINE..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    size="md"
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: 'none', 
                        color: 'white', 
                        outline: 'none',
                    }}
                    _placeholder={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }} 
                    _focus={{ border: 'none', boxShadow: 'none' }}
                    />
                <Button onClick={handleSearch} colorScheme='' borderRadius="0"
                    style={{ 
                        transition: 'background-color 0.3s ease', 
                    }} 
                    _hover={{
                        backgroundColor: 'black', 
                        color: 'white' 
                    }}>
                    SEARCH
                </Button>
            </div>
            <Box 
                className="output-container" 
                style={{
                    display: isVisible ? "block" : "none",
                    backgroundColor: 'black', 
                    height: '18%',
                    overflowY: 'auto', 
                    padding: '10px',
                    position: 'fixed',
                    width: '28.55%',
                    zIndex: 1000
                }}
            >
                {loading ? (
                    <div style={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%',
                        }}>
                        <Spinner size="md" color="white" />
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <img 
                                src={user.pic} 
                                alt={`${user.name}'s profile`} 
                                style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px' }} 
                            />
                            <div>
                                <h3 style={{ margin: '0', color: 'white' }}>{user.name}</h3>
                                <h4 style={{ margin: '0', color: '#888' }}>{user.email}</h4>
                            </div>
                        </div>
                    ))
                )}
            </Box>
        </>
     );
}

export default SearchModal;