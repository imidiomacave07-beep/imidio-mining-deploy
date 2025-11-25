import express from "express";
import MiningStatus from "../models/MiningStatus.js"; // Modelo mongoose para status

const router = express.Router();

// Inicia status no banco se não existir
router.get("/status", async (req, res) => {
  try {
    let status = await MiningStatus.findOne();
    if (!status) {
      status = new MiningStatus({ status: "Parado" });
      await status.save();
    }
    res.json({ status: status.status });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar status" });
    console.error(err);
  }
});

// Iniciar mineração
router.post("/start-mining", async (req, res) => {
  try {
    let status = await MiningStatus.findOne();
    if (!status) {
      status = new MiningStatus({ status: "Em execução" });
    } else {
      status.status = "Em execução";
    }
    await status.save();
    res.json({ status: status.status });
  } catch (err) {
    res.status(500).json({ error: "Erro ao iniciar mineração" });
    console.error(err);
  }
});

// Parar mineração
router.post("/stop-mining", async (req, res) => {
  try {
    let status = await MiningStatus.findOne();
    if (!status) {
      status = new MiningStatus({ status: "Parado" });
    } else {
      status.status = "Parado";
    }
    await status.save();
    res.json({ status: status.status });
  } catch (err) {
    res.status(500).json({ error: "Erro ao parar mineração" });
    console.error(err);
  }
});

export default router;
