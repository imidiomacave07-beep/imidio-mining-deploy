import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  balance: { type: Number, default: 0 },
});

const MiningHistorySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String, // 'mine' ou 'plan'
  amount: Number,
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const MiningHistory = mongoose.model("MiningHistory", MiningHistorySchema);

// Registro
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);
  const user = new User({ nome, email, senha: hashedPassword });
  await user.save();
  res.json({ message: "Usuário registrado com sucesso!" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "Usuário não encontrado!" });
  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.json({ error: "Senha incorreta!" });
  res.json({ userId: user._id, nome: user.nome, balance: user.balance });
});

// Minerar
app.post("/mine/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  user.balance += 10; // 10 Coins por clique
  await user.save();
  const log = new MiningHistory({ userId: user._id, type: "mine", amount: 10 });
  await log.save();
  res.json({ newBalance: user.balance });
});

// Comprar planos
app.post("/buy-plan/:userId", async (req, res) => {
  const { plan } = req.body; // 'basico', 'pro', 'premium'
  const user = await User.findById(req.params.userId);
  let amount = 0;

  if (plan === "basico") amount = 10;
  if (plan === "pro") amount = 50;
  if (plan === "premium") amount = 150;

  user.balance += amount;
  await user.save();

  const log = new MiningHistory({ userId: user._id, type: "plan", amount });
  await log.save();

  res.json({ newBalance: user.balance });
});

// Histórico
app.get("/mining-history/:userId", async (req, res) => {
  const logs = await MiningHistory.find({ userId: req.params.userId }).sort({ date: 1 });
  res.json(logs);
});

app.listen(process.env.PORT || 10000, () => console.log("Servidor rodando na porta 10000"));
