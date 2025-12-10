document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "index.html"; // se não fez login, volta para login
        return;
    }

    document.getElementById("user-area").style.display = "block";
    document.getElementById("welcome").textContent = "Bem-vindo, " + user.name + "!";
    document.getElementById("balance").textContent = "Saldo: " + user.balance + " Coins";

    const plans = [
        { name: "Bronze", price: 10, profitPercent: 20 },
        { name: "Prata", price: 50, profitPercent: 30 },
        { name: "Ouro", price: 100, profitPercent: 50 }
    ];

    const plansDiv = document.getElementById("plans");
    plans.forEach(plan => {
        const div = document.createElement("div");
        div.className = "plan";
        div.innerHTML = `
            <strong>${plan.name}</strong> - $${plan.price} - ${plan.profitPercent}% lucro
            <button onclick="buyPlan('${plan.name}', ${plan.price})">Comprar</button>
        `;
        plansDiv.appendChild(div);
    });
});

function buyPlan(name, price){
    const user = JSON.parse(localStorage.getItem("user"));

    if(user.balance < price){
        alert("Saldo insuficiente!");
        return;
    }

    user.balance -= price;
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("balance").textContent = "Saldo: " + user.balance + " Coins";

    alert(`Você comprou o plano ${name} por $${price}\nMétodos de pagamento: PayPal ou Criptomoedas`);
}

// Logout
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
};
