import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import miningRoutes from "./routes/miningRoutes.js";

const app = express();
app.use(express.json());

// Ajuste para ES Modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas da mineração
app.use("/api/mining", miningRoutes);

// Página inicial (dashboard)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Porta do Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
