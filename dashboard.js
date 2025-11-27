// pegar token salvo
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

// se não tiver autenticado, volta ao login
if (!token) {
  window.location.href = "/login.html";
}

document.getElementById("userName").innerText = user.name || "";

// Função para chamadas à API de mineração
async function api(path, method = "GET") {
  const res = await fetch("/api/mining" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });
  return await res.json();
}

// Atualizar o status da mineração
async function loadStatus() {
  const data = await api("/status");
  document.getElementById("statusText").innerText = "Status: " + data.status;
}

// Botões
document.getElementById("startBtn").onclick = async () => {
  await api("/start", "POST");
  loadStatus();
};

document.getElementById("stopBtn").onclick = async () => {
  await api("/stop", "POST");
  loadStatus();
};

document.getElementById("logoutBtn").onclick = () => {
  localStorage.clear();
  window.location.href = "/login.html";
};

// carregar imediatamente
loadStatus();
setInterval(loadStatus, 5000);
