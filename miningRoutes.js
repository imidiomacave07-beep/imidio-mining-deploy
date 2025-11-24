import express from "express";
const router = express.Router();

let miningStatus = "Parado";

// Status da mineração
router.get("/status", (req, res) => {
  res.json({ status: miningStatus });
});

// Iniciar mineração
router.post("/start-mining", (req, res) => {
  miningStatus = "Em execução";
  res.json({ status: miningStatus });
});

// Parar mineração
router.post("/stop-mining", (req, res) => {
  miningStatus = "Parado";
  res.json({ status: miningStatus });
});

export default router;
