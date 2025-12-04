// Definir valores dos planos
const planValues = {
    basico: 50,
    pro: 500,
    premium: 5000
};

// ID do usuário atualmente logado (pode ser setado pelo login)
let userId = localStorage.getItem("userId"); // ou setar manualmente se necessário

async function buyPlan(planName) {
    if (!userId) {
        alert("Faça login para comprar um plano!");
        return;
    }

    const amount = planValues[planName];

    const res = await fetch(`/buy-plan/${userId}`, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ amount })
    });

    const data = await res.json();

    if (data.success) {
        alert(`Plano ${planName} comprado! Seu novo saldo: ${data.newBalance} Coins`);
    } else {
        alert("Erro ao comprar plano: " + data.error);
    }
}
