const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// Servir arquivos estáticos da pasta raiz
app.use(express.static(__dirname));

// Rota principal (index)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Porta usada pelo Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
