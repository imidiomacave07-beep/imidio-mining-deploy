// Listar planos
app.get("/plans", (req, res) => {
  const rawData = fs.readFileSync("./database/db.json", "utf-8");
  const data = JSON.parse(rawData);
  res.json(data.plans);
});

// Listar métodos de pagamento
app.get("/payments", (req, res) => {
  const rawData = fs.readFileSync("./database/db.json", "utf-8");
  const data = JSON.parse(rawData);
  res.json(data.payments);
});

// Registrar usuário
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: "Nome e email obrigatórios" });

  const rawData = fs.readFileSync("./database/db.json", "utf-8");
  const data = JSON.parse(rawData);

  const newUser = {
    id: data.users.length + 1,
    name,
    email,
    plansPurchased: []
  };

  data.users.push(newUser);
  fs.writeFileSync("./database/db.json", JSON.stringify(data, null, 2));

  res.json(newUser);
});

// Comprar plano
app.post("/buy-plan", (req, res) => {
  const { userId, planId } = req.body;
  const rawData = fs.readFileSync("./database/db.json", "utf-8");
  const data = JSON.parse(rawData);

  const user = data.users.find(u => u.id === userId);
  const plan = data.plans.find(p => p.id === planId);

  if (!user || !plan) return res.status(404).json({ error: "Usuário ou plano não encontrado" });

  user.plansPurchased.push({
    planId: plan.id,
    name: plan.name,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + plan.durationDays * 24*60*60*1000).toISOString()
  });

  fs.writeFileSync("./database/db.json", JSON.stringify(data, null, 2));
  res.json({ message: "Plano comprado com sucesso!", user });
});
