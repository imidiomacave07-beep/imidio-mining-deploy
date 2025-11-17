const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static("public"));

// Ler dados do database
const dbPath = path.join(__dirname, "database", "db.json");
function readDB() {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
}

// Rotas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Retorna todos os planos
app.get("/api/plans", (req, res) => {
  const db = readDB();
  res.json(db.plans);
});

// Retorna métodos de pagamento
app.get("/api/payments", (req, res) => {
  const db = readDB();
  res.json(db.payments);
});

// Registrar usuário (simulado)
app.post("/api/register", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Dados incompletos" });

  const db = readDB();
  const newUser = { id: db.users.length + 1, name, email, balance: 0, plan: null };
  db.users.push(newUser);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json({ success: true, user: newUser });
});

app.listen(PORT, () => {
  console.log(`Servidor Imidio Mining rodando na porta ${PORT}`);
});
