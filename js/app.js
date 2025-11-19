document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const status = document.getElementById("status");

  if (startBtn) {
    startBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/start-mining");
        const data = await res.json();
        status.textContent = data.message;
      } catch (err) {
        status.textContent = "Erro ao iniciar mineração";
      }
    });
  }
});
