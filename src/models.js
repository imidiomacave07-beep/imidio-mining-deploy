// src/models.js
import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  profitPercent: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1 },
  withdrawDelayDays: { type: Number, required: true, min: 0 }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: false },
  balance: { type: Number, required: true, min: 0, default: 0 }
});

const stakeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  purchaseDate: { type: Date, required: true, default: Date.now },
  canWithdrawDate: { type: Date, required: true },
  price: { type: Number, required: true, min: 0 },
  profitPercent: { type: Number, required: true, min: 0 }
});

// Register models only once
export const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Stake = mongoose.models.Stake || mongoose.model("Stake", stakeSchema);
