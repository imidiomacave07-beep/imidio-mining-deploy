// src/server.js
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js";
import miningRoutes from "./miningRoutes.js";
import { Plan } from "./models.js";

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) console.warn("WARNING: MONGO_URI not set — connect to your Atlas string in Render env vars.");
mongoose.connect(mongoUri, { dbName: "mining" })
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.error("Erro MongoDB:", err));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api", miningRoutes);

// Fallback to index for client-side routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Seed default plans if none exist (only once)
async function seedPlans() {
  try {
    const count = await Plan.countDocuments();
    if (count === 0) {
      await Plan.insertMany([
        { name: "Bronze", price: 10, profitPercent: 20, durationDays: 180, withdrawDelayDays: 10 },
        { name: "Prata", price: 50, profitPercent: 30, durationDays: 180, withdrawDelayDays: 10 },
        { name: "Ouro", price: 100, profitPercent: 50, durationDays: 180, withdrawDelayDays: 10 }
      ]);
      console.log("Planos seed inseridos.");
    }
  } catch (err) {
    console.error("Erro ao seedar planos:", err);
  }
}
seedPlans();

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
