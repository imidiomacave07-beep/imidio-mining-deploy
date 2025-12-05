// server.js
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Conectar MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Schemas
const userSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  balance: { type: Number, default: 0 },
  miningHistory: [{ date: Date, amount: Number }]
});

const User = mongoose.model("User", userSchema);

// Rotas
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashed = await bcrypt.hash(senha, 10);
    const user = new User({ nome, email, senha: hashed });
    await user.save();
    res.json({ message: "Conta criada com sucesso!" });
  } catch (err) {
    res.json({ message: "Erro ao criar conta: " + err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.json({ error: "Senha incorreta" });

  res.json({ userId: user._id });
});

app.post("/mine/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const amount = 10; // Coins minerados por clique
  user.balance += amount;
  user.miningHistory.push({ date: new Date(), amount });
  await user.save();

  res.json({ newBalance: user.balance });
});

app.get("/mining-history/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.json([]);
  res.json(user.miningHistory);
});

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
