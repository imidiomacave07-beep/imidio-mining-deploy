import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import miningRoutes from "./routes/miningRoutes.js";

const app = express();
app.use(express.json());

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// Rotas da mineração
app.use("/api/mining", miningRoutes);

// Rota para dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
