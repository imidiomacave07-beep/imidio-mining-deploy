// src/routes/miningRoutes.js
import express from "express";

const router = express.Router();

// Estado simulado da mineração
let miningStatus = "Parado"; // Pode ser "Rodando" ou "Parado"

// Rota para obter status da mineração
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
