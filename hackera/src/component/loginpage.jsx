import React from "react";
import { useState } from "react";
import "../componentcss/login.css";


function Login () {
    const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
    return ( <>
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
    </div></> );
}

export default Login ;