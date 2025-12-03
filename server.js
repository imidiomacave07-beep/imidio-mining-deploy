import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// ----------------------------
// Servir frontend
// ----------------------------
app.use(express.static(path.join(__dirname, "public")));

// ----------------------------
// Conexão MongoDB
// ----------------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// ----------------------------
// Modelo do Usuário
// ----------------------------
const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// Rota para criar conta
// ----------------------------
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = new User({ nome, email, senha: hashedPassword });
    await user.save();

    res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao registrar usuário." });
  }
});

// ----------------------------
// Iniciar servidor
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
