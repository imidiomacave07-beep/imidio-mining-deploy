import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Rota para pegar status da mineração do usuário
router.get("/status", async (req, res) => {
  try {
    // Aqui você vai identificar o usuário, por enquanto vamos pegar o primeiro usuário do banco
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    res.json({ miningStatus: user.miningStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao obter status da mineração" });
  }
});

// Rota para iniciar a mineração
router.post("/start", async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.miningStatus = "Ativo";
    await user.save();

    res.json({ message: "Mineração iniciada!", miningStatus: user.miningStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao iniciar mineração" });
  }
});

// Rota para parar a mineração
router.post("/stop", async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.miningStatus = "Parado";
    await user.save();

    res.json({ message: "Mineração parada!", miningStatus: user.miningStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao parar mineração" });
  }
});

export default router;
