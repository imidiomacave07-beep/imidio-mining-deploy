const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

    if (res.ok) {
      message.textContent = "Usuário registrado com sucesso!";
      message.style.color = "green";
      form.reset();
    } else {
      message.textContent = data.mensagem || "Erro ao registrar usuário!";
      message.style.color = "red";
    }
  } catch (err) {
    message.textContent = "Erro de conexão!";
    message.style.color = "red";
  }
});
