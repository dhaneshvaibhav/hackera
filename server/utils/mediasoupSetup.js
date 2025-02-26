const mediasoup = require("mediasoup");

let worker;
let router;

async function startMediasoup() {
    worker = await mediasoup.createWorker();
    router = await worker.createRouter({
        mediaCodecs: [
            { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
            { kind: "video", mimeType: "video/VP8", clockRate: 90000 }
        ]
    });
    console.log("✅ Mediasoup Router Initialized");
}

async function getRouterRtpCapabilities() {
    return router.rtpCapabilities;
}

module.exports = { startMediasoup, getRouterRtpCapabilities, router };
