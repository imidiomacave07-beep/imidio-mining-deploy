import express from "express";
const router = express.Router();

let miningStatus = false;

router.get("/status", (req, res) => {
  res.json({ status: miningStatus ? "Rodando" : "Parado" });
});

router.post("/start", (req, res) => {
  miningStatus = true;
  res.json({ status: "Iniciada" });
});

router.post("/stop", (req, res) => {
  miningStatus = false;
  res.json({ status: "Parada" });
});

export default router;
