import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import miningRoutes from "./routes/miningRoutes.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.use("/api/mining", miningRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
