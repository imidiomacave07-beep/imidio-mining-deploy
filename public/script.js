let userId = null;
let userName = "";

async function register() {
  document.getElementById("message").innerText = "Processando registro...";
  const nome = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const senha = document.getElementById("regPass").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ nome, email, senha })
  });
  const data = await res.json();
  document.getElementById("message").innerText = data.message || data.error;
}

async function login() {
  document.getElementById("message").innerText = "Processando login...";
  const email = document.getElementById("logEmail").value;
  const senha = document.getElementById("logPass").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, senha })
  });
  const data = await res.json();
  if(data.userId){
    userId = data.userId;
    userName = email.split("@")[0];
    document.getElementById("userName").innerText = userName;
    document.getElementById("auth").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("message").innerText = "";
    loadHistory();
  } else {
    document.getElementById("message").innerText = data.error;
  }
}

async function mine() {
  const res = await fetch(`/mine/${userId}`, { method: "POST" });
  const data = await res.json();
  document.getElementById("balance").innerText = data.newBalance;
  loadHistory();
}

async function loadHistory() {
  const res = await fetch(`/mining-history/${userId}`);
  const logs = await res.json();

  const labels = logs.map(l => new Date(l.date).toLocaleString());
  const data = logs.map(l => l.amount);

  const ctx = document.getElementById('miningChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Coins Minerados', data }] }
  });
}

function logout() {
  userId = null;
  userName = "";
  document.getElementById("auth").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("message").innerText = "";
}
