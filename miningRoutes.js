import express from "express";
const router = express.Router();

let miningStatus = "Parado";

// Status
router.get("/status", (req, res) => {
  res.json({ status: miningStatus });
});

// Iniciar
router.post("/start", (req, res) => {
  miningStatus = "Em execução";
  res.json({ status: miningStatus });
});

// Parar
router.post("/stop", (req, res) => {
  miningStatus = "Parado";
  res.json({ status: miningStatus });
});

export default router;
