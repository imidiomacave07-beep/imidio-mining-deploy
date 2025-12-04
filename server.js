import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// Para trabalhar com __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// 3. Rota para criar conta
// ----------------------------
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = new User({ nome, email, senha: hashedPassword });
    await user.save();
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar usuário" });
  }
});

// ----------------------------
// 4. Rota de login
// ----------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "Usuário não encontrado" });

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.json({ error: "Senha incorreta" });

    res.json({ userId: user._id, nome: user.nome, balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// ----------------------------
// 5. Rotas de mineração
// ----------------------------
app.post("/mine/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    user.balance += 10; // minerando 10 Coins
    await user.save();

    res.json({ newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ error: "Erro ao minerar" });
  }
});

// ----------------------------
// 6. Servir arquivos estáticos
// ----------------------------
app.use(express.static(path.join(__dirname, "public")));

// Rotas amigáveis
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/plans", (req, res) => {
  res.sendFile(path.join(__dirname, "public/plans.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public/profile.html"));
});

app.get("/history", (req, res) => {
  res.sendFile(path.join(__dirname, "public/history.html"));
});

// ----------------------------
// 7. Start do servidor
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
