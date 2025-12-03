import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Fix para __dirname em ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// Modelo User
const UserSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
});
const User = mongoose.model("User", UserSchema);

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registro
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Usuário já existe" });

  const senhaHash = await bcrypt.hash(senha, 10);

  await User.create({
    nome,
    email,
    senha: senhaHash,
  });

  res.json({ message: "Usuário criado com sucesso" });
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Porta Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
