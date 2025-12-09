document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;

    // Simulação de login
    localStorage.setItem("userName", username);
    localStorage.setItem("userBalance", 120); // depois liga ao backend

    window.location.href = "/dashboard.html";
});
