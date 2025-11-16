const express = require("express"); // importa o framework Express
const app = express();               // cria a aplicação Express
const PORT = process.env.PORT || 10000; // define a porta (padrão 10000)

// Rota raiz: quando alguém acessa "/", mostra mensagem
app.get("/", (req, res) => {
  res.send("<h1>🚀 Imidio Mining Server está online!</h1><p>Bem-vindo à sua plataforma.</p>");
});

// Inicia o servidor e mostra no console que está rodando
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
