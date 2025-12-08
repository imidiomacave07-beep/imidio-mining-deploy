import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
const mongoURI = "mongodb+srv://imidiomacave:84882990Ma@cluster0.fqqvnqa.mongodb.net/mining?retryWrites=true&w=majority";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// Schemas
const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  profitPercent: Number,
  durationDays: Number,
  withdrawDelayDays: Number
});
const depositSchema = new mongoose.Schema({
  user: String,
  amount: String
});
const withdrawalSchema = new mongoose.Schema({
  user: String,
  amount: String
});

const Plan = mongoose.model("Plan", planSchema);
const Deposit = mongoose.model("Deposit", depositSchema);
const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);

// Rotas
app.get("/api/plans", async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
});

app.get("/api/deposits", async (req, res) => {
  const deposits = await Deposit.find().sort({ _id: -1 }).limit(10);
  res.json(deposits);
});

app.get("/api/withdrawals", async (req, res) => {
  const withdrawals = await Withdrawal.find().sort({ _id: -1 }).limit(10);
  res.json(withdrawals);
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Servidor rodando na porta 10000");
});
