import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import miningRoutes from "./routes/miningRoutes.js";

const app = express();
app.use(express.json());

// Corrigir dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas API
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
