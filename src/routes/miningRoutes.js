import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statusFile = path.join(__dirname, "..", "miningStatus.json");

function getStatus() {
  if (!fs.existsSync(statusFile)) {
    return { status: "Parado" };
  }
  return JSON.parse(fs.readFileSync(statusFile, "utf8"));
}

function saveStatus(newStatus) {
  fs.writeFileSync(statusFile, JSON.stringify(newStatus, null, 2));
}

router.get("/status", (req, res) => {
  res.json(getStatus());
});

router.post("/start-mining", (req, res) => {
  saveStatus({ status: "Em execução" });
  res.json({ status: "Em execução" });
});

router.post("/stop-mining", (req, res) => {
  saveStatus({ status: "Parado" });
  res.json({ status: "Parado" });
});

export default router;
