import React, { useState } from 'react'
import showPwdImg from './show-password.svg';
import hidePwdImg from './hide-password.svg';

function Password() {

    const [pwd, setPwd] = useState('');
    const [isRevealPwd, setIsRevealPwd] = useState(false);

  return (
    <div className="password-container">
        <input
        required
        className='authInput'
        id='password'
        name="myPassword"
        placeholder="Enter Your Password"
        type={isRevealPwd ? "text" : "password"}
        value={pwd}
        onChange={e => setPwd(e.target.value)}
        />
        
        <img
        id='showHide'
        title={isRevealPwd ? "Hide password" : "Show password"}
        src={isRevealPwd ? hidePwdImg : showPwdImg}
        alt='show/hide'
        onClick={() => setIsRevealPwd(prevState => !prevState)}
        />
      </div>
  )
}

export default Password
