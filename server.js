// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import miningRoutes from "./routes/miningRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/mining", miningRoutes);

// If somebody opens root, serve dashboard (frontend will check token)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/imidioMiningDB";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro MongoDB:", err.message));

// Start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
