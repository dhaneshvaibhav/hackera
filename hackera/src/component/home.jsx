import React, { useState } from 'react';
import CreateRoom from "./createRoom";
import Timer from "./timer"; 
import '../componentcss/home.css';

const Home = () => {
    const [code, setCode] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [streak, setStreak] = useState(0); // Streak starts at 0

    const handleJoin = () => {
        console.log("Room ID is", code);
    };

    return (
        <div className="container">
            <div className="card">
                <h1>🔥 Streak: {streak}</h1> {/* Fire emoji with streak */}
                <Timer /> {/* Add Timer Component Here */}
                <p>Connect, collaborate, and learn together from anywhere with our virtual study rooms.</p>
                <div className="button-container">
                    <button className="new-meeting" onClick={() => setShowPopup(true)}>Create Room</button>
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

            {/* Pop-up Component */}
            {showPopup && <CreateRoom onClose={() => setShowPopup(false)} />} 
        </div>
    );
};

export default Home;
