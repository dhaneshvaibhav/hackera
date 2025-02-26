import React from "react";
import { useState } from "react";
import "../componentcss/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login () {
    const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const navigate=useNavigate();
const handlesubmit =async(e)=>{
    e.preventDefault();
    console.log(email)
    console.log(password);
    try {
      const response = await axios.post("http://localhost:3000/login", { email, password });
      const val = response.data.value;
      const userName = response.data.name;

      switch (val) {
        case 0:
         console.log("error", "Email and Password are required");
          break;
        
        case 1:
          console.log("invalid password");
          break;
         case 3:
            console.log("internal error");
         break;
        case 2:
          console.log("success", `Welcome, ${userName}! Login successful.`);
          if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            console.log("authtoken stored")
            window.dispatchEvent(new Event("authChange"));
            setTimeout(() => {
              navigate('/', { state: { userName } });
            }, 500);
          } else {
            console.log("error", "Login failed. Token missing.");
          }
          break;
        default:
          console.log("error", "An undefined error occurred");
          break;
      }
    } catch (error) {
      console.log(error);
    }
 }
    return ( <><form onSubmit={handlesubmit}>
    <div className="login-title">
    <div class="unified-login ">
    <h1 class="login-box">Login</h1>
    </div>
    <p>Email:</p>
   <input
   type="email"
   value={email}
   placeholder="user email"
   onChange={(e) => setEmail(e.target.value)}
   />
    <p>Password:</p>
   <input
   type="password"
   value={password}
   placeholder="your password"
   onChange={(e) => setPassword(e.target.value)}
   />
    <br/>
    <button>submit</button>
    </div>
    </form></> );
}

export default Login ;