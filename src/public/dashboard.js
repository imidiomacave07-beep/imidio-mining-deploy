// src/public/dashboard.js
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) { window.location.href = "login.html"; return; }

  document.getElementById("welcome").textContent = "Bem-vindo, " + user.name + "!";
  updateBalanceDisplay();

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });

  document.getElementById("btn-mine").addEventListener("click", () => {
    mineCoins(10);
  });

  loadPlans();
});

function updateBalanceDisplay(){
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("balance").textContent = "Saldo: " + (user.balance || 0) + " Coins";
}

function mineCoins(amount){
  const user = JSON.parse(localStorage.getItem("user"));
  user.balance = (user.balance || 0) + amount;
  localStorage.setItem("user", JSON.stringify(user));
  updateBalanceDisplay();
  alert("Você minerou +" + amount + " Coins");
}

async function loadPlans(){
  try {
    const res = await fetch("/api/plans");
    if(!res.ok) return;
    const plans = await res.json();
    const container = document.getElementById("plans");
    container.innerHTML = "";
    plans.forEach(p => {
      const div = document.createElement("div");
      div.className = "plano card";
      div.innerHTML = `<h3>${p.name}</h3>
        <p>Preço: $${p.price}</p>
        <p>Lucro: ${p.profitPercent}%</p>
        <button onclick="buyPlan('${p._id}', ${p.price})">Comprar</button>`;
      container.appendChild(div);
    });
  } catch(e) {
    console.error(e);
  }
}

async function buyPlan(planId, price){
  const user = JSON.parse(localStorage.getItem("user"));
  if(!user) { window.location.href = "login.html"; return; }

  if(!user.id){
    // demo local buy
    if(user.balance < price){ alert("Saldo insuficiente"); return; }
    user.balance -= price;
    localStorage.setItem("user", JSON.stringify(user));
    updateBalanceDisplay();
    alert("Plano comprado no modo demo.");
    return;
  }

  try {
    const res = await fetch("/api/buy-plan", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ userId: user.id, planId })
    });
    const data = await res.json();
    if(res.ok) {
      alert("Plano comprado com sucesso (backend).");
      // refresh balance from server:
      const u = await fetch(`/api/users/${user.id}`);
      const uu = await u.json();
      localStorage.setItem("user", JSON.stringify(uu));
      updateBalanceDisplay();
    } else {
      alert(data.error || "Erro ao comprar plano");
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao comprar plano");
  }
}
