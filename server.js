import express from 'express';
import mongoose from 'mongoose';

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro MongoDB:', err));

// Porta do Render
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
