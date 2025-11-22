import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Carrega variáveis do ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rotas (certifique-se que esses arquivos existam)
import authRoutes from "./routes/authRoutes.js";
import miningRoutes from "./routes/miningRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/mining", miningRoutes);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Porta do servidor
const PORT = process.env.PORT || 10000;

// Conexão com MongoDB usando variável de ambiente
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("Erro: MONGO_URI não definida no ambiente!");
  process.exit(1); // encerra o app se a URI não existir
}

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB conectado com sucesso!");
    // Inicia o servidor após conectar ao MongoDB
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });
