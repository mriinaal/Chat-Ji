import React from 'react'
import "./message.css"
function Message({user, message, classs}) {
    if(user){
        return (
            <div className={`messageBox ${classs}`}>
                {`${user}: ${message}`}
            </div>
        )
    }
    else{
        return (
            <div className={`messageBox ${classs}`}>
                {`You: ${message}`}
            </div>
        )
    }
}

export default Message