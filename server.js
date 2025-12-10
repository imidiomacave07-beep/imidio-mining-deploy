import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js"; // <-- import das rotas de auth

const app = express();
const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Conectar MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb+srv://imidiomacave:84882990Ma@cluster0.fqqvnqa.mongodb.net/mining?retryWrites=true&w=majority";
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB conectado!"))
    .catch(err => console.error("Erro MongoDB:", err));

// Usar rotas de autenticação
app.use("/api/auth", authRoutes);

// Start
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
