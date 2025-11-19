document.getElementById("startBtn")?.addEventListener("click", async () => {
  const res = await fetch("/api/start-mining");
  const data = await res.json();
  document.getElementById("status").textContent = data.message;
});
