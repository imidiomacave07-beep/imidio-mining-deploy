// src/keep-alive.js
const URL = process.env.KEEP_ALIVE_URL || "https://imidio-mining-deploy-3.onrender.com";
const INTERVAL = 4 * 60 * 1000; // 4 minutos

async function ping() {
  try {
    const res = await fetch(URL);
    console.log(`[Keep-Alive] ${new Date().toLocaleString()} - ${res.status}`);
  } catch (err) {
    console.error("[Keep-Alive] Erro:", err.message);
  }
}

ping();
setInterval(ping, INTERVAL);
