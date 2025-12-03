import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";

import { User } from "./models/User.js";
import { MiningLog } from "./models/MiningLog.js";

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// ----------------------------
// Registro de usuário
// ----------------------------
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    const user = new User({ nome, email, senha: hashedPassword, balance: 0 });
    await user.save();
    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Login
// ----------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });
    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(400).json({ error: "Senha incorreta" });
    res.json({ message: "Login realizado com sucesso!", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Mineração
// ----------------------------
app.post("/mine/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    const minedCoins = 10;
    user.balance += minedCoins;
    await user.save();

    // registrar histórico
    const log = new MiningLog({ userId: user._id, amount: minedCoins });
    await log.save();

    res.json({ newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Histórico de mineração
// ----------------------------
app.get("/mining-history/:userId", async (req, res) => {
  try {
    const logs = await MiningLog.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
