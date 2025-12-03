import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // <--- Agora seguro no Render
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
  email: String,
  senha: String,
});

const User = mongoose.model("User", UserSchema);

// ----------------------------
// 3. Rota para criar conta
// ----------------------------
app.post("/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUser = new User({
      nome,
      email,
      senha: senhaCriptografada,
    });

    await novoUser.save();
    res.json({ sucesso: true, mensagem: "Conta criada com sucesso!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar conta" });
  }
});

// ----------------------------
// 4. Rota para login
// ----------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    res.json({ sucesso: true, mensagem: "Login bem-sucedido!" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no login" });
  }
});

// ----------------------------
// 5. Porta Render
// ----------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Servidor rodando na porta " + PORT));
