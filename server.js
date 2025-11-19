import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Para permitir __dirname em ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API de mineração
app.get("/api/start-mining", (req, res) => {
  res.json({ message: "Mineração iniciada!" });
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// Se o usuário acessar qualquer rota que não seja API, retorna o index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Porta obrigatória da Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
