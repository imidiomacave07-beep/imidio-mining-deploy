import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// ----------------------------
// 1. Configurar arquivos estáticos
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ----------------------------
// 2. Conexão MongoDB
// ----------------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// ----------------------------
// 3. Modelo do Usuário
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
// 4. Rota para criar conta
// ----------------------------
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "Email já registrado!" });
    }

    const newUser = new User({ nome, email, senha: hashedPassword });
    await newUser.save();
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

// ----------------------------
// 5. Rota de login
// ----------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.json({ error: "Senha incorreta" });

    res.json({ userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Erro no login" });
  }
});

// ----------------------------
// 6. Mineração
// ----------------------------
app.post("/mine/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const mined = 10; // Coins minerados por vez
    user.balance += mined;
    user.miningHistory.push({ amount: mined });
    await user.save();

    res.json({ newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Erro ao minerar" });
  }
});

// ----------------------------
// 7. Histórico de mineração
// ----------------------------
app.get("/mining-history/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user.miningHistory);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter histórico" });
  }
});

// ----------------------------
// 8. Rodar servidor
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
