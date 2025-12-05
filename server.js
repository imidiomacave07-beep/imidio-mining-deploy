// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 10000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB setup
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const client = new MongoClient(MONGO_URL);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("imidioMining");
    console.log("MongoDB conectado com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar MongoDB:", err);
  }
}
connectDB();

// Rotas
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Registro
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.json({ message: "Preencha todos os campos" });

  const user = await db.collection("users").findOne({ email });
  if (user) return res.json({ message: "Email já registrado" });

  const hash = await bcrypt.hash(senha, 10);
  const result = await db.collection("users").insertOne({ nome, email, senha: hash, balance: 0 });
  res.json({ message: "Registro concluído com sucesso!", userId: result.insertedId });
});

// Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return res.json({ error: "Senha incorreta" });

  res.json({ userId: user._id });
});

// Mineração
app.post("/mine/:userId", async (req, res) => {
  const { userId } = req.params;
  const coins = 10; // cada mineração dá 10 coins
  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const newBalance = user.balance + coins;
  await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { balance: newBalance } });
  await db.collection("history").insertOne({ userId: user._id, amount: coins, date: new Date(), type: "mine" });

  res.json({ newBalance });
});

// Histórico
app.get("/mining-history/:userId", async (req, res) => {
  const { userId } = req.params;
  const logs = await db.collection("history").find({ userId: new ObjectId(userId) }).toArray();
  res.json(logs);
});

// Comprar plano
app.post("/buy-plan/:userId", async (req, res) => {
  const { userId } = req.params;
  const { planUSD } = req.body; // exemplo: 50, 500, 5000
  const coinsMap = { 10: 10, 50: 50, 500: 500, 1000: 1000, 5000: 5000 }; // coins por plano

  const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const coins = coinsMap[planUSD];
  if (!coins) return res.json({ error: "Plano inválido" });

  const newBalance = user.balance + coins;
  await db.collection("users").updateOne({ _id: user._id }, { $set: { balance: newBalance } });
  await db.collection("history").insertOne({ userId: user._id, amount: coins, date: new Date(), type: `plan ${planUSD}$` });

  res.json({ message: "Plano comprado com sucesso!", newBalance });
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
