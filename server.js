// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

let db, users, history;

async function connectDB() {
  await client.connect();
  db = client.db("imidioMining");
  users = db.collection("users");
  history = db.collection("history");
  console.log("MongoDB conectado com sucesso!");
}

connectDB().catch(console.error);

// Rotas
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.json({ message: "Todos os campos são obrigatórios" });

  const userExists = await users.findOne({ email });
  if (userExists) return res.json({ message: "Email já registrado" });

  const hashed = await bcrypt.hash(senha, 10);
  const newUser = { nome, email, senha: hashed, balance: 0 };
  const result = await users.insertOne(newUser);
  res.json({ message: "Conta criada com sucesso!" });
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await users.findOne({ email });
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.json({ error: "Senha incorreta" });

  res.json({ userId: user._id.toString(), message: "Login bem-sucedido" });
});

app.post("/mine/:userId", async (req, res) => {
  const { userId } = req.params;
  const amount = 10; // Coins por mineração

  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $inc: { balance: amount } },
    { returnDocument: "after" }
  );

  await history.insertOne({ userId, amount, date: new Date(), type: "mine" });

  res.json({ newBalance: result.value.balance });
});

app.get("/mining-history/:userId", async (req, res) => {
  const { userId } = req.params;
  const logs = await history.find({ userId }).sort({ date: 1 }).toArray();
  res.json(logs);
});

app.post("/buy-plan/:userId", async (req, res) => {
  const { userId } = req.params;
  const { planAmount } = req.body;

  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $inc: { balance: planAmount } },
    { returnDocument: "after" }
  );

  await history.insertOne({ userId, amount: planAmount, date: new Date(), type: "plan" });

  res.json({ newBalance: result.value.balance });
});

// Rota padrão
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
