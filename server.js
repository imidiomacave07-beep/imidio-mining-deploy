import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Erro: variável MONGO_URI não definida!');
  process.exit(1); // força saída para evitar tentar conectar undefined
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado!'))
.catch(err => console.error('Erro MongoDB:', err));
