import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve arquivos estáticos da pasta "public"

// Conexão com MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.log("Erro ao conectar MongoDB:", err));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(`${process.cwd()}/public/index.html`); // Serve seu HTML
});

// Aqui você pode adicionar outras rotas API, por exemplo planos, depósitos, etc.

// Rodar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
