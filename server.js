import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Caminho absoluto do projeto
const __dirname = path.resolve();

// Caminho do database
const DB_PATH = path.join(__dirname, "database", "db.json");

// Função para ler o database
function readDB() {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
}

// Função para salvar no database
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Servir arquivos estáticos da pasta public/
app.use(express.static(path.join(__dirname, "public")));

// Rota principal – serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rota para listar planos
app.get("/api/plans", (req, res) => {
  const db = readDB();
  res.json(db.plans);
});

// Rota para listar métodos de pagamento
app.get("/api/payments", (req, res) => {
  const db = readDB();
  res.json(db.payments);
});

// Criar usuário (básico por enquanto)
app.post("/api/register", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ error: "Nome e Email são obrigatórios" });

  const db = readDB();

  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    balance: 0,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  res.json({ message: "Usuário criado com sucesso!", user: newUser });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Imidio Mining rodando na porta ${PORT}`);
});
