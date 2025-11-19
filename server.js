import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// API de mineração (exemplo)
app.get("/api/start-mining", (req, res) => {
  res.json({ message: "Mineração iniciada!" });
});

// Rotas HTML separadas (opcional)
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/mining", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mining.html"));
});

// Rota “catch all” para SPA ou rotas desconhecidas
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
