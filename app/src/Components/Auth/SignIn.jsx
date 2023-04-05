import React, { useState } from 'react'
import showPwdImg from './show-password.svg';
import hidePwdImg from './hide-password.svg';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

function SignIn() {
  const toast = useToast();
  const history = useHistory();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [isRevealPwd, setIsRevealPwd] = useState(false);

  const submitHandeler = async () => {
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
        
      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("userName", JSON.stringify(data.name));
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  
  return (
    <div className='signUp-container'>
      <form action="#">

        <label className='authLabel' htmlFor="signInemail" >E-MAIL:</label>
        <input 
        required
        id='signInemail' 
        className='authInput' 
        type='email'
        placeholder='Enter Your E-mail'
        name='email'
        onChange={(e)=> setemail(e.target.value)}
        value={email} 
        />

        <label className='authLabel' htmlFor="signInpassword" >PASSWORD:</label>
        <div className="password-container">
        <input
        required
        className='authInput'
        id='signInpassword'
        name="password"
        placeholder="Enter Your Password"
        type={isRevealPwd ? "text" : "password"}
        value={password}
        onChange={e => setPassword(e.target.value)}
        />
        
        <img
        id='showHide'
        title={isRevealPwd ? "Hide password" : "Show password"}
        src={isRevealPwd ? hidePwdImg : showPwdImg}
        alt='show/hide'
        onClick={() => setIsRevealPwd(prevState => !prevState)}
        />
      </div>

        <div>
          <button className='authButton' type="button" onClick={submitHandeler}>SIGN-IN</button>
        </div>
        <div>
          <button 
          className='authButton'
          type="button" 
          onClick={()=>{
          setemail("guest@example.com");
          setPassword("123456");
          }}
          >
            GET GUEST USER CREDENTIALS
          </button>
        </div>
          
      </form>
    </div>
  )
}

export default SignIn