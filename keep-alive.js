// keep-alive.js

const URL = "https://imidio-mining-deploy-3.onrender.com"; // sua URL do Render
const INTERVAL = 4 * 60 * 1000; // 4 minutos

async function ping() {
    try {
        const res = await fetch(URL);
        console.log(`[Keep-Alive] Status: ${res.status} - ${new Date().toLocaleTimeString()}`);
    } catch (err) {
        console.error("[Keep-Alive] Erro ao pingar:", err.message);
    }
}

// Ping imediato
ping();

// Ping a cada INTERVAL
setInterval(ping, INTERVAL);
