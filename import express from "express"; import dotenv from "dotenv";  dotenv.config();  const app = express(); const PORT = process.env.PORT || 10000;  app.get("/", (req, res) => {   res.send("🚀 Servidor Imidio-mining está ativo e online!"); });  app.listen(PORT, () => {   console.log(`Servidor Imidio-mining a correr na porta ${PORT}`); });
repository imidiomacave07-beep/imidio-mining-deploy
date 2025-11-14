import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("🚀 Servidor Imidio-mining está ativo e online!");
});

app.listen(PORT, () => {
  console.log(`Servidor Imidio-mining a correr na porta ${PORT}`);
});
