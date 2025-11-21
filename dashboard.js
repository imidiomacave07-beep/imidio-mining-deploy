async function getStatus() {
  try {
    const res = await fetch("/api/mining/status");
    const data = await res.json();
    document.getElementById("status").innerText = "Status da mineração: " + data.status;
  } catch (err) {
    document.getElementById("status").innerText = "Erro ao carregar status";
  }
}

async function startMining() {
  await fetch("/api/mining/start", { method: "POST" });
  getStatus();
}

async function stopMining() {
  await fetch("/api/mining/stop", { method: "POST" });
  getStatus();
}

document.getElementById("startBtn").addEventListener("click", startMining);
document.getElementById("stopBtn").addEventListener("click", stopMining);

// Atualiza status ao carregar a página
getStatus();
