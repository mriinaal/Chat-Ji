import React, { useState } from 'react'
import { useHistory } from "react-router";
import upload from'./upload.png';
import showPwdImg from './show-password.svg';
import hidePwdImg from './hide-password.svg';
import axios from "axios";
import { useToast, Spinner } from "@chakra-ui/react";

function SignUp() {
  const toast = useToast();
  const history = useHistory();
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [password, setpassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  
  const submitHandeler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      setLoading(false);
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (password !== confirmpassword) {
      setLoading(false);
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      // console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("userName", JSON.stringify(data.name));
      localStorage.setItem("userEmail", JSON.stringify(data.email));
      localStorage.setItem("userPic", JSON.stringify(data.pic));
      localStorage.setItem("token", JSON.stringify(data.token));
      setLoading(false);
      history.push("/messages");
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

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      setLoading(false);
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "di5oia1wa");
      fetch("https://api.cloudinary.com/v1_1/di5oia1wa/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
          // console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoading(false);
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  
  
  return (
    <div className='signUp-container'>
      <form action="#">
        <label className='authLabel' htmlFor="name" >NAME:</label>
        <input 
        required 
        id='name' 
        className='authInput' 
        type="text"
        placeholder='Enter Your Name' 
        name='name'
        onChange={(e)=> setname(e.target.value)}
        value={name}
        />

        <label className='authLabel' htmlFor="email" >E-MAIL:</label>
        <input 
        required
        id='email' 
        className='authInput' 
        type='email'
        placeholder='Enter Your E-mail'
        name='email'
        onChange={(e)=> setemail(e.target.value)}
        value={email} 
        />

        <label className='authLabel' htmlFor="password" >CREATE PASSWORD:</label>
        <div className="password-container authInput">
        <input
        required
        id='password'
        name="password"
        placeholder="Enter Your Password"
        type={isRevealPwd ? "text" : "password"}
        value={password}
        onChange={e => setpassword(e.target.value)}
        />
        
        <img
        id='showHide'
        title={isRevealPwd ? "Hide password" : "Show password"}
        src={isRevealPwd ? hidePwdImg : showPwdImg}
        alt='show/hide'
        onClick={() => setIsRevealPwd(prevState => !prevState)}
        />
        </div>

        <label className='authLabel' htmlFor="confirmPassword" >CONFIRM PASSWORD:</label>
        <div className="password-container authInput">
        <input
        required
        id='confirmPassword'
        name="myConfirmPassword"
        placeholder="Confirm Password"
        type={isRevealPwd ? "text" : "password"}
        value={confirmpassword}
        onChange={e => setConfirmPassword(e.target.value)}
        />
        
        <img
        id='showHide'
        title={isRevealPwd ? "Hide password" : "Show password"}
        src={isRevealPwd ? hidePwdImg : showPwdImg}
        alt='show/hide'
        onClick={() => setIsRevealPwd(prevState => !prevState)}
        />
      </div>

        <label className='custom-file-upload' htmlFor="fileToUpload" >
          <img id='uploadCloud'src={upload} alt="upload"/> 
          UPLOAD YOUR PICTURE
        </label>
        <input 
          type="file" 
          name="pic" 
          id="fileToUpload"
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
        />
          {loading ? (
              <div className='authButton'>
                <Spinner size="sm" color="white" />
              </div>
            ) : (
              <button className='authButton' type="button" onClick={submitHandeler}>SIGN-UP</button>
            )}
      </form>
    </div>
  )
}

export default SignUp