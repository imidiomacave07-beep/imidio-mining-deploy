const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("🚀 Imidio Mining Server está online!");
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
