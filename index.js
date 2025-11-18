document.getElementById("startBtn").addEventListener("click", async function() {
    const status = document.getElementById("statusMsg");
    status.innerText = "⛏️ Mineração iniciada...";
    
    // Simulação de requisição ao backend
    const response = await fetch("/api/start-mining");
    const data = await response.json();
    
    status.innerText = data.message; // Ex: "💰 Ganhos atualizados com sucesso!"
});

document.getElementById("mpesaBtn").addEventListener("click", async function() {
    const status = document.getElementById("statusMsg");
    status.innerText = "💳 Processando pagamento M-Pesa...";

    const response = await fetch("/api/pay-mpesa");
    const data = await response.json();

    status.innerText = data.message;
});

document.getElementById("cryptoBtn").addEventListener("click", async function() {
    const status = document.getElementById("statusMsg");
    status.innerText = "💳 Processando pagamento Cripto...";

    const response = await fetch("/api/pay-crypto");
    const data = await response.json();

    status.innerText = data.message;
});
