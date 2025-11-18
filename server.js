app.get("/api/start-mining", (req, res) => {
    res.json({ message: "💰 Ganhos atualizados com sucesso!" });
});

app.get("/api/pay-mpesa", (req, res) => {
    res.json({ message: "✅ Pagamento M-Pesa simulado com sucesso!" });
});

app.get("/api/pay-crypto", (req, res) => {
    res.json({ message: "✅ Pagamento Cripto simulado com sucesso!" });
});
