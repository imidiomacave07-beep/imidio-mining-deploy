// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Porta do Render ou fallback local
const PORT = process.env.PORT || 10000;

// Endpoint de health check
app.get("/healthz", (req, res) => res.send("OK"));

// Endpoint para retornar dados do db.json
app.get("/data", (req, res) => {
  try {
    const rawData = fs.readFileSync("./database/db.json", "utf-8");
    const data = JSON.parse(rawData);
    res.json(data);
  } catch (err) {
    console.error("Erro ao ler db.json:", err);
    res.status(500).json({ error: "Erro ao ler db.json" });
  }
});

// Rota raiz
app.get("/", (req, res) => {
  res.send("🚀 Imidio Mining está online! Bem-vindo à sua plataforma de mineração digital.");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} ou https://imidio-mining-deploy.onrender.com`);
});
