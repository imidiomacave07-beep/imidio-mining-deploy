// routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// Model (separado opcional — aqui inline para simplicidade)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.json({ success:false, message:"Preencha todos os campos" });

    const exists = await User.findOne({ email });
    if (exists) return res.json({ success:false, message:"Email já registrado" });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hash });
    await user.save();

    res.json({ success: true, message: "Conta criada com sucesso" });
  } catch (err) {
    console.error(err);
    res.json({ success:false, message:"Erro interno" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success:false, message:"Preencha todos os campos" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success:false, message:"Usuário não encontrado" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json({ success:false, message:"Senha inválida" });

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });

    res.json({ success:true, message:"Autenticado", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.json({ success:false, message:"Erro no servidor" });
  }
});

export default router;
