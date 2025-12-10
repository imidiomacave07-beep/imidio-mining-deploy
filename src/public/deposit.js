function copyText(id) {
    const text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text);
    alert("Copiado!");
}

function voltar() {
    window.location.href = "/dashboard.html";
}
