import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import planRoutes from "./routes/plans.js";
import miningRoutes from "./routes/mining.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/mining", miningRoutes);

// Catch-all: envia index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
