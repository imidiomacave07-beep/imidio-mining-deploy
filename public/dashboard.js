// ======== ELEMENTOS DO DASHBOARD ========
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusText = document.getElementById("statusText");
const logoutBtn = document.getElementById("logoutBtn");
const userName = document.getElementById("userName");

// ======== CHECAR TOKEN DO USUÁRIO ========
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

if (!token) {
  window.location.href = "/login.html";
} else {
  userName.innerText = user.name || "";
}

// ======== FUNÇÃO GENÉRICA DE FETCH COM AUTH ========
async function apiFetch(path, options = {}) {
  options.headers = options.headers || {};
  options.headers["Content-Type"] = "application/json";
  options.headers["Authorization"] = "Bearer " + token;

  const response = await fetch("/api/mining" + path, options);

  // Se token expirou → redireciona
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
    return;
  }

  return response;
}

// ======== ATUALIZA STATUS DA MINERAÇÃO ========
async function refreshStatus() {
  try {
    const res = await apiFetch("/status");
    if (!res) return;

    const data = await res.json();
    statusText.innerText = "Status: " + data.status;

  } catch (err) {
    statusText.innerText = "Erro ao carregar status";
    console.error("Erro:", err);
  }
}

// ======== BOTÃO: INICIAR MINERAÇÃO ========
startBtn.addEventListener("click", async () => {
  await apiFetch("/start-mining", { method: "POST" });
  refreshStatus();
});

// ======== BOTÃO: PARAR MINERAÇÃO ========
stopBtn.addEventListener("click", async () => {
  await apiFetch("/stop-mining", { method: "POST" });
  refreshStatus();
});

// ======== BOTÃO: LOGOUT ========
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
});

// ======== ATUALIZA STATUS A CADA 5 SEGUNDOS ========
refreshStatus();
setInterval(refreshStatus, 5000);
