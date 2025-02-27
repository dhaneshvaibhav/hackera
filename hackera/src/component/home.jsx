import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Device } from "mediasoup-client";
import CreateRoom from "./createRoom";
import "../componentcss/home.css";

const Home = () => {
    const [code, setCode] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [socket, setSocket] = useState(null);
    const [device, setDevice] = useState(null);
    const [recvTransport, setRecvTransport] = useState(null);
    const [sendTransport, setSendTransport] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        newSocket.on("connect", () => console.log("🔗 Connected to WebSocket Server"));
        newSocket.on("disconnect", () => console.log("❌ Disconnected from Server"));
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    const handleJoin = async () => {
        if (!code.trim()) {
            alert("Please enter a valid Room ID!");
            return;
        }

        console.log("🔗 Joining Room:", code);
        socket.emit("join-room", { roomId: code });

        socket.once("user-list", (data) => console.log("👥 Updated User List:", data));

        socket.emit("get-rtp-capabilities", { roomId: code });
        socket.once("rtp-capabilities", async (capabilities) => {
            if (!capabilities) {
                console.error("❌ Invalid RTP Capabilities");
                return;
            }

            console.log("📡 RTP Capabilities Received:", capabilities);
            try {
                const newDevice = new Device();
                await newDevice.load({ routerRtpCapabilities: capabilities });
                console.log("✅ Mediasoup Device Initialized");
                setDevice(newDevice);

                if (!newDevice.loaded) {
                    console.error("❌ Mediasoup Device failed to load!");
                    return;
                }

                // Create Send Transport
                socket.emit("create-transport", { roomId: code });
                socket.once("transport-created", async (data) => {
                    console.log("🚀 Send Transport Created:", data);
                    const sendTransport = newDevice.createSendTransport(data);
                    
                    sendTransport.on("connect", ({ dtlsParameters }, callback) => {
                        socket.emit("connect-transport", { roomId: code, transportId: data.id, dtlsParameters });
                        socket.once("transport-connected", callback);
                    });

                    sendTransport.on("produce", async ({ kind, rtpParameters }, callback) => {
                        socket.emit("produce", { roomId: code, transportId: data.id, kind, rtpParameters });
                        socket.once("producer-created", ({ id }) => {
                            console.log(`🎥 Producer Created: ${id}`);
                            callback({ id });
                        });
                    });

                    console.log("🎥 Getting media stream...");
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                    stream.getTracks().forEach(async (track) => {
                        const producer = await sendTransport.produce({ track });
                        console.log(`✅ Producer started for ${track.kind}`);
                    });

                    setSendTransport(sendTransport);
                });

                // Create Receive Transport
                socket.emit("create-recv-transport", { roomId: code });
                socket.once("recv-transport-created", async (data) => {
                    console.log("🚀 Receive Transport Created:", data);
                    const transport = newDevice.createRecvTransport(data);

                    transport.on("connect", ({ dtlsParameters }, callback) => {
                        socket.emit("connect-transport", { roomId: code, transportId: data.id, dtlsParameters });
                        socket.once("transport-connected", callback);
                    });

                    setRecvTransport(transport);
                });
            } catch (error) {
                console.error("❌ Error initializing Mediasoup device:", error);
            }
        });
    };

    useEffect(() => {
        if (!socket || !device || !recvTransport) return;
        
        socket.on("new-producer", ({ producerId }) => {
            console.log("📡 New Producer Detected:", producerId);

            if (!producerId) {
                console.error("❌ Received undefined producerId");
                return;
            }

            console.log("🔄 Requesting consumer...");
            socket.emit("consume", { roomId: code, producerId, rtpCapabilities: device.rtpCapabilities });
            console.log(`🚀 Emitting consume event for producer: ${producerId}`);

            socket.once("consumer-created", async ({ id, producerId, kind, rtpParameters }) => {
                console.log(`📡 Consumer Created! ID: ${id}, Producer: ${producerId}, Kind: ${kind}`);
                const consumer = await recvTransport.consume({ id, producerId, kind, rtpParameters });
                
                const remoteStream = new MediaStream();
                remoteStream.addTrack(consumer.track);
                
                const element = document.createElement(kind === "video" ? "video" : "audio");
                element.id = `remote-${kind}-${producerId}`;
                element.autoplay = true;
                if (kind === "video") element.playsInline = true;
                element.srcObject = remoteStream;
                document.body.appendChild(element);

                console.log("✅ Remote stream added to DOM for", producerId);
            });
        });
    }, [socket, device, recvTransport]);

    return (
        <div className="container">
            <div className="card">
                <h1>Virtual Study Rooms</h1>
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
            {showPopup && <CreateRoom onClose={() => setShowPopup(false)} />} 
        </div>
    );
};

export default Home;
