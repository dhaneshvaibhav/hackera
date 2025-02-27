import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Device } from "mediasoup-client";
import "../componentcss/CreateRoom.css";

const CreateRoom = ({ onClose }) => {
    const [roomName, setRoomName] = useState("");
    const [roomType, setRoomType] = useState("solo");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const [device, setDevice] = useState(null);
    const [transport, setTransport] = useState(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleCreateRoom = async (event) => {
        event.preventDefault();
        if (!roomName) {
            alert("Please enter a room name.");
            return;
        }

        const formData = new FormData();
        formData.append("name", roomName);
        formData.append("type", roomType);
        if (file) formData.append("pdfFile", file);

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:3000/create-room", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { roomId } = response.data;
            console.log("✅ Room Created:", roomId);

            const newSocket = io("http://localhost:3000");
            setSocket(newSocket);
            newSocket.emit("join-room", { roomId });

            newSocket.emit("get-rtp-capabilities", { roomId });
            newSocket.on("rtp-capabilities", async (capabilities) => {
                console.log("🎥 RTP Capabilities received:", capabilities);
            
                // Ensure capabilities are valid
                if (!capabilities || typeof capabilities !== "object") {
                    console.error("❌ Invalid RTP Capabilities received:", capabilities);
                    return;
                }
            
                try {
                    const newDevice = new Device();
                    await newDevice.load({ routerRtpCapabilities: capabilities });
            
                    console.log("✅ Device initialized successfully" , newDevice);
                    setDevice(newDevice);
                    console.log(device)
            
                    newSocket.emit("create-transport", { roomId });
                } catch (error) {
                    console.error("❌ Error creating device:", error);
                }
            });
            
            newSocket.on("transport-created", async (data) => {
                console.log("🚀 Transport Created:", data);
                let activeDevice = device; // Use existing device if available

                if (!activeDevice) {
                    activeDevice = new Device();
                    console.log(data.rtpCapabilities)
                    await activeDevice.load({ routerRtpCapabilities: data.rtpCapabilities });
                    setDevice(activeDevice);
                    console.log("✅ Device initialized successfully inside transport creation");
                }
            
                const sendTransport = activeDevice.createSendTransport(data);
                setTransport(sendTransport);

                sendTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
                    try {
                        newSocket.emit("connect-transport", { roomId, transportId: data.id, dtlsParameters });
                        newSocket.on("transport-connected", () => {
                            console.log("✅ Transport Connected");
                            callback();
                        });
                    } catch (error) {
                        console.error("❌ Error connecting transport:", error);
                        errback(error);
                    }
                });

                sendTransport.on("produce", async ({ kind, rtpParameters }, callback, errback) => {
                    try {
                        newSocket.emit("produce", { roomId, transportId: sendTransport.id, kind, rtpParameters });
                        newSocket.on("producer-created", ({ id }) => {
                            console.log(`🎥 Producer created: ${id}`);
                            callback({ id });
                        });
                    } catch (error) {
                        console.error("❌ Error producing track:", error);
                        errback(error);
                    }
                });

                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setStream(mediaStream);

                    const localVideo = document.getElementById("localVideo");
                    if (localVideo) localVideo.srcObject = mediaStream;

                    mediaStream.getTracks().forEach(async (track) => {
                        try {
                            const producer = await sendTransport.produce({ track });
                            console.log(`🎥 Producer created: ${producer.id}`);
                        } catch (error) {
                            console.error("❌ Error producing track:", error);
                        }
                    });
                } catch (error) {
                    console.error("❌ Error accessing media devices:", error);
                }
            });
            socket.on("new-producer", async ({ producerId }) => {
                console.log(`📡 New producer detected: ${producerId}`);
                let activeDevice = device;
                if (!activeDevice) {
                    activeDevice = new Device();
                    await activeDevice.load({ routerRtpCapabilities: device.rtpCapabilities });
                    setDevice(activeDevice);
                }
                socket.emit("consume", { roomId, producerId, rtpCapabilities: activeDevice.rtpCapabilities });
            
                socket.on("consumer-created", async ({ id, producerId, kind, rtpParameters }) => {
                    console.log(`✅ Consumer Created! ID: ${id}, Producer: ${producerId}, Kind: ${kind}`);
                
                    // Step 1: Create consumer on the device
                    const consumer = await transport.consume({
                        id,
                        producerId,
                        kind,
                        rtpParameters,
                    });
                
                    console.log(`🎥 Consumer ${consumer.id} created for producer ${producerId}`);
                
                    // Step 2: Play the media
                    const remoteStream = new MediaStream();
                    remoteStream.addTrack(consumer.track);
                
                    if (kind === "video") {
                        let remoteVideo = document.getElementById(`remoteVideo-${producerId}`);
                        
                        // If the video element doesn't exist, create one
                        if (!remoteVideo) {
                            remoteVideo = document.createElement("video");
                            remoteVideo.id = `remoteVideo-${producerId}`;
                            remoteVideo.autoplay = true;
                            remoteVideo.playsInline = true;
                            document.body.appendChild(remoteVideo);
                        }
                        
                        remoteVideo.srcObject = remoteStream;
                    } else if (kind === "audio") {
                        let remoteAudio = document.getElementById(`remoteAudio-${producerId}`);
                        
                        if (!remoteAudio) {
                            remoteAudio = document.createElement("audio");
                            remoteAudio.id = `remoteAudio-${producerId}`;
                            remoteAudio.autoplay = true;
                            document.body.appendChild(remoteAudio);
                        }
                
                        remoteAudio.srcObject = remoteStream;
                    }
                });
            });
            
            alert(`Room Created! ID: ${roomId}`);
            onClose();
        } catch (error) {
            console.error("❌ Error creating room:", error);
            alert("Failed to create room.");
        } finally {
            setLoading(false);
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

                <input type="file" onChange={handleFileChange} />

                <button 
                    className="create-room-button" 
                    onClick={handleCreateRoom} 
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create"}
                </button>

                <video id="localVideo" autoPlay playsInline muted></video>
            </div>
        </div>
    );
};

export default CreateRoom;
