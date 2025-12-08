import express from "express";
import mongoose from "mongoose";
import { getPlans, buyPlan, getUserPlans } from "./bytesPlan.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Rotas
app.get("/plans", async (req, res) => {
  const plans = await getPlans();
  res.json(plans);
});

app.post("/buy/:planId", async (req, res) => {
  try {
    const userPlan = await buyPlan(req.body.userId, req.params.planId);
    res.json(userPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/user-plans/:userId", async (req, res) => {
  const plans = await getUserPlans(req.params.userId);
  res.json(plans);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
