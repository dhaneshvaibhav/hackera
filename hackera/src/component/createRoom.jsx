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
    const [sendTransport, setSendTransport] = useState(null);
    const [recvTransport, setRecvTransport] = useState(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const handleCreateRoom = async (event) => {
        event.preventDefault();
        if (!roomName) {
            alert("Please enter a room name.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", roomName);
            formData.append("type", roomType);
            if (file) formData.append("pdfFile", file);

            const response = await axios.post("http://localhost:3000/create-room", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { roomId, rtpCapabilities } = response.data;
            console.log("✅ Room Created:", roomId);

            const newSocket = io("http://localhost:3000");
            setSocket(newSocket);
            newSocket.emit("join-room", { roomId });

            // Load Mediasoup Device
            const newDevice = new Device();
            await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
            setDevice(newDevice);

            // Request transport creation
            newSocket.emit("create-send-transport", { roomId });
            newSocket.emit("create-receive-transport", { roomId });

            newSocket.on("send-transport-created", async (data) => {
                const transport = newDevice.createSendTransport(data);
                setSendTransport(transport);

                transport.on("connect", ({ dtlsParameters }, callback) => {
                    newSocket.emit("connect-transport", { roomId, transportId: data.id, dtlsParameters }, callback);
                });

                transport.on("produce", ({ kind, rtpParameters }, callback) => {
                    newSocket.emit("produce", { roomId, kind, rtpParameters }, ({ id }) => {
                        console.log(`🎥 Producer created: ${id}`);
                        callback({ id });
                    });
                });

                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(mediaStream);
                document.getElementById("localVideo").srcObject = mediaStream;

                mediaStream.getTracks().forEach(track => transport.produce({ track }));
            });

            newSocket.on("receive-transport-created", async (data) => {
                const transport = newDevice.createRecvTransport(data);
                setRecvTransport(transport);

                transport.on("connect", ({ dtlsParameters }, callback) => {
                    newSocket.emit("connect-receive-transport", { roomId, dtlsParameters }, callback);
                });

                console.log("✅ Receive Transport Ready!");
            });

            newSocket.on("new-producer", ({ producerId }) => {
                if (!recvTransport) {
                    console.error("❌ Receive Transport is not ready yet!");
                    return;
                }

                console.log("🎥 New Producer Detected:", producerId);
                newSocket.emit("consume", { roomId, producerId, rtpCapabilities: newDevice.rtpCapabilities });
            });

            newSocket.on("consumer-created", async ({ id, producerId, kind, rtpParameters }) => {
                if (!recvTransport) {
                    console.error("❌ Receive Transport is missing!");
                    return;
                }

                console.log(`🔄 Creating Consumer for ${kind} - Producer: ${producerId}`);

                try {
                    const consumer = await recvTransport.consume({ id, producerId, kind, rtpParameters });

                    const remoteStream = new MediaStream();
                    remoteStream.addTrack(consumer.track);

                    let element;
                    if (kind === "video") {
                        element = document.createElement("video");
                        element.autoplay = true;
                    } else {
                        element = document.createElement("audio");
                        element.autoplay = true;
                    }
                    element.id = `remote-${kind}-${producerId}`;
                    document.body.appendChild(element);
                    element.srcObject = remoteStream;

                    console.log("✅ Consumer Successfully Created:", id);
                } catch (error) {
                    console.error("❌ Error creating consumer:", error);
                }
            });
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

                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                <button className="create-room-button" onClick={handleCreateRoom} disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </button>

                <video id="localVideo" autoPlay playsInline muted></video>
            </div>
        </div>
    );
};

export default CreateRoom;
