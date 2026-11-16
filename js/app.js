const API = 'http://localhost:3000';
const usuario = () => JSON.parse(sessionStorage.getItem('usuario') || 'null');
const get = p => fetch(API + p).then(r => r.json());
const send = (p, m, b) => fetch(API + p, {method: m, headers: {'Content-Type': 'application/json'}, body: b ? JSON.stringify(b) : undefined}).then(r => r.json());
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function logout() { sessionStorage.removeItem('usuario'); location = 'index.html'; }

function navbar() {
  const u = usuario();
  document.getElementById('nav').innerHTML = `<nav class="navbar navbar-expand-lg border-bottom"><div class="container">
  <a class="navbar-brand fw-bold text-warning fs-4" href="index.html">IRONPUMP</a>
  <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#m"><span class="navbar-toggler-icon"></span></button>
  <div class="collapse navbar-collapse" id="m"><ul class="navbar-nav ms-auto">
  <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
  ${u && u.admin ? '<li class="nav-item"><a class="nav-link" href="admin.html">Cadastro de exercícios</a></li>' : ''}
  ${u ? `<li class="nav-item"><a class="nav-link" href="favoritos.html">Favoritos</a></li>
  <li class="nav-item"><a class="nav-link" href="#" onclick="logout()">Sair (${esc(u.login)})</a></li>`
  : '<li class="nav-item"><a class="nav-link" href="login.html">Entrar</a></li>'}
  </ul></div></div></nav>`;
}

const isFav = id => (usuario()?.favoritos || []).map(String).includes(String(id));
const heart = id => isFav(id) ? '❤️' : '🤍';

async function toggleFav(id) {
  const u = usuario();
  if (!u) { alert('Entre na sua conta para favoritar exercícios.'); location = 'login.html'; return; }
  id = String(id);
  const f = (u.favoritos || []).map(String);
  u.favoritos = f.includes(id) ? f.filter(x => x !== id) : [...f, id];
  await send('/usuarios/' + u.id, 'PATCH', {favoritos: u.favoritos});
  sessionStorage.setItem('usuario', JSON.stringify(u));
  if (window.refresh) refresh();
}

const card = e => `<div class="col-sm-6 col-lg-3"><div class="card h-100 position-relative">
  <img src="${esc(e.imagem)}" class="card-img-top" alt="${esc(e.titulo)}">
  <div class="card-body"><span class="badge text-bg-warning mb-2">${esc(e.grupo)}</span>
  <h5 class="card-title"><a class="stretched-link text-decoration-none text-reset" href="detalhes.html?id=${e.id}">${esc(e.titulo)}</a></h5>
  <p class="card-text small text-secondary">${esc(e.descricao)}</p></div>
  <button class="btn btn-dark position-absolute top-0 end-0 m-2" style="z-index:2" title="Favoritar" onclick="toggleFav('${e.id}')">${heart(e.id)}</button>
  </div></div>`;