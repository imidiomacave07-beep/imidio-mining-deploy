import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar caminho para a pasta public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Conectar ao MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb+srv://imidiomacave:84882990Ma@cluster0.fqqvnqa.mongodb.net/mining?retryWrites=true&w=majority";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
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

// Rotas API
app.get("/api/plans", async (req, res) => {
  const plans = await Plan.find({});
  res.json(plans);
});

app.get("/api/deposits", async (req, res) => {
  const deposits = await Deposit.find({}).sort({ _id: -1 }).limit(10);
  res.json(deposits);
});

app.get("/api/withdrawals", async (req, res) => {
  const withdrawals = await Withdrawal.find({}).sort({ _id: -1 }).limit(10);
  res.json(withdrawals);
});

// Start do servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
