document.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("userName");
    const balance = localStorage.getItem("userBalance");

    if(!name){
        window.location.href = "/login.html"; // se não tiver login, volta
        return;
    }

    document.getElementById("userName").innerText = name;
    document.getElementById("userBalance").innerText = balance + " Coins";
});
