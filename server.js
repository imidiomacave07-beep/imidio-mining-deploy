import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Fix para __dirname em ES Module:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

// Modelo de usuário
const UserSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String
});
const User = mongoose.model("User", UserSchema);

// Rota inicial → SERVE O FRONTEND
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registro de usuário
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  const usuarioExiste = await User.findOne({ email });
  if (usuarioExiste) return res.status(400).json({ message: "Usuário já existe" });

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = new User({
    nome,
    email,
    senha: senhaHash
  });

  await novoUsuario.save();

  res.json({ message: "Usuário criado com sucesso!" });
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Porta Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
