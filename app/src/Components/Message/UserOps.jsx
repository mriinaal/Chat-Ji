import { useToast, Button, Box } from "@chakra-ui/react";

function UserOps() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const userName = JSON.parse(localStorage.getItem("userName"));
    const userEmail = JSON.parse(localStorage.getItem("userEmail"));
    const userPic = JSON.parse(localStorage.getItem("userPic"));

    return (
        <>
            <Box>
                <h3 style={{ color:'white', margin: '0'}}>{userName}</h3>
                <h3 style={{ color:'white', margin: '0'}}>{`${userEmail}`}</h3>
            </Box>
            <img 
            src={userPic} 
            alt={`pfp`} 
            style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
            />
        </>
    );
}

export default UserOps;