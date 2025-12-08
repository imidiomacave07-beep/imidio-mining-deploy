import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// Rotas
app.post("/register", async (req, res) => { /* lógica de cadastro */ });
app.post("/login", async (req, res) => { /* lógica de login */ });
app.post("/buy-plan/:userId", async (req, res) => { /* lógica de compra de plano */ });
app.get("/plans", async (req, res) => { /* retorna lista de planos */ });

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
