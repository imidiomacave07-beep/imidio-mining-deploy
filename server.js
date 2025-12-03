import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";   // CORRETO — única versão permitida no Render
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// ----------------------------
// 1. Conexão MongoDB
// ----------------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch((err) => console.error("Erro MongoDB:", err));

// ----------------------------
// 2. Modelo do Usuário
// ----------------------------
const UserSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// 3. Rota para criar conta (register)
// ----------------------------
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ erro: "Email já registrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novo = new User({
      nome,
      email,
      senha: senhaHash,
    });

    await novo.save();

    res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao registrar usuário", detalhe: err });
  }
});

// ----------------------------
// 4. Rota inicial
// ----------------------------
app.get("/", (req, res) => {
  res.send("Servidor funcionando! 🚀");
});

// ----------------------------
// 5. Iniciar servidor
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
