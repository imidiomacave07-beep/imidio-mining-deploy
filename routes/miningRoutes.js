// routes/miningRoutes.js
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

let miningStatus = "Parado";

// middleware: verifica token JWT no header Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) return res.status(401).json({ success:false, message:"Token ausente" });

  const parts = authHeader.split(" ");
  const token = parts.length === 2 ? parts[1] : null;
  if (!token) return res.status(401).json({ success:false, message:"Token malformado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success:false, message:"Token inválido" });
  }
}

// Status — protegido
router.get("/status", verifyToken, (req, res) => {
  res.json({ status: miningStatus });
});

// Start — protegido
router.post("/start", verifyToken, (req, res) => {
  miningStatus = "Em execução";
  res.json({ status: miningStatus });
});

// Stop — protegido
router.post("/stop", verifyToken, (req, res) => {
  miningStatus = "Parado";
  res.json({ status: miningStatus });
});

export default router;
