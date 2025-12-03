import mongoose from "mongoose";

const MiningLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  date: { type: Date, default: Date.now },
});

export const MiningLog = mongoose.model("MiningLog", MiningLogSchema);
