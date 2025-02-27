const Room = require("../models/Rooms");
const { getRouter } = require("../utils/mediasoupSetup");

const rooms = new Map();

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`🔗 New WebSocket Connection: ${socket.id}`);

        socket.on("join-room", async ({ roomId }) => {
            try {
                let room = rooms.get(roomId);
                if (!room) {
                    room = {
                        router: getRouter(),
                        transports: new Map(),
                        producers: new Map(),
                        consumers: new Map(),
                        users: new Map(),
                    };
                    rooms.set(roomId, room);
                }
        
                room.users.set(socket.id, { id: socket.id });
                console.log("👥 Current Users in Room:", Array.from(room.users.keys()));
        
                socket.join(roomId);
                await Room.findOneAndUpdate({ roomId }, { $inc: { users: 1 } });
                const updatedRoom = await Room.findOne({ roomId });
        
                // Send updated user list to everyone in the room
                io.to(roomId).emit("user-list", { users: Array.from(room.users.values()) });
                console.log(`✅ User ${socket.id} joined room ${roomId}`);
            } catch (error) {
                console.error("❌ Error joining room:", error);
                socket.emit("error", "Internal Server Error");
            }
        });
        

        socket.on("get-rtp-capabilities", ({ roomId }) => {
            const room = rooms.get(roomId);
            if (!room) return socket.emit("error", "Room not found");
            socket.emit("rtp-capabilities", room.router.rtpCapabilities);
        });

        socket.on("create-transport", async ({ roomId }) => {
            const room = rooms.get(roomId);
            if (!room) return socket.emit("error", "Room not found");
        
            try {
                const transport = await room.router.createWebRtcTransport({
                    listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
                    enableUdp: true,
                    enableTcp: true,
                    preferUdp: true,
                });
        
                room.transports.set(transport.id, transport);
                
                // ✅ Link transport to user session
        if (room.users.has(socket.id)) {
            room.users.get(socket.id).transportId = transport.id;
        }

                // ✅ Send only serializable data
                socket.emit("transport-created", {
                    id: transport.id,
                    dtlsParameters: transport.dtlsParameters, // Ensure this is sent
                    iceParameters: transport.iceParameters, // ✅ Add ICE parameters
                    iceCandidates: transport.iceCandidates, // ✅ Add ICE candidates
                    rtpCapabilities: room.router.rtpCapabilities,
                });
        
                console.log("🚀 Transport Created:", {
                    id: transport.id,
                    dtlsParameters: transport.dtlsParameters,
                });
        
            } catch (error) {
                console.error("❌ Error creating transport:", error);
                socket.emit("error", "Transport creation failed");
            }
        });

        socket.on("connect-transport", async ({ roomId, transportId, dtlsParameters }) => {
            const room = rooms.get(roomId);
            if (!room) return socket.emit("error", "Room not found");
        
            const transport = room.transports.get(transportId);
            if (!transport) return socket.emit("error", "Transport not found");
        
            try {
                await transport.connect({ dtlsParameters });
                socket.emit("transport-connected");
                console.log(`✅ Transport ${transportId} connected for room ${roomId}`);
            } catch (error) {
                console.error("❌ Error connecting transport:", error);
                socket.emit("error", "Transport connection failed");
            }
        });

        socket.on("produce", async ({ roomId, transportId, kind, rtpParameters }) => {
            console.log("📡 Received produce request:");
            console.log("roomId:", roomId);
            console.log("transportId:", transportId);
            console.log("kind:", kind);
            console.log("rtpParameters:", rtpParameters);
        
            if (!roomId) return socket.emit("error", "Room ID is required");
        
            const room = rooms.get(roomId);
            if (!room) return socket.emit("error", "Room not found");
        
            const transport = room.transports.get(transportId);
            if (!transport) return socket.emit("error", "Transport not found");
        
            if (!rtpParameters || typeof rtpParameters !== "object") {
                console.error("❌ Invalid RTP Parameters:", rtpParameters);
                return socket.emit("error", "Invalid RTP Parameters");
            }
        
            try {
                const producer = await transport.produce({ kind, rtpParameters });
                room.producers.set(producer.id, producer);
        
                socket.emit("producer-created", { id: producer.id });
                console.log(`🎥 Producer created: ${producer.id} for room ${roomId}`);
        
                // Notify others in the room about the new producer
                socket.broadcast.to(roomId).emit("new-producer", { producerId: producer.id });
        
            } catch (error) {
                console.error("❌ Error creating producer:", error);
                socket.emit("error", "Producer creation failed");
            }
        });
        socket.on("consume", async ({ roomId, producerId, rtpCapabilities }) => {
            console.log(`🔄 Consumer request: roomId=${roomId}, producerId=${producerId}`);
        
            const room = rooms.get(roomId);
            if (!room) return socket.emit("error", "Room not found");
        
            const producer = room.producers.get(producerId);
            if (!producer) return socket.emit("error", "Producer not found");
        
            // ✅ Ensure the consumer transport is correctly fetched
            const transport = await room.router.createWebRtcTransport({
                listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
                enableUdp: true,
                enableTcp: true,
                preferUdp: true,
                appData: { consumer: true, socketId: socket.id }, // ✅ FIX
            });
            
            if (!transport) return socket.emit("error", "Consumer transport not found");
        
            if (!room.router.canConsume({ producerId: producer.id, rtpCapabilities })) {
                console.error("❌ Cannot consume producer");
                return socket.emit("error", "Cannot consume");
            }
        
            try {
                const consumer = await transport.consume({
                    producerId,
                    rtpCapabilities,
                    paused: false, // Start paused
                });
        
                room.consumers.set(consumer.id, consumer);
        
                socket.emit("consumer-created", {
                    id: consumer.id,
                    producerId,
                    kind: consumer.kind,
                    rtpParameters: consumer.rtpParameters,
                });
        
                console.log(`🎧 Consumer created: ${consumer.id} for producer ${producerId}`);
            } catch (error) {
                console.error("❌ Error creating consumer:", error);
                socket.emit("error", "Consumer creation failed");
            }
        });        
        
        socket.on("create-recv-transport", async ({ roomId }) => {
            console.log(`📡 Received request to create recv transport for room: ${roomId}`);
            
            const room = rooms.get(roomId);
            if (!room) return socket.emit("error", "Room not found");
        
            try {
                const transport = await room.router.createWebRtcTransport({
                    listenIps: [{ ip: "0.0.0.0", announcedIp: "127.0.0.1" }],
                    enableUdp: true,
                    enableTcp: true,
                    preferUdp: true,
                });
        
                room.transports.set(transport.id, transport);
                room.users.get(socket.id).recvTransportId = transport.id; // ✅ Store transport
        
                console.log(`🚀 Recv Transport Created: ${transport.id}`);
        
                socket.emit("recv-transport-created", {
                    id: transport.id,
                    dtlsParameters: transport.dtlsParameters,
                    iceParameters: transport.iceParameters,
                    iceCandidates: transport.iceCandidates,
                    
                });
            } catch (error) {
                console.error("❌ Error creating recv transport:", error);
                socket.emit("error", "Recv transport creation failed");
            }
        });
        socket.on("disconnect", async () => {
            try {
                console.log(`❌ User Disconnected: ${socket.id}`);
                const roomId = Array.from(socket.rooms).find((r) => r !== socket.id);
                if (!roomId) return;
        
                const room = rooms.get(roomId);
                if (!room) return;
        
                // ✅ Close transport & remove from room
                const userTransportId = room.users.get(socket.id)?.transportId;
                if (userTransportId) {
                    const transport = room.transports.get(userTransportId);
                    if (transport) {
                        transport.close();
                        room.transports.delete(userTransportId);
                    }
                }
        
                // ✅ Close all user producers
                room.producers.forEach((producer, producerId) => {
                    if (producer.appData?.socketId === socket.id) {
                        producer.close();
                        room.producers.delete(producerId);
                    }
                });
        
                // ✅ Close all user consumers
                room.consumers.forEach((consumer, consumerId) => {
                    if (consumer.appData?.socketId === socket.id) {
                        consumer.close();
                        room.consumers.delete(consumerId);
                    }
                });
        
                room.users.delete(socket.id);
                await Room.findOneAndUpdate({ roomId }, { $inc: { users: -1 } });
        
                // Notify other users
                io.to(roomId).emit("user-list", { users: Array.from(room.users.values()) });
        
                // If room is empty, delete it
                if (room.users.size === 0) {
                    rooms.delete(roomId);
                }
            } catch (error) {
                console.error("❌ Error handling disconnect:", error);
            }
        });        
        
    });
};
