const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10000;

// Configurações
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Banco de dados simples (arquivo JSON)
const dbPath = './data/users.json';
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify([]));

// Função para ler usuários
function getUsers() {
  return JSON.parse(fs.readFileSync(dbPath));
}

// Função para salvar usuários
function saveUsers(users) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

// Rota cadastro
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email já registrado' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
    balance: 0,
    plan: null
  };

  users.push(newUser);
  saveUsers(users);

  res.json({ message: 'Cadastro realizado com sucesso', user: newUser });
});

// Rota login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = getUsers();

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: 'Email ou senha inválidos' });

  res.json({ message: 'Login realizado com sucesso', user });
});

// Rota para escolher plano
app.post('/plan', (req, res) => {
  const { email, plan } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  // Planos simulados
  const plans = {
    basic: 5,
    pro: 10,
    elite: 20
  };

  if (!plans[plan]) return res.status(400).json({ message: 'Plano inválido' });

  user.plan = plan;
  saveUsers(users);

  res.json({ message: `Plano ${plan} ativado com sucesso`, user });
});

// Rota para minerar/recompensa simulada
app.post('/mine', (req, res) => {
  const { email } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });
  if (!user.plan) return res.status(400).json({ message: 'Nenhum plano ativo' });

  // Simulação de ganho diário
  const rewards = { basic: 1, pro: 3, elite: 7 };
  user.balance += rewards[user.plan];
  saveUsers(users);

  res.json({ message: 'Mineração simulada realizada', balance: user.balance });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
