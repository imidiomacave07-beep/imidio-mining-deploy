import express from "express";
const router = express.Router();

// Estado da mineração (simulado em memória)
let miningStatus = "Parado";

// Rota para obter status
router.get("/status", (req, res) => {
  res.json({ status: miningStatus });
});

// Rota para iniciar mineração
router.post("/start", (req, res) => {
  miningStatus = "Rodando";
  res.json({ status: miningStatus, message: "Mineração iniciada!" });
});

// Rota para parar mineração
router.post("/stop", (req, res) => {
  miningStatus = "Parado";
  res.json({ status: miningStatus, message: "Mineração parada!" });
});

export default router;
