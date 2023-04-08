import React from 'react'
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";

function VideoCall() {
    const history = useHistory();
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
        if (!userInfo) history.push("/error");
        
      }, [history]);


      
  return (
    <div><h1>VideoCall</h1></div>
  )
}

export default VideoCall