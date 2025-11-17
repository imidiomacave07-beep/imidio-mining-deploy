const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json()); // Para receber JSON do frontend ou miner

// Arquivo de usuários
const usersFile = path.join(__dirname, "data", "users.json");

// Inicializar arquivo se não existir
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([]));
}

// Rota de teste
app.get("/", (req, res) => {
  res.send("🚀 Imidio Mining Server está online!");
});

// Registrar novo usuário
app.post("/register", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).send({ error: "Username é obrigatório" });

  let users = JSON.parse(fs.readFileSync(usersFile));
  if (users.find(u => u.username === username)) {
    return res.status(400).send({ error: "Usuário já existe" });
  }

  const newUser = { username, balance: 0 };
  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.send({ success: true, user: newUser });
});

// Receber hashes/mineração do miner
app.post("/mine", (req, res) => {
  const { username, hashes } = req.body;
  if (!username || !hashes) return res.status(400).send({ error: "Dados incompletos" });

  let users = JSON.parse(fs.readFileSync(usersFile));
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).send({ error: "Usuário não encontrado" });

  // Simples: cada hash = 0.0001 de saldo (ajuste depois)
  user.balance += hashes * 0.0001;

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.send({ success: true, balance: user.balance });
});

// Consultar saldo
app.get("/balance/:username", (req, res) => {
  const username = req.params.username;
  let users = JSON.parse(fs.readFileSync(usersFile));
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).send({ error: "Usuário não encontrado" });

  res.send({ username, balance: user.balance });
});

app.listen(PORT, () => {
  console.log(`Servidor Imidio Mining rodando na porta ${PORT}`);
});
