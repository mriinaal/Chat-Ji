import React from 'react'
import Tabs from '../Components/Tabs';
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function Home() {
  useEffect(() => {
    document.title = 'Chat Ji';
  }, []);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) history.push("/chats");
    
  }, [history]);


  return (
    <>
      <div className="container-1">
      &#123; CHAT JI &#125;
      </div>
      <div className="container-2">
        <Tabs/>
      </div>
    </>
  );
}

export default Home