import React from "react";
import { useState } from "react";


function Login () {
    const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
    return ( <>
   <input
   type="email"
   value={email}
   placeholder="user email"
   onChange={(e) => setEmail(e.target.value)}
   />
   <input
   type="password"
   value={password}
   placeholder="your password"
   onChange={(e) => setPassword(e.target.value)}
   />
    <button>submit</button>
    </> );
}

export default Login ;