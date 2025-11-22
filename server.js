const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB conectado"))
.catch((err) => console.error("Erro MongoDB:", err));

// Servir frontend
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log("Servidor rodando na porta " + port);
});
