import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve arquivos estáticos (HTML, CSS, JS)

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
  miningHistory: [{ amount: Number, date: { type: Date, default: Date.now } }]
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// 3. Rotas
// ----------------------------

// Registro
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);

    const existing = await User.findOne({ email });
    if (existing) return res.json({ error: "Usuário já existe" });

    const user = new User({ nome, email, senha: hashedPassword });
    await user.save();
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.json({ error: "Senha incorreta" });

    res.json({ userId: user._id });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Minerar Coins
app.post("/mine/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.json({ error: "Usuário não encontrado" });

    const minedAmount = 10; // Coins por clique
    user.balance += minedAmount;
    user.miningHistory.push({ amount: minedAmount });
    await user.save();

    res.json({ newBalance: user.balance });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Histórico de Mineração
app.get("/mining-history/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.json([]);

    res.json(user.miningHistory);
  } catch (err) {
    res.json([]);
  }
});

// ----------------------------
// 4. Servir Front-end
// ----------------------------
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// ----------------------------
// 5. Start Server
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
