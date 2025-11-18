import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("<h1>🚀 Imidio Mining está online!</h1><p>Bem-vindo à sua plataforma.</p>");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
