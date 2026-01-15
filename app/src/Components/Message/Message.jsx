import React from 'react'
import {Box} from "@chakra-ui/react";
import "./message.css"
function Message({msgId, user, message, classs, pic}) {
    if(user){
        return (
            <Box key={msgId} className={`receiver`}>
                <p>{`${user}`}</p>
                <div className={`messageContainer ${classs}`}>
                    <div className='identity'>
                    {user === 'Admin' ? (
                        <img className='adminPic' src="https://user-images.githubusercontent.com/35910158/35493994-36e2c50e-04d9-11e8-8b38-890caea01850.png" alt="pfp"/>
                    ) : (
                        <img src={pic} alt="pfp"/>
                    )}
                    </div>
                    <div>
                        {`${message}`} 
                    </div>
                </div>
            </Box>
        )
    }
    else{
        return (
            <Box key={msgId} className={`messageContainerRight ${classs}`}>
                <div className='identity'>
                    <img src={pic} alt="pfp"/>
                </div>
                <div>
                    {`${message}`}
                </div>
            </Box>
        )
    }
}

export default Message