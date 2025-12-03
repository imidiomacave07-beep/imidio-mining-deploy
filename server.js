import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import basicAuth from 'express-basic-auth';

const app = express();
app.use(express.json());

// --- Conexão com MongoDB Atlas ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error('Erro MongoDB:', err.message));

// --- Schemas e Models ---
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MiningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  minedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Mining = mongoose.model('Mining', MiningSchema);

// --- Middleware de autenticação básica ---
app.use(basicAuth({
  authorizeAsync: true,
  authorizer: async (username, password, cb) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return cb(null, false);
      const match = await bcrypt.compare(password, user.password);
      cb(null, match);
    } catch (err) {
      cb(null, false);
    }
  },
  challenge: true
}));

// --- Rotas ---
// Teste raiz
app.get('/', (req, res) => {
  res.send('Servidor da plataforma de mineração funcionando!');
});

// Criar usuário
app.post('/user', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send({ success: false, error: 'Username e password obrigatórios' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send({ success: true, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Registrar mineração
app.post('/mine', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) return res.status(400).send({ success: false, error: 'userId e amount obrigatórios' });

    const mining = new Mining({ userId, amount });
    await mining.save();
    res.status(201).send({ success: true, mining });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Consultar mineração de um usuário
app.get('/mining/:userId', async (req, res) => {
  try {
    const miningData = await Mining.find({ userId: req.params.userId }).sort({ minedAt: -1 });
    res.status(200).send({ success: true, miningData });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// --- Porta do Render ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
