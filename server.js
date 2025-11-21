import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 CONECTAR DIRETO NO MONGO ATLAS (sem variáveis)
const MONGO_URI = "mongodb+srv://imidiomacave07_db_user:rt5vuTR1NFtV74Nx@cluster0.mongodb.net/imidioMiningDB?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro ao conectar no MongoDB:", err));

// 🔥 Rotas de mineração
let miningStatus = false;

app.get("/api/mining/status", (req, res) => {
  res.json({ status: miningStatus ? "running" : "stopped" });
});

app.post("/api/mining/start", (req, res) => {
  miningStatus = true;
  res.json({ message: "Mineração iniciada!" });
});

app.post("/api/mining/stop", (req, res) => {
  miningStatus = false;
  res.json({ message: "Mineração parada!" });
});

// 🔥 Rota do dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// 🔥 Porta do Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
