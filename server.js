const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

// Servir arquivos estáticos da pasta "public"
app.use(express.static("public"));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Imidio Mining Server está online na porta ${PORT}`);
});
