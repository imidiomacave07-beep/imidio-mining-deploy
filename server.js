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

// Servir arquivos estáticos da pasta public
app.use(express.static("public"));

const PORT = process.env.PORT || 10000;
const dbPath = path.resolve("./database/db.json");

function readDB() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ usuarios: [], planos: [] }, null, 2));
  }
  const rawData = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(rawData);
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

app.get("/healthz", (req, res) => res.send("OK"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Usuários
app.get("/usuarios", (req, res) => res.json(readDB().usuarios));
app.post("/usuarios", (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });
  const db = readDB();
  const id = db.usuarios.length + 1;
  const novoUsuario = { id, nome, saldo: 0, planosComprados: [] };
  db.usuarios.push(novoUsuario);
  saveDB(db);
  res.status(201).json(novoUsuario);
});

// Planos
app.get("/planos", (req, res) => res.json(readDB().planos));
app.get("/init-planos", (req, res) => {
  const db = readDB();
  if (db.planos.length === 0) {
    db.planos = [
      { id: 1, nome: "Plano Bronze", lucroDiario: 5, duracaoDias: 30 },
      { id: 2, nome: "Plano Prata", lucroDiario: 10, duracaoDias: 30 },
      { id: 3, nome: "Plano Ouro", lucroDiario: 20, duracaoDias: 30 }
    ];
    saveDB(db);
    return res.json({ message: "Planos iniciais criados", planos: db.planos });
  }
  res.json({ message: "Planos já existem", planos: db.planos });
});

// Comprar plano
app.post("/comprar-plano", (req, res) => {
  const { usuarioId, planoId } = req.body;
  if (!usuarioId || !planoId) return res.status(400).json({ error: "UsuarioId e PlanoId são obrigatórios" });
  const db = readDB();
  const usuario = db.usuarios.find(u => u.id === usuarioId);
  const plano = db.planos.find(p => p.id === planoId);
  if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
  if (!plano) return res.status(404).json({ error: "Plano não encontrado" });
  usuario.planosComprados.push({ ...plano, compradoEm: new Date().toISOString() });
  saveDB(db);
  res.json({ message: `Plano "${plano.nome}" comprado com sucesso!`, usuario });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} ou no Render em https://seu-servico.onrender.com`);
});
