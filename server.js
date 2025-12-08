// server.js
import express from "express";
import mongoose from "mongoose";
import path from "path";

const app = express();
const PORT = process.env.PORT || 10000;
const __dirname = path.resolve();

// Conecta ao MongoDB
const mongoURI = process.env.MONGO_URI || "mongodb+srv://imidiomacave:84882990Ma@cluster0.fqqvnqa.mongodb.net/mining?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB conectado com sucesso!"))
.catch(err => console.log("Erro ao conectar MongoDB:", err));

// Middleware para arquivos estáticos (index.html dentro de /public)
app.use(express.static(path.join(__dirname, "public")));

// Rotas extras se precisar futuramente
app.get("/api/status", (req, res) => {
  res.json({ status: "Plataforma online!" });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
