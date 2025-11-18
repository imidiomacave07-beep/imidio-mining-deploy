// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Porta do Render ou fallback local
const PORT = process.env.PORT || 10000;

// Caminho absoluto para o db.json dentro da pasta /database
const dbPath = path.resolve("./database/db.json");

// Endpoint de teste / health check
app.get("/healthz", (req, res) => res.send("OK"));

// Endpoint básico para retornar conteúdo do db.json
app.get("/data", (req, res) => {
  try {
    if (!fs.existsSync(dbPath)) {
      // Se db.json não existir, cria um arquivo inicial
      fs.writeFileSync(dbPath, JSON.stringify({ planos: [], usuarios: [] }, null, 2));
    }
    const rawData = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(rawData);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao ler db.json" });
  }
});

// Rota raiz
app.get("/", (req, res) => {
  res.send("🚀 Imidio Mining está online! Bem-vindo à sua plataforma de mineração digital.");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} ou https://seu-servico.onrender.com`);
});
