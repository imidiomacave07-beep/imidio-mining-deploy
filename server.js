const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static("public")); // Para servir index.html e arquivos públicos

app.get("/api/status", (req, res) => {
  res.json({ message: "🚀 Imidio Mining Server está online!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
