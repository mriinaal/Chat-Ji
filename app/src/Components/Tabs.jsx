import React from 'react'
import { useState } from 'react';
import '../App.css';
import '../Pages/phone.css';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';

function Tabs() {
    
    const [toggleState, settoggleState] = useState(1);

    const toggleTab = (index) => {
        settoggleState(index);
    };

  return (
    <>
        <div className="tabsBlock">
            <div 
            className={toggleState === 1 ? "tab tab-active" : 'tab'}
            onClick={() => toggleTab(1)}>
                SIGN-IN
            </div>
            <div 
            className={toggleState === 2 ? "tab tab-active" : 'tab'} 
            onClick={() => toggleTab(2)}>
                SIGN-UP
            </div>
        </div>
        <div className="tabsContentBlock">
            <div 
            className={toggleState === 1 ? "tabContainer tabContainer-active" : 'tabContainer'}>
                <SignIn/>
            </div>
            <div className={toggleState === 2 ? "tabContainer tabContainer-active" : 'tabContainer'}>
                <SignUp/>
            </div>
        </div>
    </>
  )
}

export default Tabs