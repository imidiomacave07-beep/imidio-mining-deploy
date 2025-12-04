import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Configurar a pasta 'public' para servir arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
