import express from "express";

const router = express.Router();

let miningStatus = "stopped";

// Ver status da mineração
router.get("/status", (req, res) => {
  res.json({ status: miningStatus });
});

// Iniciar mineração
router.post("/start", (req, res) => {
  miningStatus = "running";
  res.json({ message: "Mineração iniciada", status: miningStatus });
});

// Parar mineração
router.post("/stop", (req, res) => {
  miningStatus = "stopped";
  res.json({ message: "Mineração parada", status: miningStatus });
});

export default router;
