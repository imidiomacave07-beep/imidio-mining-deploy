import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import miningRoutes from "./routes/miningRoutes.js";

const app = express();
app.use(express.json());

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Conectar ao MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/imidioMiningDB";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado com sucesso!"))
.catch((err) => console.error("Erro ao conectar MongoDB:", err));

// Rotas da mineração
app.use("/api/mining", miningRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Porta
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
