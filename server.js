import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Conexão MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.log("Erro ao conectar MongoDB:", err));

// Schema e modelo
const PlanSchema = new mongoose.Schema({
  name: String,
  price: Number,
  profitPercent: Number,
  durationDays: Number,
  withdrawDelayDays: Number
});
const Plan = mongoose.model("Plan", PlanSchema);

const UserSchema = new mongoose.Schema({
  name: String,
  balance: Number,
});
const User = mongoose.model("User", UserSchema);

const DepositSchema = new mongoose.Schema({
  user: String,
  amount: Number
});
const Deposit = mongoose.model("Deposit", DepositSchema);

const WithdrawSchema = new mongoose.Schema({
  user: String,
  amount: Number
});
const Withdraw = mongoose.model("Withdraw", WithdrawSchema);

// Rotas API
app.get("/api/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

app.get("/api/plans", async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
});

app.get("/api/deposits", async (req, res) => {
  const deposits = await Deposit.find().sort({ _id: -1 }).limit(10);
  res.json(deposits);
});

app.get("/api/withdraws", async (req, res) => {
  const withdraws = await Withdraw.find().sort({ _id: -1 }).limit(10);
  res.json(withdraws);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
