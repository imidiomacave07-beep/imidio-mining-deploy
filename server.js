import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// Ajustes para trabalhar com ES Modules e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Rotas “bonitas” sem precisar do .html
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/dashboard", (req, res) => res.sendFile(path.join(__dirname, "public", "dashboard.html")));
app.get("/history", (req, res) => res.sendFile(path.join(__dirname, "public", "history.html")));
app.get("/plans", (req, res) => res.sendFile(path.join(__dirname, "public", "plans.html")));
app.get("/profile", (req, res) => res.sendFile(path.join(__dirname, "public", "profile.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/deposit", (req, res) => res.sendFile(path.join(__dirname, "public", "deposit.html")));
app.get("/withdraw", (req, res) => res.sendFile(path.join(__dirname, "public", "withdraw.html")));
app.get("/payment", (req, res) => res.sendFile(path.join(__dirname, "public", "payment.html")));
app.get("/confirm_deposit", (req, res) => res.sendFile(path.join(__dirname, "public", "confirm_deposit.html")));
app.get("/teste", (req, res) => res.sendFile(path.join(__dirname, "public", "teste.html")));

// Aqui você pode adicionar suas rotas de API (login, register, mine, etc.)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
