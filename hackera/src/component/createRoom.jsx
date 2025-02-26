import React, { useState } from 'react';
import '../componentcss/CreateRoom.css'; // Import CSS

const CreateRoom = ({ onClose }) => {
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState('solo'); // Default selection: Solo

    const handleCreateRoom = () => {
        console.log("Room Created:", { roomName, roomType });
        onClose(); // Close the popup after creating the room
    };

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h2>Create a Room</h2>

                {/* Room Name Input */}
                <input 
                    type="text" 
                    placeholder="Enter Room Name" 
                    value={roomName} 
                    onChange={(e) => setRoomName(e.target.value)} 
                />

                {/* Room Type Selection */}
                <div className="room-type-container">
                    <label 
                        className={`room-option ${roomType === 'solo' ? 'selected' : ''}`} 
                        onClick={() => setRoomType('solo')}
                    >
                        Solo
                    </label>
                    <label 
                        className={`room-option ${roomType === 'group' ? 'selected' : ''}`} 
                        onClick={() => setRoomType('group')}
                    >
                        Group
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="popup-buttons">
                    <button className="create-btn" onClick={handleCreateRoom}>Create</button>
                    <button className="close-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;
