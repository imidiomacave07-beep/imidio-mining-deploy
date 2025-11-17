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

// Caminho do db.json
const __dirname = path.resolve();
const dbPath = path.join(__dirname, "database", "db.json");

// Função para ler o banco de dados
function readDB() {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Erro ao ler db.json:", err);
    return { users: [], plans: [], payments: [] };
  }
}

// Endpoint básico para testar
app.get("/", (req, res) => {
  res.send("<h1>🚀 Imidio Mining está online!</h1>");
});

// Endpoint para retornar planos
app.get("/plans", (req, res) => {
  const db = readDB();
  res.json(db.plans);
});

// Endpoint para retornar métodos de pagamento
app.get("/payments", (req, res) => {
  const db = readDB();
  res.json(db.payments);
});

// Definir porta do Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
