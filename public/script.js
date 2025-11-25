async function updateStatus() {
  const res = await fetch("/api/mining/status");
  const data = await res.json();
  document.getElementById("status").innerText = data.status;
}

async function startMining() {
  await fetch("/api/mining/start", { method: "POST" });
  updateStatus();
}

async function stopMining() {
  await fetch("/api/mining/stop", { method: "POST" });
  updateStatus();
}

updateStatus();
