import React, { useState } from "react";

function Signin() {
    const [user ,setUser]=useState("")
    const [rep ,setrep]=useState("")
    const [password ,setPasswprd]=useState("")
    return (  <div className="login-box">
        <h1 className="login-title">Create An Account:</h1>
  
        <p>Email:</p>
        <input
          type="text"
          value={user}
          placeholder="username or email"
          onChange={(e) => setUser(e.target.value)}
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
          value={rep}
          placeholder="repeat password"
          onChange={(e) => setRep(e.target.value)}
        />
  
        <button>Sign In</button>
      </div>);
}

export default Signin;
