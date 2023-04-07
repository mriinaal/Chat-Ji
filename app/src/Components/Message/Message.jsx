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
                        <img className='adminPic' src="https://user-images.githubusercontent.com/35910158/35493994-36e2c50e-04d9-11e8-8b38-890caea01850.png" alt="pfp"/>
                    ) : (
                        <img src={pic} alt="pfp"/>
                    )}
                    </div>
                    <div>
                        {`${message}`} 
                    </div>
                </div>
            </div>
        )
    }
    else{
        return (
            <div className={`  messageContainerRight ${classs}`}>
                <div className='identity'>
                    <img src={pic} alt="pfp"/>
                </div>
                <div>
                    {`${message}`}
                </div>
            </div>
        )
    }
}

export default Message