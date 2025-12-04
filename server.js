const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 10000;

// Servir ficheiros estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
