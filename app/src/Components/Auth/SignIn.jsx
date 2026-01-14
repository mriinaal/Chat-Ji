import React, { useState } from 'react'
import showPwdImg from './show-password.svg';
import hidePwdImg from './hide-password.svg';
import axios from "axios";
import { useToast, Spinner } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import '../../Pages/phone.css';

function SignIn() {
  const toast = useToast();
  const history = useHistory();
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const submitHandeler = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      toast({
        title: "PLEASE FILL ALL THE FIELDS!",
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
        title: "LOGIN SUCCESSFUL!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("userId", JSON.stringify(data._id));
      localStorage.setItem("userName", JSON.stringify(data.name));
      localStorage.setItem("userPic", JSON.stringify(data.pic));
      localStorage.setItem("userEmail", JSON.stringify(data.email));
      localStorage.setItem("token", JSON.stringify(data.token));
      setLoading(false);
      history.push("/messages");
    } catch (error) {
      toast({
        title: "ERROR OCCURED!",
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
        placeholder='ENTER YOUR E-MAIL'
        name='email'
        onChange={(e)=> setemail(e.target.value)}
        value={email} 
        />

        <label className='authLabel' htmlFor="signInpassword" >PASSWORD:</label>
        <div className="password-container authInput">
        <input
        required
        
        id='signInpassword'
        name="password"
        placeholder="ENTER YOUR PASSWORD"
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
          {loading ? (
            <div className='authButton'>
                <Spinner size="sm" color="white" />
            </div>
            ) : (
                <button className='authButton' type="button" onClick={submitHandeler}>SIGN-IN</button>
            )}
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