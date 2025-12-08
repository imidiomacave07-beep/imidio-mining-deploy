import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
app.use(bodyParser.json());

// Conexão com MongoDB
const MONGO_URI = process.env.MONGO_URI || "sua_string_do_mongo_aqui";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// Rotas simples
app.get("/", (req, res) => {
  res.send("Imidio Mining Platform funcionando!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
