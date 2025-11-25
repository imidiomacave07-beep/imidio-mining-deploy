import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

// ===============================
//  MODEL DO USUÁRIO
// ===============================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

// ===============================
//  REGISTAR NOVO UTILIZADOR
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.json({ success: false, message: "Preencha todos os campos!" });

    const emailExists = await User.findOne({ email });

    if (emailExists)
      return res.json({ success: false, message: "Email já registado!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ success: true, message: "Conta criada com sucesso!" });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erro interno no servidor" });
  }
});

// ===============================
//  LOGIN DO UTILIZADOR
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.json({ success: false, message: "Usuário não encontrado!" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.json({ success: false, message: "Palavra-passe incorreta!" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login realizado com sucesso!",
      token,
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erro interno ao fazer login!" });
  }
});

export default router;
