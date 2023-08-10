import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, selectLoggedStatus } from "./authSlice";
import { useEffect, useState } from "react";
import * as icons from "react-icons/ai";
import Button from "../componets/Button";

import { useAppDispatch } from "../../app/hooks";

const SignUp = () => {
  const isLogged = useSelector(selectLoggedStatus);
  const [errorMessage, setErrorMessage] = useState(false) //f;ag for not filling every inputs
  const [wrongPwd, setWrongPwd] = useState(false) //flag for not matching passworsd
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [signUpData, setSignUpData] = useState({
    username: "",
    display_name: "",
    password: "",
    con_pwd: "",
    email: "",
    image:''
  });

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged]);

  const handleInputChange = (event: any) => {
    const { name, value, type, files } = event.target;
    // For regular input fields
    if (type !== "file") {
      setSignUpData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else { // For file input
      setSignUpData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0], // Store the file object, not just its name
      }));
    }
  };
  

  const handleShowPwd = () => {
    setInputType((prevInputType) => (prevInputType === "password" ? "text" : "password"));
  };

  const signUp = () => {
    console.log('sign upppp', signUpData);
    
    if (signUpData.username !== '' &&
     signUpData.display_name !== '' &&
     signUpData.password !== '' &&
     signUpData.con_pwd !== '' &&
     signUpData.email !== '') {
      if (signUpData.password === signUpData.con_pwd) {
        dispatch(registerUser(signUpData))
        .then((res) => {
          if (res.payload['reg'] === 'success') {
            navigate('/')
          }
        })
      }else setWrongPwd(true)
    }else setErrorMessage(true)
  };

  return (
    <div className="container mx-auto p-4 border-gray-600 border-2 w-72 md:w-100 h-fit flex flex-col relative 2xl:left-16 3xl:left-40 top-10 left-10 items-center justify-center rounded-lg">
      <h1 className="text-2xl font-bold mb-4  underline relative right-20">Sign Up</h1>
      <div className="flex flex-col items-center">
        <p className="font-semibold relative right-14">Username</p>
        <input
          className="input"
          placeholder="Enter username"
          name="username"
          value={signUpData.username}
          onChange={handleInputChange}
        />
        <br />
        <p className="font-semibold relative right-11">Display Name</p>
        <input
          className="input"
          placeholder="Enter display name"
          name="display_name"
          value={signUpData.display_name}
          onChange={handleInputChange}
        />
        <br />
        <p className="font-semibold relative right-14">Password</p>
        <input
          className="input"
          placeholder="Enter password"
          type={inputType}
          name="password"
          value={signUpData.password}
          onChange={handleInputChange}
        />
        {inputType === "password" ? (
          <icons.AiFillEye className="relative bottom-5 left-23" onClick={handleShowPwd} />
        ) : (
          <icons.AiFillEyeInvisible className="relative bottom-5 left-23" onClick={handleShowPwd} />
        )}
        <br />
        <p className="font-semibold relative right-7">Confirm password</p>
        <input
          className="input"
          placeholder="Enter password"
          type={inputType}
          name="con_pwd"
          value={signUpData.con_pwd}
          onChange={handleInputChange}
        />
        {inputType === "password" ? (
          <icons.AiFillEye className="relative bottom-5 left-23" onClick={handleShowPwd} />
        ) : (
          <icons.AiFillEyeInvisible className="relative bottom-5 left-23" onClick={handleShowPwd} />
        )}
        <br />
        <p className="font-semibold relative right-18">Email</p>
        <input
          type="text"
          className="input"
          placeholder="Enter your email"
          name="email"
          value={signUpData.email}
          onChange={handleInputChange}
        />
        <br />
        <p className="font-semibold relative right-5">Profile Picture</p>
        <input 
        type="file"
         className="relative left-10" 
         name="image" 
         onChange={handleInputChange}  
         accept="image/jpg, image/jpeg, image/png"
         />
        <br />
        <div className="flex flex-row relative right-10 bottom-4">
          <input type="checkbox" checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} />
          <p className="text-xs font-semibold relative left-2">Agree to terms</p>
        </div>
        <a href="/login" className="text-xs text-blue-400 underline font-medium relative right-4">
          Already has an account?
        </a>
        <br />
        <Button text="Sign up" className="w-36" onClick={signUp} />
      </div>
    </div>
  );
};

export default SignUp;
