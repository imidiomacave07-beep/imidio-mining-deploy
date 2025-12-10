let mining = false;
let earned = 0;
let timer;

document.getElementById("startBtn").onclick = () => {
    if (mining) return;

    mining = true;
    document.getElementById("status").textContent = "Minerando...";
    document.getElementById("startBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;

    timer = setInterval(() => {
        earned += 1; // Ganha 1 coin por segundo
        document.getElementById("earn").textContent = earned + " Coins";
    }, 1000);
};

document.getElementById("stopBtn").onclick = () => {
    mining = false;
    document.getElementById("status").textContent = "Parado";
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;

    clearInterval(timer);

    // salva no saldo do usuário
    const user = JSON.parse(localStorage.getItem("user"));
    user.balance += earned;
    localStorage.setItem("user", JSON.stringify(user));

    alert("Mineração parada. Você ganhou " + earned + " Coins.");

    earned = 0;
    document.getElementById("earn").textContent = "0 Coins";
};

function voltar() {
    window.location.href = "/dashboard.html";
}
