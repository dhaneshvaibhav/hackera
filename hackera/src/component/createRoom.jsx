import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "../componentcss/createRoom.css";

const CreateRoom = ({ onClose }) => {
    const [roomName, setRoomName] = useState("");
    const [roomType, setRoomType] = useState("solo");
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate(); // ✅ Hook to navigate

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            alert("Please select a valid PDF file.");
        }
    };

    const handleCreateRoom = () => {
        if (!roomName) {
            alert("Please enter a room name.");
            return;
        }

        // Simulate Room Creation (You can replace this with an API call)
        console.log("Room Created:", { roomName, roomType, selectedFile });

        // ✅ Navigate based on room type
        if (roomType === "solo") {
            navigate("/timer"); // Go to Timer Page
        } else {
            alert("group room is creatd")
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Create Room</h2>

                <input 
                    type="text" 
                    placeholder="Enter Room Name" 
                    value={roomName} 
                    onChange={(e) => setRoomName(e.target.value)} 
                />

                <div className="room-type-container">
                    <div 
                        className={`room-option ${roomType === "solo" ? "selected" : ""}`} 
                        onClick={() => setRoomType("solo")}
                    >
                        Solo
                    </div>
                    <div 
                        className={`room-option ${roomType === "group" ? "selected" : ""}`} 
                        onClick={() => setRoomType("group")}
                    >
                        Group
                    </div>
                </div>

                <div className="file-upload">
                    <label className="upload-label">
                        Upload PDF:
                        <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    </label>
                    {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                </div>

                {/* ✅ Call handleCreateRoom when clicking Create */}
                <button className="create-room-button" onClick={handleCreateRoom}>
                    Create
                </button>
            </div>
        </div>
    );
};

export default CreateRoom;
