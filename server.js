import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

// Configuração do caminho para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/mining", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.log("Erro ao conectar MongoDB:", err));

// Schemas
const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  balance: { type: Number, default: 0 }
});

const historySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  type: String, // "mine" | "buy" | "withdraw"
  date: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const History = mongoose.model("History", historySchema);

// Rotas
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  const hashed = await bcrypt.hash(senha, 10);
  const exists = await User.findOne({ email });
  if(exists) return res.json({ message: "Email já registrado" });

  const user = new User({ nome, email, senha: hashed });
  await user.save();
  res.json({ message: "Registro concluído!" });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(senha, user.senha);
  if(!valid) return res.json({ error: "Senha incorreta" });

  res.json({ userId: user._id, nome: user.nome });
});

// Minerar
app.post("/mine/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if(!user) return res.json({ error: "Usuário não encontrado" });

  user.balance += 10; // minerar 10 coins
  await user.save();

  const log = new History({ userId, amount: 10, type: "mine" });
  await log.save();

  res.json({ newBalance: user.balance });
});

// Comprar plano (adiciona coins)
app.post("/update-balance/:userId", async (req, res) => {
  const { userId } = req.params;
  const { newBalance } = req.body;
  const user = await User.findById(userId);
  if(!user) return res.json({ error: "Usuário não encontrado" });

  user.balance = newBalance;
  await user.save();

  const log = new History({ userId, amount: newBalance, type: "buy" });
  await log.save();

  res.json({ newBalance });
});

// Withdraw
app.post("/withdraw/:userId", async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const user = await User.findById(userId);
  if(!user) return res.json({ error: "Usuário não encontrado" });

  if(user.balance < amount) return res.json({ error: "Saldo insuficiente" });

  user.balance -= amount;
  await user.save();

  const log = new History({ userId, amount: -amount, type: "withdraw" });
  await log.save();

  res.json({ newBalance: user.balance });
});

// Saldo atual
app.get("/balance/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if(!user) return res.json({ error: "Usuário não encontrado" });
  res.json({ balance: user.balance });
});

// Histórico
app.get("/mining-history/:userId", async (req, res) => {
  const logs = await History.find({ userId: req.params.userId }).sort({ date: 1 });
  res.json(logs);
});

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
