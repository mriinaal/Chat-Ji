import React from 'react'
import "./message.css"
function Message({user, message, classs, pic}) {
    if(user){
        return (
            <div className={`receiver`}>
                <p>{`${user}`}</p>
                <div className={`messageContainer ${classs}`}>
                    <div className='identity'>
                    {user === 'Admin' ? (
                        <img src="https://cdn-icons-png.flaticon.com/128/2840/2840215.png" alt="pfp"/>
                    ) : (
                        <img src={pic} alt="pfp"/>
                    )}
                    </div>
                    <div className={`messageBox ${classs}`}>
                        {`${message}`} 
                    </div>
                </div>
            </div>
        )
    }
    else{
        return (
            <div className={`  messageContainer ${classs}`}>
                <div className='identity'>
                    <img src={pic} alt="pfp"/>
                </div>
                <div className={`messageBox ${classs}`}>
                    {`${message}`}
                </div>
            </div>
        )
    }
}

export default Message