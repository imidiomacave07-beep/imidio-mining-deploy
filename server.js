import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Caminho do arquivo db.json
const __dirname = path.resolve();
const dbPath = path.join(__dirname, "database", "db.json");

// Função para ler o DB
const readDB = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

// Função para escrever no DB
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Rotas

// Rota principal
app.get("/", (req, res) => {
  res.send("<h1>🚀 Imidio Mining está online!</h1><p>Bem-vindo à sua plataforma de mineração digital.</p>");
});

// Listar planos
app.get("/plans", (req, res) => {
  const db = readDB();
  res.json(db.plans);
});

// Listar métodos de pagamento
app.get("/payments", (req, res) => {
  const db = readDB();
  res.json(db.payments);
});

// Cadastrar usuário
app.post("/register", (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ message: "Usuário e email são obrigatórios." });
  }

  const db = readDB();

  // Checar se já existe
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ message: "Usuário já cadastrado." });
  }

  const newUser = { id: Date.now(), username, email, balance: 0, plan: null };
  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ message: "Usuário registrado com sucesso!", user: newUser });
});

// Selecionar plano
app.post("/subscribe", (req, res) => {
  const { email, planId } = req.body;

  const db = readDB();
  const user = db.users.find(u => u.email === email);
  const plan = db.plans.find(p => p.id === planId);

  if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
  if (!plan) return res.status(404).json({ message: "Plano não encontrado." });

  user.plan = plan;
  writeDB(db);

  res.json({ message: "Plano selecionado com sucesso!", user });
});

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Imidio Mining rodando na porta ${PORT}`);
});
