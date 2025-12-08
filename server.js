import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Conectar MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb+srv://imidiomacave:84882990Ma@cluster0.fqqvnqa.mongodb.net/mining?retryWrites=true&w=majority";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro MongoDB:", err));

// Schemas
const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  profitPercent: Number,
  durationDays: Number,
  withdrawDelayDays: Number
});

const userSchema = new mongoose.Schema({
  name: String,
  balance: Number
});

const stakeSchema = new mongoose.Schema({
  userId: String,
  planId: String,
  purchaseDate: Date,
  canWithdrawDate: Date,
  price: Number,
  profitPercent: Number
});

const Plan = mongoose.model("Plan", planSchema);
const User = mongoose.model("User", userSchema);
const Stake = mongoose.model("Stake", stakeSchema);

// Rotas
app.get("/api/plans", async (req, res) => {
  const plans = await Plan.find({});
  res.json(plans);
});

app.get("/api/users/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user);
});

app.post("/api/buy-plan", async (req, res) => {
  const { userId, planId } = req.body;
  const user = await User.findById(userId);
  const plan = await Plan.findById(planId);
  if (!user || !plan) return res.status(404).json({ error: "Usuário ou plano não encontrado" });

  if (user.balance < plan.price) return res.status(400).json({ error: "Saldo insuficiente" });

  user.balance -= plan.price;
  await user.save();

  const now = new Date();
  const stake = new Stake({
    userId,
    planId,
    purchaseDate: now,
    canWithdrawDate: new Date(now.getTime() + plan.withdrawDelayDays * 24 * 60 * 60 * 1000),
    price: plan.price,
    profitPercent: plan.profitPercent
  });

  await stake.save();
  res.json({ message: "Plano comprado com sucesso!", stake });
});

// Start
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
