const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Caminho para o database
const dbPath = "./database/db.json";

// Função para ler o database
function readDB() {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
}

// Função para salvar no database
function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// =====================
// Endpoints
// =====================

// Rota inicial
app.get("/", (req, res) => {
  res.send("<h1>🚀 Imidio Mining Server está online!</h1><p>Bem-vindo à sua plataforma.</p>");
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

// Registrar usuário
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const db = readDB();
  const userExists = db.users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ error: "Usuário já cadastrado" });
  }

  const newUser = { id: Date.now(), name, email, password, plan: null, balance: 0 };
  db.users.push(newUser);
  saveDB(db);

  res.json({ message: "Cadastro realizado com sucesso", user: newUser });
});

// Consultar usuários
app.get("/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// Ativar plano para usuário
app.post("/activate-plan", (req, res) => {
  const { email, planId } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email);
  const plan = db.plans.find(p => p.id === planId);

  if (!user || !plan) return res.status(400).json({ error: "Usuário ou plano inválido" });

  user.plan = plan;
  saveDB(db);

  res.json({ message: "Plano ativado com sucesso", user });
});

// =====================
// Start do servidor
// =====================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
