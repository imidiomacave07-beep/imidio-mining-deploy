const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "/login.html";
}

// Mostrar saldo
document.getElementById("saldo").innerText = user.saldo.toFixed(2);

// Mostrar status da mineração
document.getElementById("statusMineracao").innerText = user.minerando ? "Ativa" : "Desligada";

// Botão iniciar mineração
document.getElementById("btnIniciar").onclick = async () => {
    const res = await fetch("/api/minerar/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
    });

    const data = await res.json();
    alert(data.msg);

    if (data.success) {
        user.minerando = true;
        localStorage.setItem("user", JSON.stringify(user));
        document.getElementById("statusMineracao").innerText = "Ativa";
    }
};

// Botão parar mineração
document.getElementById("btnParar").onclick = async () => {
    const res = await fetch("/api/minerar/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
    });

    const data = await res.json();
    alert(data.msg);

    if (data.success) {
        user.minerando = false;
        localStorage.setItem("user", JSON.stringify(user));
        document.getElementById("statusMineracao").innerText = "Desligada";
    }
};

// Botão Logout
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("user");
    window.location.href = "/login.html";
};
