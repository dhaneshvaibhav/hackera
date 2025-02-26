import React, { useState } from 'react';
import '../componentcss/home.css';

const Home = () => {
    const [code, setCode] = useState('');

    const handleCreate = () => {
        console.log("Room created successfully");
    }

    const handleJoin = () => {
        console.log("Room ID is", code);
    }

    return (
        <div className="container">
            <div className="card">
                <h1>Virtual Study Rooms</h1>
                <p>Connect, collaborate, and learn together from anywhere with our virtual study rooms.</p>
                <div className="button-container">
                    <button className="new-meeting" onClick={handleCreate}>Create Room</button>
                    <div className="separator"></div>
                    <div className="join-room-container">
                        <input 
                            type="text" 
                            placeholder="Enter a code" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} 
                        />
                        <button className="join-room" onClick={handleJoin}>Join</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
