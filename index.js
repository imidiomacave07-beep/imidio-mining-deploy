// Mineração simulada
document.getElementById("startBtn").addEventListener("click", () => {
  const status = document.getElementById("statusMsg");
  status.innerText = "⛏️ Mineração iniciada...";
  setTimeout(() => {
    status.innerText = "💰 Ganhos atualizados com sucesso!";
  }, 3000);
});

// Pagamento M-Pesa
document.getElementById("payMpesa").addEventListener("click", async () => {
  const phone = prompt("Digite seu número M-Pesa:");
  const amount = prompt("Digite o valor:");
  const res = await fetch("/api/pay-mpesa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, amount }),
  });
  const data = await res.json();
  alert(JSON.stringify(data));
});

// Pagamento Cripto
document.getElementById("payCrypto").addEventListener("click", async () => {
  const to = prompt("Digite o endereço da carteira:");
  const amount = prompt("Digite o valor em ETH:");
  const res = await fetch("/api/pay-crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, amount }),
  });
  const data = await res.json();
  alert(JSON.stringify(data));
});
