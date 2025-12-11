// src/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import { User } from "./models.js";

const router = express.Router();

// Signup (create user)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: "Nome e senha obrigatórios" });

    // If email provided, check duplicate
    if (email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, balance: 0 });
    await user.save();
    res.json({ message: "Conta criada", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email e senha obrigatórios" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Senha incorreta" });

    res.json({
      message: "Login ok",
      user: { id: user._id, name: user.name, email: user.email, balance: user.balance }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

export default router;
