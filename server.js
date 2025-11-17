const express = require("express");
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para ler JSON
app.use(express.json());

// Simulação de banco de dados
const usuarios = [];

// Rota de cadastro
app.post("/api/cadastro", (req, res) => {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Verificar se o usuário já existe
    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        return res.status(400).json({ message: "Email já cadastrado." });
    }

    // Salvar usuário
    usuarios.push({ nome, email, senha });
    res.json({ message: "Cadastro realizado com sucesso!" });
});

// Página inicial
app.use(express.static("public"));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
