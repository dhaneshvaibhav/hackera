import React from "react"
import { useState } from "react";
function Signin() {
    const [user ,setUser]=useState("")
    const [rep ,setrep]=useState("")
    const [password ,setPasswprd]=useState("")
    return (  <>
    <h1>Create An Account:</h1>
    <p>Email:</p>
    <input
    type="text"
    value={user}
    placeholder="username or email"
    onChange={(e)=>setUser(e.target.value)}/>
    <p>Password:</p>
    <input
    type="text"
    value={password}
    placeholder="password"
    onChange={(e)=>setPasswprd(e.target.value)}/>
    <p>Repeat password:</p>
    <input
    type="text"
    value={rep}
    placeholder="repeat password"
    onChange={(e)=>setrep(e.target.value)}/>
    <button>signin</button>
    </>);
}

export default Signin;