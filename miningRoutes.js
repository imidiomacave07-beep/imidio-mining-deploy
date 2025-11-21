import express from "express";
const router = express.Router();

// Status da mineração
let miningStatus = false;

// Rota para status
router.get("/status", (req, res) => {
  res.json({ status: miningStatus ? "Rodando" : "Parado" });
});

// Rota para iniciar mineração
router.post("/start", (req, res) => {
  miningStatus = true;
  res.json({ message: "Mineração iniciada" });
});

// Rota para parar mineração
router.post("/stop", (req, res) => {
  miningStatus = false;
  res.json({ message: "Mineração parada" });
});

export default router;
