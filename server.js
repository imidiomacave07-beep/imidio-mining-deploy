import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

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
  email: { type: String, unique: true },
  senha: String,
  saldo: { type: Number, default: 0 },
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// Rotas
// ----------------------------

// Registrar usuário
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedSenha = await bcrypt.hash(senha, 10);
    const novoUsuario = new User({ nome, email, senha: hashedSenha });
    await novoUsuario.save();
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao registrar usuário", details: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Email não encontrado" });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ error: "Senha incorreta" });

    res.json({ message: "Login realizado com sucesso!", saldo: user.saldo, nome: user.nome });
  } catch (err) {
    res.status(500).json({ error: "Erro no login", details: err.message });
  }
});

// Dashboard (simplesmente retorna saldo)
app.get("/dashboard/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ nome: user.nome, saldo: user.saldo });
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar dashboard", details: err.message });
  }
});

// Servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
