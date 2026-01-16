import React from 'react'
import { useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt';


function VideoCall() {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    if (!userInfo) history.push("/error");
    
  }, [history]);
  
    const { roomCode } = useParams();
    
    let myMeeting = async (element) => {

      const appID = 230224184;
      const serverSecret = process.env.REACT_APP_ZEGO_SECRET;
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomCode,
        Date.now().toString(),
        JSON.parse(localStorage.getItem('userName'))
      );
     
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
             container: element,
             scenario: {
              mode: ZegoUIKitPrebuilt.VideoConference,
             },
        });
       };
      
  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  )
}

export default VideoCall