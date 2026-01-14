import React from 'react'
import {
    Tooltip,
    Box
} from '@chakra-ui/react'
import './call.css'

function Call({ chat, socket }) {

  const userId = JSON.parse(localStorage.getItem("userId"));
  const userName = JSON.parse(localStorage.getItem("userName"));
  const userPic = JSON.parse(localStorage.getItem("userPic"));

  const answerCall = (data)=>{
        const url = `/call/${chat[0]}`;
        window.open(url, '_blank');
    }
  const socketCall = () => {
    // console.log(data);
    socket.emit('sendCall', {chat, userId, userName, userPic});
    answerCall();
  };

  return (
    <Box onClick={()=>socketCall()}>
      <Tooltip label='CALL'>
        <img alt='CALL' src='https://cdn-icons-png.flaticon.com/512/1160/1160041.png' style={{ width: '1.4rem', filter: 'invert(100)'}}/>
      </Tooltip>
    </Box>
  )
}

export default Call