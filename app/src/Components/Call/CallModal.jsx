import React, { useState } from 'react'
import {
    Box
} from '@chakra-ui/react'

function CallModal ({data}) {

    const answerCall = (data)=>{
        const url = `/call/${data.chat[0]}`;
        window.open(url, '_blank');
    }

    return (
        <Box onClick={()=>answerCall(data)}
            bg="white"
            boxShadow="md"
            p={4}
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.05)', cursor: 'pointer' }}
            style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent:'flex-start' }}>
            <img 
            src={data.userPic} 
            alt={`pfp`} 
            style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px', display: 'inline' }} 
            />
            <Box _>
                <h3 display={'inline'} fontSize="md">{`${data.userName} is calling`} {(data.chat[4])?` FROM ${data.chat[1]}`:``}</h3>
            </Box>
        </Box>
    )
}

export default CallModal