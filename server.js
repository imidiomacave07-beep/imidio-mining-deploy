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

// Função auxiliar para ler e criar db.json se não existir
function getDatabase() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ planos: [], usuarios: [] }, null, 2));
  }
  const rawData = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(rawData);
}

// Função auxiliar para salvar db.json
function saveDatabase(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Rota raiz
app.get("/", (req, res) => {
  res.send("🚀 Imidio Mining está online! Bem-vindo à sua plataforma de mineração digital.");
});

// Health check
app.get("/healthz", (req, res) => res.send("OK"));

// Retornar todo o conteúdo do banco
app.get("/data", (req, res) => {
  try {
    const data = getDatabase();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler db.json" });
  }
});

// Listar usuários
app.get("/usuarios", (req, res) => {
  try {
    const data = getDatabase();
    res.json(data.usuarios);
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler usuários" });
  }
});

// Cadastrar novo usuário
app.post("/usuarios", (req, res) => {
  try {
    const data = getDatabase();
    const novoUsuario = {
      id: Date.now(),
      nome: req.body.nome,
      email: req.body.email,
      saldo: 0
    };
    data.usuarios.push(novoUsuario);
    saveDatabase(data);
    res.json({ sucesso: true, usuario: novoUsuario });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// Listar planos
app.get("/planos", (req, res) => {
  try {
    const data = getDatabase();
    res.json(data.planos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao ler planos" });
  }
});

// Cadastrar novo plano
app.post("/planos", (req, res) => {
  try {
    const data = getDatabase();
    const novoPlano = {
      id: Date.now(),
      nome: req.body.nome,
      custo: req.body.custo,
      retorno: req.body.retorno
    };
    data.planos.push(novoPlano);
    saveDatabase(data);
    res.json({ sucesso: true, plano: novoPlano });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao cadastrar plano" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} ou https://seu-servico.onrender.com`);
});
