document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "/login.html"; // volta para login se não houver usuário
        return;
    }

    document.getElementById("user-area").style.display = "block";
    document.getElementById("welcome").textContent = "Bem-vindo, " + user.name + "!";
    document.getElementById("balance").textContent = "Saldo: " + user.balance + " Coins";

    // Exemplo de planos
    const plans = [
        { name: "Bronze", price: 10, profitPercent: 20 },
        { name: "Prata", price: 50, profitPercent: 30 },
        { name: "Ouro", price: 100, profitPercent: 50 }
    ];

    const plansDiv = document.getElementById("plans");
    plans.forEach(plan => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${plan.name}</strong> - $${plan.price} - ${plan.profitPercent}% lucro
            <button onclick="buyPlan('${plan.name}', ${plan.price})">Comprar</button>
        `;
        plansDiv.appendChild(div);
    });
});

function buyPlan(name, price) {
    alert(`Você comprou o plano ${name} por $${price}`);
}
