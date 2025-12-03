import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  balance: { type: Number, default: 0 },
});

export const User = mongoose.model("User", UserSchema);
