import React from "react"
import { useState } from "react";
function Signin() {
    const [user ,setUser]=useState("")
    const [rep ,setrep]=useState("")
    const [password ,setPasswprd]=useState("")
    return (  <>
    <input
    type="text"
    value={user}
    placeholder="username or email"
    onChange={(e)=>setUser(e.target.value)}/>
    <input
    type="text"
    value={password}
    placeholder="password"
    onChange={(e)=>setPasswprd(e.target.value)}/>
    <input
    type="text"
    value={rep}
    placeholder="repeat password"
    onChange={(e)=>setrep(e.target.value)}/>
    <button>signin</button>
    </>);
}

export default Signin;