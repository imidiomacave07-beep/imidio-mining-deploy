// bytesPlan.js
import mongoose from "mongoose";

// Schema para os planos
const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  profitPercent: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  withdrawDelayDays: { type: Number, required: true },
});

const userPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  purchaseDate: { type: Date, default: Date.now },
  withdrawAvailable: { type: Date },
  active: { type: Boolean, default: true },
});

const Plan = mongoose.model("Plan", planSchema);
const UserPlan = mongoose.model("UserPlan", userPlanSchema);

// Função para listar todos os planos
export async function getPlans() {
  return await Plan.find({});
}

// Função para comprar um plano
export async function buyPlan(userId, planId) {
  const plan = await Plan.findById(planId);
  if (!plan) throw new Error("Plano não encontrado");

  const purchaseDate = new Date();
  const withdrawAvailable = new Date(
    purchaseDate.getTime() + plan.withdrawDelayDays * 24 * 60 * 60 * 1000
  );

  const userPlan = new UserPlan({
    userId,
    planId,
    purchaseDate,
    withdrawAvailable,
  });

  await userPlan.save();
  return userPlan;
}

// Função para listar planos comprados pelo usuário
export async function getUserPlans(userId) {
  return await UserPlan.find({ userId }).populate("planId");
}
