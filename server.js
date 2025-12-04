import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// Caminhos para servir HTML estático
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public"))); // todos os HTML, CSS, JS na pasta public

// ----------------------------
// 1. Conexão MongoDB
// ----------------------------
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// ----------------------------
// 2. Modelo do Usuário
// ----------------------------
const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  balance: { type: Number, default: 0 },
  miningHistory: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// 3. Rotas
// ----------------------------

// Rota raiz - opcional
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Registrar usuário
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashed = await bcrypt.hash(senha, 10);
    const user = new User({ nome, email, senha: hashed });
    await user.save();
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "Usuário não encontrado." });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.json({ error: "Senha incorreta." });

    res.json({ userId: user._id, nome: user.nome, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Erro no login." });
  }
});

// Mineração
app.post("/mine/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const mined = 10; // Coins por clique
    user.balance += mined;
    user.miningHistory.push({ amount: mined });
    await user.save();

    res.json({ newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Erro na mineração." });
  }
});

// Histórico de mineração
app.get("/mining-history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    res.json(user.miningHistory);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar histórico." });
  }
});

// ----------------------------
// 4. Porta
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
