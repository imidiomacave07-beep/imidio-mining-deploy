import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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
// 3. Rota raiz para teste
// ----------------------------
app.get("/", (req, res) => {
  res.send("Servidor rodando! Backend ativo!");
});

// ----------------------------
// 4. Rota para criar conta
// ----------------------------
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Usuário já existe." });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Cria novo usuário
    const newUser = new User({ nome, email, senha: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro interno do servidor." });
  }
});

// ----------------------------
// 5. Rota de login
// ----------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica usuário
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuário não encontrado." });

    // Verifica senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ msg: "Senha incorreta." });

    res.status(200).json({ msg: "Login realizado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro interno do servidor." });
  }
});

// ----------------------------
// 6. Start servidor
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
