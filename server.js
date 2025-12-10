const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());

// Arquivos estáticos na raiz
app.use(express.static(__dirname));

// Rota principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Porta Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log("Servidor rodando na porta " + port);
});
