import express from "express";
const router = express.Router();

// Rota de teste
router.get("/", (req, res) => {
  res.send("Rota de autenticação funcionando!");
});

export default router;
