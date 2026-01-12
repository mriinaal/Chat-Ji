import { Box } from "@chakra-ui/react";
function CustomNotificationToast({ latestMsg, loadChat}){
    return(
        <Box onClick={() => {loadChat([latestMsg.chat[0], latestMsg.userName, latestMsg.userPic, latestMsg.userMail, latestMsg.isGroupChat]);}}
            bg="white"
            boxShadow="md"
            p={4}
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.05)', cursor: 'pointer' }}
            style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent:'flex-start' }}>
            <img 
            src={latestMsg.userPic} 
            alt={`pfp`} 
            style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
            />
            <Box _>
                <h3 style={{ display:'inline', color:'black', margin: '0'}}>{'NEW MESSAGE !'}</h3>
                <div display={'inline'} fontSize="md">{`${latestMsg.userName}: ${latestMsg.message}`}</div>
            </Box>
        </Box>
    );
}

export default CustomNotificationToast;