const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Permitir JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.use("/auth", require("./routes/authRoutes"));
app.use("/mining", require("./routes/miningRoutes"));

// Rota principal (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Mantém o Render acordado
require("./keep-alive");

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor online na porta ${PORT}`);
});
