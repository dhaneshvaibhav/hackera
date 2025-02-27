import React, { useState } from "react";
import "../componentcss/createRoom.css";

const CreateRoom = ({ onClose }) => {
    const [roomName, setRoomName] = useState("");
    const [roomType, setRoomType] = useState("solo");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            alert("Please select a valid PDF file.");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                {/* Close button as 'X' */}
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

                {/* File Upload Section */}
                <div className="file-upload">
                    <label className="upload-label">
                        Upload PDF:
                        <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    </label>
                    {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                </div>

                <button className="create-room-button">Create</button>
            </div>
        </div>
    );
};

export default CreateRoom;