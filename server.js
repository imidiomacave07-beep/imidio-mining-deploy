import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Mongo
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// Models
const UserSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  plan: { type: String, default: "Básico" },
  balance: { type: Number, default: 0 }
});
const MiningLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  plan: String,
  date: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);
const MiningLog = mongoose.model("MiningLog", MiningLogSchema);

// API: Register
app.post("/api/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ error: "Campos obrigatórios" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email já cadastrado" });
    const hash = await bcrypt.hash(senha, 10);
    const u = new User({ nome, email, senha: hash });
    await u.save();
    res.json({ message: "Usuário criado", userId: u._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: "Campos obrigatórios" });
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ error: "Usuário não encontrado" });
    const ok = await bcrypt.compare(senha, u.senha);
    if (!ok) return res.status(400).json({ error: "Senha incorreta" });
    res.json({ message: "Login OK", userId: u._id, nome: u.nome, plan: u.plan, balance: u.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Mine (simulação) - minerar com base no plano
app.post("/api/mine/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    // Planos: Basico +10, Pro +50, Premium +150
    let mined = 10;
    if (user.plan === "Pro") mined = 50;
    if (user.plan === "Premium") mined = 150;

    user.balance += mined;
    await user.save();

    const log = new MiningLog({ userId: user._id, amount: mined, plan: user.plan });
    await log.save();

    res.json({ newBalance: user.balance, mined, plan: user.plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get mining history
app.get("/api/history/:id", async (req, res) => {
  try {
    const logs = await MiningLog.find({ userId: req.params.id }).sort({ date: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Change plan (simple, no payment)
app.post("/api/plan/:id", async (req, res) => {
  try {
    const { plan } = req.body;
    const allowed = ["Básico", "Pro", "Premium"];
    if (!allowed.includes(plan)) return res.status(400).json({ error: "Plano inválido" });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    user.plan = plan;
    await user.save();
    res.json({ message: "Plano atualizado", plan: user.plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve SPA pages (multi-page files already in public)
app.get("*", (req, res) => {
  // If request starts with /api, ignore (shouldn't reach here). Otherwise serve index.html (or allow other pages be requested directly)
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
