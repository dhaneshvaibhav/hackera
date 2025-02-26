import React, { useState } from "react";

function Signin() {
    const [user, setUser] = useState("");
    const [rep, setRep] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <input 
                type="text" 
                value={user} 
                placeholder="Username or Email" 
                onChange={(e) => setUser(e.target.value)} 
            />
            <br /><br />

            <input 
                type="password" 
                value={password} 
                placeholder="Password" 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <br /><br />

            <input 
                type="password" 
                value={rep} 
                placeholder="Repeat Password" 
                onChange={(e) => setRep(e.target.value)} 
            />
            <br /><br />

            <button>Sign In</button>
        </>
    );
}

export default Signin;
