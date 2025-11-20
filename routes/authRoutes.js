import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Registrar usuário
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao registrar usuário: " + error.message });
  }
});

// Login usuário
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    res.json({ message: "Login bem-sucedido!", user });
  } catch (error) {
    res.status(400).json({ error: "Erro ao fazer login: " + error.message });
  }
});

export default router;
