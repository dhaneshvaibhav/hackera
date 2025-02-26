import React, { useState } from "react";

function Signin() {
  const [name ,setName]=useState("")
  const [email,setEmail]=useState("")
  const [retypePassword ,setRetypePassword]=useState("")
  const [password ,setPassword]=useState("")
    return (  
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
          onChange={(e) => setUser(e.target.value)}
        />
  
        <p>Password:</p>
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPasswprd(e.target.value)}
        />
  
        <p>Repeat password:</p>
        <input
          type="password"
          value={retypePassword}
          placeholder="repeat password"
          onChange={(e) => setrep(e.target.value)}
        />
  
        <button>Sign In</button>
      </div>);
}

export default Signin;
