import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Signin() {
  const [name ,setName]=useState("")
  const [email,setEmail]=useState("")
  const [retypePassword ,setRetypePassword]=useState("")
  const [password ,setPassword]=useState("")
  const navigate=useNavigate();
  const handlesubmit=async(e)=>{
    e.preventDefault();
    console.log();
    try {
        const response = await axios.post("http://localhost:3000/signin", {
         name, email,password,retypePassword
        });
  
        const val = response.data.value;
  
        if (val === 0) {
         console.log("error", "All fields are required");
        } else if (val === 1) {
          console.log("error", "Passwords do not match");
        } else if (val === 2) {
        console.log ("info", "Email already exists. Redirecting to login page...");
          navigate("/login");
        } else if (val === 3) {
         console.log("success", "Sign up successful.");
          navigate("/")
        } else if (val === 4) {
         console.log("error", "Internal server error. Please try again later.");
        } else {
        console.log ("error", "An unexpected error occurred");
        }
      } catch (error) {
       console.log(error);
      }
}
  
  return (  <form on onSubmit={handlesubmit}>
    <div className="login-box">
        <h1 className="login-title">Create An Account:</h1>
        <p>Username:</p>
        <input
          type="text"
          value={name}
          placeholder="name"
          onChange={(e) => setName(e.target.value)}/>

        <p>Email:</p>
        <input
          type="text"
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
  
        <p>Password:</p>
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
  
        <p>Repeat password:</p>
        <input
          type="password"
          value={retypePassword}
          placeholder="repeat password"
          onChange={(e) => setRetypePassword(e.target.value)}
        />
  
        <button>Sign In</button>
      </div>
      </form>);
}

export default Signin;
