const https = require("https");

const URL = "https://imidio-mining-deploy-3.onrender.com"; // seu link Render
const INTERVAL = 25 * 60 * 1000; // 25 minutos

function ping() {
    https.get(URL, (res) => {
        console.log(`[${new Date().toLocaleTimeString()}] Ping enviado, status: ${res.statusCode}`);
    }).on("error", (err) => {
        console.error("Erro ao pingar:", err.message);
    });
}

// ping imediato
ping();

// ping a cada 25 minutos
setInterval(ping, INTERVAL);
