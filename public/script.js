// Frontend logic used by all pages. Uses localStorage to store session (userId, nome)
const API_BASE = "/api";

function sessionSave(obj){
  localStorage.setItem("imidio_session", JSON.stringify(obj));
}
function sessionLoad(){
  const s = localStorage.getItem("imidio_session");
  return s ? JSON.parse(s) : null;
}
function sessionClear(){ localStorage.removeItem("imidio_session"); }

// --------- Utilities ----------
async function api(path, opts){
  const res = await fetch(path, opts);
  return res.json();
}

// ---------- Index (login/register) ----------
document.addEventListener("DOMContentLoaded", ()=> {
  // index page handlers
  const btnReg = document.getElementById("btnRegister");
  if(btnReg){
    btnReg.onclick = async ()=>{
      const nome = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const senha = document.getElementById("regPass").value;
      const msg = document.getElementById("authMsg");
      msg.innerText = "Processando...";
      const r = await api(API_BASE + "/register", { method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({ nome, email, senha })});
      if(r.error) msg.innerText = r.error; else { msg.innerText = "Conta criada! Faça login."; }
    };
  }

  const btnLogin = document.getElementById("btnLogin");
  if(btnLogin){
    btnLogin.onclick = async ()=>{
      const email = document.getElementById("loginEmail").value.trim();
      const senha = document.getElementById("loginPass").value;
      const msg = document.getElementById("authMsg");
      msg.innerText = "Autenticando...";
      const r = await api(API_BASE + "/login", { method: "POST", headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, senha })});
      if(r.error) { msg.innerText = r.error; return; }
      sessionSave({ userId: r.userId, nome: r.nome });
      location.href = "/dashboard.html";
    };
  }

  // If on dashboard page, init dashboard
  if(location.pathname.endsWith("dashboard.html")) initDashboard();
  if(location.pathname.endsWith("history.html")) initHistory();
  if(location.pathname.endsWith("plans.html")) initPlans();
  if(location.pathname.endsWith("profile.html")) initProfile();
});

// ---------- Dashboard ----------
async function initDashboard(){
  const s = sessionLoad();
  if(!s){ location.href = "/"; return; }
  document.getElementById("cardName").innerText = s.nome;
  // load user data by re-logging (quick)
  const loginRes = await api(API_BASE + "/login", { method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: s.nome + "@example.com", senha: "skip" })}).catch(()=>({}));
  // instead, fetch user data by getting history and sum
  await refreshDashboard();
  document.getElementById("btnMine").onclick = async ()=>{
    const r = await api(API_BASE + "/mine/" + s.userId, { method: "POST" });
    if(r.error) return alert(r.error);
    await refreshDashboard();
    alert(`Minerado: ${r.mined} Coins (Plano: ${r.plan}). Novo saldo: ${r.newBalance}`);
  };
  // render chart if exists
  await loadChart();
}

async function refreshDashboard(){
  const s = sessionLoad();
  if(!s) return;
  const hist = await api(API_BASE + "/history/" + s.userId);
  const total = hist.reduce((a,b)=>a + (b.amount||0), 0);
  document.getElementById("cardBalance").innerText = total;
  document.getElementById("cardPlan").innerText = "Plano: " + (hist[0]?.plan || "Básico");
}

async function loadChart(){
  const s = sessionLoad();
  if(!s) return;
  const hist = await api(API_BASE + "/history/" + s.userId);
  const labels = hist.slice(0,10).map(h=> new Date(h.date).toLocaleString()).reverse();
  const data = hist.slice(0,10).map(h=> h.amount).reverse();
  const ctx = document.getElementById("miniChart");
  if(!ctx) return;
  new Chart(ctx, { type:'bar', data:{ labels, datasets:[{ label:'Coins Minerados', data, backgroundColor:'#00e676' }] }, options:{ responsive:true }});
}

// ---------- History ----------
async function initHistory(){
  const s = sessionLoad();
  if(!s){ location.href = "/"; return; }
  const logs = await api(API_BASE + "/history/" + s.userId);
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";
  logs.forEach(l=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${new Date(l.date).toLocaleString()}</td><td>${l.amount}</td><td>${l.plan||'Básico'}</td>`;
    tbody.appendChild(tr);
  });
}

// ---------- Plans ----------
async function initPlans(){
  const s = sessionLoad();
  if(!s){ location.href = "/"; return; }
  document.querySelectorAll(".plan-btn").forEach(btn=>{
    btn.onclick = async (e)=>{
      const plan = e.target.dataset.plan;
      const r = await api(API_BASE + "/plan/" + s.userId, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan })});
      if(r.error) return alert(r.error);
      alert("Plano atualizado para " + r.plan);
    };
  });
}

// ---------- Profile ----------
async function initProfile(){
  const s = sessionLoad();
  if(!s){ location.href = "/"; return; }
  // Fill profile info
  const logs = await api(API_BASE + "/history/" + s.userId);
  const total = logs.reduce((a,b)=>a + (b.amount||0), 0);
  document.getElementById("profileName").innerText = s.nome;
  document.getElementById("profileEmail").innerText = s.nome + "@example.com";
  document.getElementById("profilePlan").innerText = logs[0]?.plan || "Básico";
  document.getElementById("profileBalance").innerText = total;
}
