// src/miningRoutes.js
import express from "express";
import mongoose from "mongoose";
import { Plan, User, Stake } from "./models.js";

const router = express.Router();

// Get all plans
router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar planos" });
  }
});

// Buy plan
router.post("/buy-plan", async (req, res) => {
  try {
    const { userId, planId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    if (!plan) return res.status(404).json({ error: "Plano não encontrado" });

    if (user.balance < plan.price) return res.status(400).json({ error: "Saldo insuficiente" });

    user.balance -= plan.price;
    await user.save();

    const now = new Date();
    const stake = new Stake({
      userId: user._id,
      planId: plan._id,
      purchaseDate: now,
      canWithdrawDate: new Date(now.getTime() + plan.withdrawDelayDays * 24 * 60 * 60 * 1000),
      price: plan.price,
      profitPercent: plan.profitPercent
    });
    await stake.save();

    res.json({ message: "Plano comprado com sucesso", stake });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao comprar plano" });
  }
});

export default router;
