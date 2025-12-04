const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE A PASTA PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// ROTA PADRÃO
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// PORTA DO RENDER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
