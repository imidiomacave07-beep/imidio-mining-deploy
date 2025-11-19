// Função para mostrar/ocultar seções
function showSection(sectionId) {
  const sections = document.querySelectorAll("section");
  sections.forEach(sec => sec.style.display = "none");
  document.getElementById(sectionId).style.display = "block";
}

// Botão de iniciar mineração
document.getElementById("startBtn")?.addEventListener("click", async () => {
  const res = await fetch("/api/start-mining");
  const data = await res.json();
  document.getElementById("status").textContent = data.message;
});
