import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.log("Erro ao conectar MongoDB:", err));

// Schemas
const userSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  balance: { type: Number, default: 0 },
  history: [{ amount: Number, date: { type: Date, default: Date.now } }]
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registrar usuário
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.json({ error: "Email já registrado" });

  const hashedPassword = await bcrypt.hash(senha, 10);
  const user = new User({ nome, email, senha: hashedPassword });
  await user.save();
  res.json({ message: "Usuário registrado com sucesso!" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return res.json({ error: "Senha incorreta" });

  res.json({ userId: user._id });
});

// Minerar coins
app.post("/mine/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.json({ error: "Usuário não encontrado" });

  user.balance += 10;
  user.history.push({ amount: 10 });
  await user.save();

  res.json({ newBalance: user.balance });
});

// Histórico
app.get("/mining-history/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.json([]);
  res.json(user.history);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
