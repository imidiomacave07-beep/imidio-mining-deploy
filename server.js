// Endpoint para atualizar db.json
app.post("/data", (req, res) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2));
    res.json({ message: "Dados atualizados com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar db.json" });
  }
});
