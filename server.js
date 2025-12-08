import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// =============================
// 🔌 CONEXÃO MONGODB
// =============================
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro ao conectar MongoDB:", err));

// =============================
// 📦 MODELO DE PLANOS
// =============================
const planSchema = new mongoose.Schema({
  name: String,
  price: Number,
  profitPercent: Number,
  durationDays: Number,
  withdrawDelayDays: Number,
});

const Plan = mongoose.model("Plan", planSchema);

// =============================
// 🛠️ CRIAÇÃO AUTOMÁTICA DOS PLANOS
// =============================
async function createDefaultPlans() {
  const count = await Plan.countDocuments();

  if (count === 0) {
    await Plan.insertMany([
      {
        name: "Plano Bronze",
        price: 10,
        profitPercent: 20,
        durationDays: 180,
        withdrawDelayDays: 10,
      },
      {
        name: "Plano Prata",
        price: 50,
        profitPercent: 30,
        durationDays: 180,
        withdrawDelayDays: 10,
      },
      {
        name: "Plano Ouro",
        price: 100,
        profitPercent: 50,
        durationDays: 180,
        withdrawDelayDays: 10,
      }
    ]);

    console.log("Planos criados com sucesso!");
  } else {
    console.log("Planos já existem, nada a criar.");
  }
}

createDefaultPlans();

// =============================
// 📡 ROTA PARA LISTAR OS PLANOS
// =============================
app.get("/plans", async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
});

// =============================
// 🚀 INICIAR SERVIDOR
// =============================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
