import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // para chamadas externas (PayPal API)

const app = express();
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

app.use(bodyParser.json());

// --- MongoDB --- 
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.log("Erro ao conectar MongoDB:", err));

// --- Schemas ---
const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  profitPercent: Number,
  durationDays: Number,
  withdrawDelayDays: Number
});
const Plan = mongoose.model("Plan", planSchema);

const purchaseSchema = new mongoose.Schema({
  userId: String,
  planId: String,
  paymentMethod: String,
  status: { type: String, default: "pendente" },
  startDate: Date,
  withdrawAvailableDate: Date
});
const Purchase = mongoose.model("Purchase", purchaseSchema);

// --- Rotas ---

// Listar planos
app.get("/plans", async (req, res) => {
  const plans = await Plan.find({});
  res.json(plans);
});

// Comprar plano
app.post("/buy-plan", async (req, res) => {
  const { userId, planId, paymentMethod } = req.body;
  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json({ error: "Plano não encontrado" });

  // Criar compra pendente
  const purchase = new Purchase({
    userId,
    planId,
    paymentMethod,
    startDate: new Date(),
    withdrawAvailableDate: new Date(Date.now() + plan.withdrawDelayDays * 24*60*60*1000)
  });
  await purchase.save();

  if (paymentMethod === "paypal") {
    // Criar pagamento PayPal
    const paypalLink = `https://www.paypal.com/pay?amount=${plan.price}&item=${plan.name}`;
    return res.json({ message: "Compra iniciada", paymentLink: paypalLink });
  }

  if (paymentMethod === "crypto") {
    // Criar endereço BTC/ETH fictício (exemplo)
    const cryptoAddress = "bc1qexemplo1234567890"; 
    return res.json({ message: "Compra iniciada", cryptoAddress });
  }

  res.status(400).json({ error: "Método de pagamento inválido" });
});

// Listar compras de usuário
app.get("/purchases/:userId", async (req, res) => {
  const purchases = await Purchase.find({ userId: req.params.userId });
  res.json(purchases);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
