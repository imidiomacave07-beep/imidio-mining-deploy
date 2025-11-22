import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express(); // <- isso é ESSENCIAL

app.use(cors());
app.use(express.json());

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas
import authRoutes from "./routes/authRoutes.js";
import miningRoutes from "./routes/miningRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/mining", miningRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Conectar MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/imidioMiningDB";

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB conectado!"))
  .catch(err => console.log("Erro MongoDB:", err));

// Servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
