document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("welcome").innerText = "Bem-vindo, " + user.name + "!";
    document.getElementById("balance").innerText = "Saldo: " + user.balance + " Coins";

    const plans = [
        { id: 1, name: "Bronze", price: 10, profitPercent: 20 },
        { id: 2, name: "Prata", price: 50, profitPercent: 30 },
        { id: 3, name: "Ouro", price: 100, profitPercent: 50 }
    ];

    const plansDiv = document.getElementById("plans");
    plans.forEach(plan => {
        const div = document.createElement("div");
        div.className = "plan";
        div.innerHTML = `
            <strong>${plan.name}</strong><br>
            Preço: $${plan.price}<br>
            Lucro: ${plan.profitPercent}%<br>
            <button onclick="buyPlan(${plan.id})">Comprar</button>
        `;
        plansDiv.appendChild(div);
    });

    window.buyPlan = function(planId) {
        const plan = plans.find(p => p.id === planId);
        if (user.balance >= plan.price) {
            user.balance -= plan.price;
            localStorage.setItem("user", JSON.stringify(user));
            document.getElementById("balance").innerText = "Saldo: " + user.balance + " Coins";
            alert(`Plano ${plan.name} comprado!`);
        } else {
            alert("Saldo insuficiente!");
        }
    };
});
