import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// CRIAR O APP PRIMEIRO
const app = express();

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve a pasta 'public'

// Rotas
import authRoutes from "./routes/authRoutes.js";
import miningRoutes from "./routes/miningRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/mining", miningRoutes);

// Rota do dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Conexão com MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/imidioMiningDB";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
