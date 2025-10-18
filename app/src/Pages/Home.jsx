import React from 'react'
import Tabs from '../Components/Tabs';
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import './phone.css'

function Home() {
  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo) history.push("/messages");
  }, [history]);

  useEffect(() => {
    document.title = 'Home | Chat-Ji';
  }, []);

  return (
    <div className="container">
      <div className="container-1">
        &#123; CHAT JI &#125;
      </div>
      <div className="container-2">
        <Tabs/>
      </div>
    </div>
  );
}

export default Home