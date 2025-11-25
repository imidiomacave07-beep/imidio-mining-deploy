import express from "express";
const router = express.Router();

let miningStatus = "Parado";

// Ver status atual
router.get("/status", (req, res) => {
  res.json({ status: miningStatus });
});

// Iniciar mineração
router.post("/start", (req, res) => {
  miningStatus = "Em execução";
  res.json({ status: miningStatus });
});

// Parar mineração
router.post("/stop", (req, res) => {
  miningStatus = "Parado";
  res.json({ status: miningStatus });
});

export default router;
