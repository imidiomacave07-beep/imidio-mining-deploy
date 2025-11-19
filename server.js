import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Para permitir __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// API de mineração
app.get("/api/start-mining", (req, res) => {
  res.json({ message: "Mineração iniciada!" });
});

// Rotas explícitas
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/mining", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mining.html"));
});

// Catch-all para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Porta da Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
