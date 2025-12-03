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
// Servir arquivos estáticos
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// ----------------------------
// Conexão MongoDB
// ----------------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// ----------------------------
// Modelo do Usuário
// ----------------------------
const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  saldo: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// Rotas
// ----------------------------

// Criar conta
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashed = await bcrypt.hash(senha, 10);
    const user = new User({ nome, email, senha: hashed });
    await user.save();
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(400).json({ error: "Senha incorreta" });
    res.json({ message: "Login realizado com sucesso!", saldo: user.saldo, nome: user.nome });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint teste para minerar
app.post("/mine", async (req, res) => {
  try {
    const { email, coins } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });
    user.saldo += coins;
    await user.save();
    res.json({ message: "Mineração concluída!", saldo: user.saldo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Iniciar servidor
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
