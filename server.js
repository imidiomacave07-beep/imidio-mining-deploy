import express from 'express';
import mongoose from 'mongoose';

const app = express();

// Conectar ao MongoDB Atlas
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro MongoDB:', err.message));

// Porta do Render
const PORT = process.env.PORT || 10000;

// Rota principal de teste
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
