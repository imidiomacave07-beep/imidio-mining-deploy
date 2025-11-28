// ===================== SISTEMA DE MINERAÇÃO ========================

// Banco de dados simples temporário (salva estados dos usuários)
const miningStatus = {};          // guarda se o user está minerando
const miningBalance = {};         // guarda o saldo do user
const miningSpeed = 0.001;        // valor ganho por segundo (1 USDT a cada 1000s)

// Middleware para autenticação simples via token (exemplo)
function protect(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });
  req.user = token; 
  next();
}


// ---- ROTA: Iniciar mineração ----
app.post("/api/mining/start-mining", protect, (req, res) => {

  if (!miningStatus[req.user]) {
    miningStatus[req.user] = true;
    miningBalance[req.user] = miningBalance[req.user] || 0;
    miningStatus[req.user + "_time"] = Date.now();
  }

  return res.json({ status: "Mineração iniciada" });
});


// ---- ROTA: Parar mineração ----
app.post("/api/mining/stop-mining", protect, (req, res) => {

  if (miningStatus[req.user]) {
    // calcular ganho desde o último tempo
    const startTime = miningStatus[req.user + "_time"];
    const timePassed = (Date.now() - startTime) / 1000; 
    const earned = timePassed * miningSpeed;

    // somar o ganho ao saldo
    miningBalance[req.user] += earned;
    miningStatus[req.user] = false;
  }

  return res.json({ status: "Mineração parada" });
});


// ---- ROTA: Status da mineração ----
app.get("/api/mining/status", protect, (req, res) => {

  // calcular ganhos em tempo real, se estiver minerando
  let currentBalance = miningBalance[req.user] || 0;

  if (miningStatus[req.user]) {
    const startTime = miningStatus[req.user + "_time"];
    const timePassed = (Date.now() - startTime) / 1000;
    const earned = timePassed * miningSpeed;
    currentBalance += earned;
  }

  return res.json({
    status: miningStatus[req.user] ? "A minerar..." : "Parado",
    balance: Number(currentBalance.toFixed(6))
  });
});
