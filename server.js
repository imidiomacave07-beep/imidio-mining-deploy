import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const app = express();

// Corrigir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON
app.use(express.json());

// Conectar ao Mongo usando o nome que VOCÊ configurou no Render
const mongoURI = process.env.mongo_uri || process.env.database_url || process.env.db_connection;

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro MongoDB:", err));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas principais
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Porta usando a variável que VOCÊ colocou
const PORT = process.env.port || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
