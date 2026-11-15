const systemFilter = document.querySelector("#system-filter");
const tableSearch = document.querySelector("#table-search");
const emptyState = document.querySelector("#empty-state");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const loginTrigger = document.querySelector("#login-trigger");
const userPill = document.querySelector("#user-pill");
const currentUserName = document.querySelector("#current-user-name");
const currentUserAvatar = document.querySelector("#current-user-avatar");
const authModal = document.querySelector("#auth-modal");
const authCloseButton = document.querySelector("#auth-close");
const authTabs = [...document.querySelectorAll(".auth-tab")];
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const loginMessage = document.querySelector("#login-message");
const signupMessage = document.querySelector("#signup-message");
const authOpenButtons = document.querySelectorAll("[data-auth-open]");
const homeView = document.querySelector("#home-view");
const appPage = document.querySelector("#app-page");
const heroDiceVideo = document.querySelector(".hero-dice");
const heroDiceFallback = document.querySelector(".hero-dice-fallback");

if (heroDiceVideo && heroDiceFallback) {
  const showHeroDiceFallback = () => {
    heroDiceVideo.hidden = true;
    heroDiceFallback.hidden = false;
  };
  const supportsHeroDiceVideo = heroDiceVideo.canPlayType("video/mp4")
    || heroDiceVideo.canPlayType("video/webm; codecs=\"vp9\"");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !supportsHeroDiceVideo) {
    showHeroDiceFallback();
  } else {
    heroDiceVideo.addEventListener("error", showHeroDiceFallback, { once: true });
  }
}

let activeUser = null;
let data = { campaigns: [], characters: [], sessions: [], tables: [] };
let bootstrapError = "";
const systems = {
  dnd: { name: "D&D 5e", resource: "Espaços de magia", extra: "Classe" },
  tormenta: { name: "Tormenta20", resource: "PM", extra: "Raça" },
  ordem: { name: "Ordem Paranormal", resource: "PE", extra: "NEX" }
};

function currentUser() {
  return activeUser;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: "same-origin",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });
  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error?.message || "A solicitação não foi concluída.");
    error.status = response.status;
    error.code = result.error?.code;
    throw error;
  }
  return result;
}

async function refreshBootstrap() {
  const result = await apiRequest("/bootstrap");
  activeUser = result.user;
  data = {
    campaigns: result.campaigns,
    characters: result.characters,
    sessions: result.sessions,
    tables: result.tables
  };
  bootstrapError = "";
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function getSystemName(system) {
  return systems[system]?.name || "Sistema não definido";
}

function getCampaign(id) {
  return data.campaigns.find((campaign) => campaign.id === id);
}

function getCharacter(id) {
  return data.characters.find((character) => character.id === id);
}

function getSession(id) {
  return data.sessions.find((session) => session.id === id);
}

function getTable(id) {
  return data.tables.find((table) => table.id === id);
}

function campaignForSession(session) {
  return getCampaign(session.campaignId);
}

function canAccessCampaign(campaign) {
  const user = currentUser();
  return Boolean(user && campaign && campaign.participants.includes(user.email));
}

function canManageCampaign(campaign) {
  const user = currentUser();
  return Boolean(user && campaign && campaign.owner === user.id);
}

function showPageNotice(message, isError = false) {
  const notice = document.querySelector("#page-feedback");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("is-error", isError);
  notice.hidden = false;
}

function renderAuthState() {
  const user = currentUser();
  if (user) {
    const firstName = user.name.split(" ")[0];
    userPill.classList.remove("hidden");
    loginTrigger.classList.add("hidden");
    currentUserName.textContent = firstName;
    currentUserAvatar.textContent = user.name.charAt(0).toUpperCase();
    return;
  }
  userPill.classList.add("hidden");
  loginTrigger.classList.remove("hidden");
}

function openAuthModal() {
  authModal.classList.remove("hidden");
  authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  authModal.querySelector(".auth-form:not(.hidden) input")?.focus();
}

function closeAuthModal() {
  authModal.classList.add("hidden");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (!loginTrigger.classList.contains("hidden")) loginTrigger.focus();
}

function setAuthView(view) {
  const isLogin = view === "login";
  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authView === view;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  loginForm.classList.toggle("hidden", !isLogin);
  signupForm.classList.toggle("hidden", isLogin);
  loginMessage.textContent = "";
  signupMessage.textContent = "";
  (isLogin ? loginForm : signupForm).querySelector("input").focus();
}

function setAuthMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function handleLogin(event) {
  event.preventDefault();
  const credentials = {
    email: loginForm.elements.email.value.trim(),
    password: loginForm.elements.password.value
  };
  apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) })
    .then(async () => {
      await refreshBootstrap();
      loginForm.reset();
      closeAuthModal();
      renderAuthState();
      renderRoute();
    })
    .catch((error) => setAuthMessage(loginMessage, error.message, true));
}

function handleSignup(event) {
  event.preventDefault();
  const name = signupForm.elements.name.value.trim();
  const email = signupForm.elements.email.value.trim();
  const password = signupForm.elements.password.value;
  if (!name || !email || !password) {
    setAuthMessage(signupMessage, "Preencha nome, email e senha para continuar.", true);
    return;
  }
  if (password.length < 10) {
    setAuthMessage(signupMessage, "A senha precisa ter pelo menos 10 caracteres.", true);
    return;
  }
  apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  }).then(async () => {
    await refreshBootstrap();
    signupForm.reset();
    closeAuthModal();
    renderAuthState();
    renderRoute();
  }).catch((error) => setAuthMessage(signupMessage, error.message, true));
}

function handleLogout() {
  apiRequest("/auth/logout", { method: "POST", body: "{}" })
    .then(async () => {
      activeUser = null;
      renderAuthState();
      location.hash = "inicio";
      await renderRoute();
    })
    .catch((error) => showPageNotice(error.message, true));
}

function filterTables() {
  const tableCards = [...document.querySelectorAll(".table-card")];
  const selectedSystem = systemFilter.value;
  const searchTerm = tableSearch.value.trim().toLocaleLowerCase("pt-BR");
  let visibleCount = 0;
  for (const card of tableCards) {
    const matchesSystem = selectedSystem === "todos" || card.dataset.system === selectedSystem;
    const matchesSearch = card.dataset.search.includes(searchTerm);
    card.hidden = !(matchesSystem && matchesSearch);
    if (!card.hidden) visibleCount += 1;
  }
  emptyState.hidden = visibleCount > 0;
  if (visibleCount === 0) {
    emptyState.textContent = tableCards.length
      ? "Nenhuma mesa encontrada. Tente outro sistema ou termo."
      : "Nenhuma mesa pública com inscrições abertas no momento.";
  }
}

function pageHeader(eyebrow, title, description = "", action = "") {
  return `<div class="page-header">
    <div><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${title}</h1>
    ${description ? `<p class="page-description">${description}</p>` : ""}</div>
    ${action ? `<div class="page-actions">${action}</div>` : ""}
  </div>`;
}

function pageLayout(content) {
  return `<div class="page-shell">${content}<p id="page-feedback" class="page-feedback" role="status" hidden></p>
    <p class="prototype-note page-disclaimer">MVP em desenvolvimento: os dados são salvos no backend local desta instalação.</p></div>`;
}

function routeLink(href, label, style = "button button-outline") {
  return `<a class="${style}" href="${href}">${label}</a>`;
}

function requireLogin() {
  return `<section class="access-card">
    <p class="eyebrow">Acesso necessário</p><h1>Entre para continuar</h1>
    <p>Esta área é destinada a pessoas autenticadas. No protótipo, o acesso é apenas local.</p>
    <button class="button button-primary" type="button" data-open-auth="login">Entrar ou criar conta</button>
  </section>`;
}

function renderDashboard() {
  const user = currentUser();
  const campaigns = data.campaigns.filter((campaign) => campaign.participants.includes(user.email));
  const characters = data.characters.filter((character) => character.owner === user.id);
  const sessions = data.sessions.filter((session) => campaigns.some((campaign) => campaign.id === session.campaignId));
  const activeSessions = sessions.filter((session) => session.status === "active");
  const tables = data.tables.filter((table) => table.owner === user.id);
  const campaignItems = campaigns.map((campaign) => {
    const active = data.sessions.find((session) => session.campaignId === campaign.id && session.status === "active");
    return `<article class="list-card">
      <div><span class="system-label system-${campaign.system}">${escapeHtml(getSystemName(campaign.system))}</span>
      <h3>${escapeHtml(campaign.name)}</h3><p>${escapeHtml(campaign.description || "Sem descrição.")}</p></div>
      <div class="card-actions">${active ? routeLink(`#sessao/${active.id}`, "Sessão ativa") : ""}
      ${routeLink(`#campanha/${campaign.id}`, "Abrir campanha")}</div>
    </article>`;
  }).join("");
  const applicationRows = data.tables.filter((table) => table.myApplication)
    .map((table) => `<li><span>${escapeHtml(table.title)}</span><span class="status-chip">${escapeHtml(applicationStatusLabel(table.myApplication.status))}</span></li>`)
    .join("");

  const tableItems = tables.map((table) => `<article class="list-card compact-card">
    <div><h3>${escapeHtml(table.title)}</h3><p>${escapeHtml(getSystemName(table.system))} · ${escapeHtml(table.status)}</p></div>
    ${routeLink(`#gestao-mesa/${table.id}`, "Gerenciar")}</article>`).join("");
  return pageLayout(`${pageHeader("Seu espaço", `Olá, <span>${escapeHtml(user.name.split(" ")[0])}</span>`,
    "Acompanhe campanhas, personagens, sessões e inscrições.",
    `<button class="button button-outline" type="button" data-action="logout">Sair</button>
     <button class="button button-primary" type="button" data-action="new-campaign">Criar campanha</button>`)}
    <section class="stats-grid" aria-label="Resumo da conta">
      <article class="stat-card"><span>Campanhas</span><strong>${campaigns.length}</strong></article>
      <article class="stat-card"><span>Fichas próprias</span><strong>${characters.length}</strong></article>
      <article class="stat-card"><span>Sessões ativas</span><strong>${activeSessions.length}</strong></article>
      <article class="stat-card"><span>Mesas publicadas</span><strong>${tables.length}</strong></article>
    </section>
    <div class="dashboard-columns">
      <section class="content-panel"><div class="panel-heading"><h2>Minhas campanhas</h2>
        <button class="text-button" type="button" data-action="new-campaign">+ Criar campanha</button></div>
        ${campaignItems || `<p class="empty-panel">Você ainda não participa de campanhas. Crie uma para começar.</p>`}
      </section>
      <section class="content-panel"><div class="panel-heading"><h2>Minhas inscrições</h2>
        ${routeLink("#mesas-publicas", "Encontrar mesa", "text-button")}</div>
          ${applicationRows ? `<ul class="application-list">${applicationRows}</ul>` : `<p class="empty-panel">Você ainda não solicitou vaga em uma mesa.</p>`}
        <div class="panel-heading panel-heading-spaced"><h2>Minhas fichas</h2>
          ${routeLink("#ficha/nova", "Criar ficha", "text-button")}</div>
        <p class="empty-panel">${characters.length ? `${characters.length} ficha(s) disponíveis em suas campanhas.` : "Nenhuma ficha criada ainda."}</p>
      </section>
    </div>
    <section class="content-panel dashboard-tables"><div class="panel-heading"><h2>Mesas que mestro</h2>
      ${routeLink("#gestao-mesa/nova", "Publicar mesa", "text-button")}</div>
      <div class="list-stack">${tableItems || `<p class="empty-panel">Você ainda não publicou uma mesa.</p>`}</div>
    </section>`);
}

function renderCampaignList() {
  const campaigns = data.campaigns.filter((campaign) => canAccessCampaign(campaign));
  const items = campaigns.map((campaign) => `<article class="list-card">
    <div><span class="system-label system-${campaign.system}">${escapeHtml(getSystemName(campaign.system))}</span>
    <h3>${escapeHtml(campaign.name)}</h3><p>${escapeHtml(campaign.description || "Sem descrição.")}</p></div>
    ${routeLink(`#campanha/${campaign.id}`, "Abrir campanha")}
  </article>`).join("");
  return pageLayout(`${pageHeader("Campanhas privadas", "Minhas campanhas", "Conteúdo visível somente aos participantes autorizados.", `<button class="button button-primary" type="button" data-action="new-campaign">Criar campanha</button>`)}
    <section class="list-stack">${items || `<p class="empty-panel">Nenhuma campanha encontrada.</p>`}</section>`);
}

function renderCampaign(id) {
  const campaign = getCampaign(id);
  if (!canAccessCampaign(campaign)) {
    return pageLayout(`<section class="access-card"><p class="eyebrow">Campanha privada</p><h1>Campanha indisponível</h1>
      <p>Ela não existe ou sua conta não está na lista de participantes.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  const characters = data.characters.filter((character) => character.campaignId === campaign.id);
  const sessions = data.sessions.filter((session) => session.campaignId === campaign.id)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  const activeSession = sessions.find((session) => session.status === "active");
  const characterItems = characters.map((character) => `<article class="list-card compact-card">
    <div><h3>${escapeHtml(character.name)}</h3><p>${escapeHtml(getSystemName(character.system))} · ${escapeHtml(character.owner)}</p></div>
    ${routeLink(`#ficha/${character.id}`, "Abrir ficha")}</article>`).join("");
  const sessionItems = sessions.map((session) => `<article class="list-card compact-card">
    <div><h3>${session.status === "active" ? "Sessão em andamento" : "Sessão finalizada"}</h3>
    <p>${formatDate(session.startedAt)}</p></div>
    ${routeLink(session.status === "active" ? `#sessao/${session.id}` : `#historico/${session.id}`,
      session.status === "active" ? "Acessar sessão" : "Ver histórico")}</article>`).join("");
  const action = canManageCampaign(campaign)
    ? activeSession ? routeLink(`#sessao/${activeSession.id}`, "Abrir sessão ativa", "button button-primary")
      : `<button class="button button-primary" type="button" data-action="start-session" data-id="${campaign.id}">Iniciar sessão</button>`
    : "";
  return pageLayout(`${pageHeader(escapeHtml(getSystemName(campaign.system)), escapeHtml(campaign.name),
    escapeHtml(campaign.description || "Sem descrição."), action)}
    <div class="campaign-overview">
      <section class="content-panel"><div class="panel-heading"><h2>Personagens</h2>
        ${routeLink(`#ficha/nova?campanha=${campaign.id}`, "Adicionar ficha", "text-button")}</div>
        <div class="list-stack">${characterItems || `<p class="empty-panel">Ainda não há fichas vinculadas a esta campanha.</p>`}</div>
      </section>
      <section class="content-panel"><div class="panel-heading"><h2>Sessões</h2></div>
        <div class="list-stack">${sessionItems || `<p class="empty-panel">Nenhuma sessão registrada. ${canManageCampaign(campaign) ? "Inicie a primeira sessão." : ""}</p>`}</div>
      </section>
      <section class="content-panel"><div class="panel-heading"><h2>Participantes</h2></div>
        <ul class="member-list">${campaign.members.map((member) => `<li><span class="user-avatar">${escapeHtml(member.name.charAt(0).toUpperCase())}</span>
            <span>${escapeHtml(member.name)}${member.role === "master" ? " · mestre" : ""}</span></li>`).join("")}</ul>
        ${canManageCampaign(campaign) ? `<form class="inline-form" data-form="invite"><label><span>Adicionar participante por email</span>
          <input type="email" name="email" placeholder="jogador@email.com" required></label><button class="button button-outline" type="submit">Adicionar</button></form>
          <p class="form-hint">O convite é apenas local neste protótipo; o usuário precisará acessar esta mesma instalação.</p>` : ""}
      </section>
    </div>`);
}

function renderCharacterForm(id, campaignId) {
  const character = id && id !== "nova" ? getCharacter(id) : null;
  const user = currentUser();
  if (character && character.owner !== user.id) {
    return pageLayout(`<section class="access-card"><h1>Ficha indisponível</h1><p>Você só pode editar fichas próprias.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  const linkedCampaign = campaignId ? getCampaign(campaignId) : null;
  const selectedSystem = character?.system || linkedCampaign?.system || "dnd";
  const fields = character?.fields || {};
  const sys = systems[selectedSystem];
  return pageLayout(`${pageHeader("Ficha de personagem", character ? "Editar ficha" : "Criar ficha", "Os campos do sistema são exemplos de interface; confirme edição e regras antes de usar em jogo.", routeLink("#painel", "Cancelar"))}
    <form class="content-panel form-panel" data-form="character" data-id="${character?.id || ""}">
      <div class="form-grid">
        <label><span>Nome do personagem *</span><input name="name" required value="${escapeHtml(character?.name || "")}"></label>
        <label><span>Sistema *</span><select name="system" required>
          ${Object.entries(systems).map(([key, value]) => `<option value="${key}" ${key === selectedSystem ? "selected" : ""}>${escapeHtml(value.name)}</option>`).join("")}
        </select></label>
        <label><span>Campanha</span><select name="campaignId"><option value="">Sem campanha</option>
          ${data.campaigns.filter((campaign) => canAccessCampaign(campaign)).map((campaign) => `<option value="${campaign.id}" ${campaign.id === (character?.campaignId || campaignId) ? "selected" : ""}>${escapeHtml(campaign.name)}</option>`).join("")}
        </select></label>
        <label><span>${escapeHtml(sys.extra)}</span><input name="extra" value="${escapeHtml(fields[sys.extra] || "")}" placeholder="Ex.: atributo do personagem"></label>
        <label><span>Pontos de vida (exemplo)</span><input name="hp" type="number" min="0" value="${escapeHtml(fields["Pontos de vida"] || "")}" placeholder="0"></label>
        <label><span>${escapeHtml(sys.resource)} (exemplo)</span><input name="resource" value="${escapeHtml(fields[sys.resource] || "")}" placeholder="Campo ilustrativo"></label>
      </div>
      <label class="full-field"><span>Observações da ficha</span><textarea name="notes" rows="4" placeholder="Notas pessoais">${escapeHtml(character?.notes || "")}</textarea></label>
      <div class="form-actions"><button class="button button-primary" type="submit">${character ? "Salvar alterações" : "Criar ficha"}</button></div>
    </form>`);
}

function renderCharacter(id) {
  const character = getCharacter(id);
  if (!character || !currentUser() || (character.owner !== currentUser().id && !canAccessCampaign(getCampaign(character.campaignId)))) {
    return pageLayout(`<section class="access-card"><p class="eyebrow">Ficha privada</p><h1>Ficha indisponível</h1>
      <p>Esta ficha não existe ou você não tem permissão para consultá-la.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  const campaign = getCampaign(character.campaignId);
  const fields = Object.entries(character.fields || {}).map(([name, value]) => `<div class="character-stat"><span>${escapeHtml(name)}</span><strong>${escapeHtml(value || "—")}</strong></div>`).join("");
  return pageLayout(`${pageHeader(escapeHtml(getSystemName(character.system)), escapeHtml(character.name),
    campaign ? `Campanha: ${escapeHtml(campaign.name)}` : "Ficha sem campanha vinculada.",
    character.owner === currentUser().id ? routeLink(`#ficha/${character.id}/editar`, "Editar ficha", "button button-primary") : "")}
    <section class="content-panel"><h2>Campos da ficha</h2><div class="character-stats">${fields}</div>
      ${character.notes ? `<h3>Observações</h3><p>${escapeHtml(character.notes)}</p>` : ""}
    </section>
    ${campaign ? routeLink(`#campanha/${campaign.id}`, "Voltar à campanha") : routeLink("#painel", "Voltar ao painel")}`);
}

function renderActiveSession(id) {
  const session = getSession(id);
  const campaign = session && campaignForSession(session);
  if (!session || !canAccessCampaign(campaign)) {
    return pageLayout(`<section class="access-card"><h1>Sessão indisponível</h1><p>Esta sessão não existe ou pertence a uma campanha privada.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  if (session.status !== "active") return renderHistory(session.id);
  const characters = data.characters.filter((character) => character.campaignId === campaign.id);
  const events = [...session.events].reverse().map((event) => `<li><time>${formatDateTime(event.createdAt)}</time>
    <span><strong>${escapeHtml(event.characterName)}</strong>: ${escapeHtml(event.field)} alterado de
    ${escapeHtml(event.before)} para ${escapeHtml(event.after)} por ${escapeHtml(event.author)}.</span></li>`).join("");
  const isMaster = canManageCampaign(campaign);
  const ownCharacters = characters.filter((character) => character.owner === currentUser().id);
  return pageLayout(`${pageHeader("Sessão em andamento", escapeHtml(campaign.name),
    `Iniciada em ${formatDateTime(session.startedAt)}.`, routeLink(`#campanha/${campaign.id}`, "Voltar à campanha"))}
    <p class="live-banner"><span class="status-dot"></span> Em andamento · alterações salvas nesta tela entram na linha do tempo.</p>
    ${ownCharacters.length ? `<form class="content-panel form-panel" data-form="session-event" data-id="${session.id}">
      <h2>Registrar alteração de ficha</h2><p class="form-hint">Somente valores salvos por este formulário são registrados. Campos ilustrativos.</p>
      <div class="form-grid">
        <label><span>Personagem</span><select name="characterId" required>${ownCharacters.map((character) => `<option value="${character.id}">${escapeHtml(character.name)}</option>`).join("")}</select></label>
        <label><span>Campo alterado</span><input name="field" required placeholder="Ex.: Pontos de vida"></label>
        <label><span>Novo valor</span><input name="after" required></label>
      </div><div class="form-actions"><button class="button button-primary" type="submit">Salvar alteração e registrar</button></div>
    </form>` : `<p class="empty-panel">Você ainda não vinculou uma ficha própria a esta campanha.</p>`}
    <section class="content-panel"><div class="panel-heading"><h2>Linha do tempo</h2><span class="status-chip">Registro automático</span></div>
      ${events ? `<ol class="timeline">${events}</ol>` : `<p class="empty-panel">Ainda não há alterações registradas nesta sessão.</p>`}
    </section>
    ${isMaster ? `<form class="content-panel finish-form" data-form="finish-session" data-id="${session.id}">
      <h2>Finalizar sessão</h2><label><span>Resumo escrito pelo mestre</span>
      <textarea name="summary" rows="5" placeholder="Escreva o resumo da sessão.">${escapeHtml(session.masterSummary || "")}</textarea></label>
      <button class="button button-primary" type="submit">Finalizar e salvar resumo</button></form>` : `<p class="form-hint">Somente o mestre pode finalizar esta sessão.</p>`}`);
}

function automaticSummary(session) {
  if (!session.events.length) return "Não há eventos suficientes para produzir um resumo automático.";
  return `Foram registradas ${session.events.length} alteração(ões) de ficha: ${session.events.map((event) =>
    `${event.characterName} — ${event.field} (${event.before} → ${event.after})`).join("; ")}.`;
}

function renderHistory(id) {
  const session = getSession(id);
  const campaign = session && campaignForSession(session);
  if (!session || !canAccessCampaign(campaign)) {
    return pageLayout(`<section class="access-card"><h1>Histórico indisponível</h1><p>Esta sessão não existe ou você não tem permissão para consultá-la.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  const events = [...session.events].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  return pageLayout(`${pageHeader("Histórico da sessão", escapeHtml(campaign.name),
    `Finalizada em ${formatDateTime(session.endedAt || session.startedAt)}.`, routeLink(`#campanha/${campaign.id}`, "Voltar à campanha"))}
    <div class="summary-grid">
      <section class="content-panel"><p class="eyebrow">Texto escrito pelo mestre</p><h2>Resumo do mestre</h2>
        <p>${escapeHtml(session.masterSummary || "O mestre não registrou um resumo.")}</p></section>
      <section class="content-panel"><p class="eyebrow">Derivado dos eventos</p><h2>Resumo automático</h2>
        <p>${escapeHtml(automaticSummary(session))}</p></section>
    </div>
    <section class="content-panel"><div class="panel-heading"><h2>Linha do tempo</h2><span class="status-chip">Eventos registrados</span></div>
      ${events.length ? `<ol class="timeline">${events.map((event) => `<li><time>${formatDateTime(event.createdAt)}</time>
        <span><strong>${escapeHtml(event.characterName)}</strong> · ${escapeHtml(event.field)}:
        ${escapeHtml(event.before)} → ${escapeHtml(event.after)} <small>por ${escapeHtml(event.author)}</small></span></li>`).join("")}</ol>`
        : `<p class="empty-panel">Nenhum evento foi registrado. O resumo automático não inventa acontecimentos.</p>`}
    </section>`);
}

function publicTables() {
  return data.tables.filter((table) => table.status === "open" && acceptedCount(table) < Number(table.seats));
}

function acceptedCount(table) {
  if (Number.isInteger(table.acceptedCount)) return table.acceptedCount;
  return (table.applications || []).filter((application) => application.status === "accepted").length;
}

function applicationStatusLabel(status) {
  return { pending: "pendente", accepted: "aceita", rejected: "recusada" }[status] || status;
}

function renderPublicTables() {
  const cards = publicTables().map((table) => `<article class="list-card public-table-card" data-system="${table.system}" data-search="${escapeHtml(`${table.title} ${table.description}`.toLocaleLowerCase("pt-BR"))}">
    <div><span class="system-label system-${table.system}">${escapeHtml(getSystemName(table.system))}</span>
      <h2>${escapeHtml(table.title)}</h2><p>${escapeHtml(table.description)}</p>
      <p class="table-detail-meta">${escapeHtml(table.schedule)} · ${Number(table.seats) - acceptedCount(table)} vaga(s)</p>
      <p class="table-detail-meta">Mestre: ${escapeHtml(table.masterName)}</p></div>
    ${routeLink(`#mesa/${table.id}`, "Ver detalhes", "button button-outline")}
  </article>`).join("");
  return pageLayout(`${pageHeader("Encontre seu grupo", "Mesas públicas", "Explore oportunidades públicas. Nenhum dado de campanha ou personagem privada é exibido.",
    currentUser() ? routeLink("#gestao-mesa/nova", "Publicar mesa", "button button-primary") : "")}
    <div class="filters page-filters"><label><span class="sr-only">Filtrar por sistema</span><select id="public-system-filter">
      <option value="todos">Todos os sistemas</option><option value="dnd">D&amp;D 5e</option>
      <option value="tormenta">Tormenta20</option><option value="ordem">Ordem Paranormal</option></select></label>
      <label class="search-field"><span class="sr-only">Buscar mesa</span><span aria-hidden="true">⌕</span>
      <input id="public-search" type="search" placeholder="Buscar por nome"></label></div>
    <div id="public-table-list" class="list-stack">${cards || `<p class="empty-panel">No momento não há mesas abertas para inscrição.</p>`}</div>
    <p class="prototype-note">As mesas públicas são visíveis a visitantes; detalhes privados só aparecem para participantes autorizados.</p>`);
}

function renderLandingTables() {
  const list = document.querySelector("#table-list");
  if (!list) return;
  const tables = publicTables();
  list.innerHTML = tables.map((table) => {
    const systemClass = { dnd: "system-dnd", tormenta: "system-tormenta", ordem: "system-ordem" }[table.system];
    const systemLabel = table.system === "dnd" ? "D&D 5e" : getSystemName(table.system);
    const searchText = `${table.title} ${table.description} ${systemLabel}`.toLocaleLowerCase("pt-BR");
    return `<article class="table-card" data-system="${table.system}" data-search="${escapeHtml(searchText)}">
      <div class="card-topline"><span class="system-label ${systemClass}">${escapeHtml(systemLabel)}</span>
        <span class="open-label"><span class="status-dot"></span> Inscrições abertas</span></div>
      <h3>${escapeHtml(table.title)}</h3><p class="card-description">${escapeHtml(table.description)}</p>
      <div class="table-meta"><span><span aria-hidden="true">◷</span> ${escapeHtml(table.schedule)}</span>
        <span><span aria-hidden="true">♙</span> ${table.availableSeats} vagas</span></div>
      <div class="card-footer"><div class="gm"><span class="avatar avatar-green">${escapeHtml(table.masterName.charAt(0).toUpperCase())}</span>
        <span><small>Mestre</small>${escapeHtml(table.masterName)}</span></div>
        <a class="card-link" href="#mesa/${table.id}" aria-label="Ver mesa ${escapeHtml(table.title)}">↗</a></div>
    </article>`;
  }).join("");
  emptyState.hidden = tables.length > 0;
  if (systemFilter) systemFilter.value = "todos";
  if (tableSearch) tableSearch.value = "";
  filterTables();
}

function renderTableDetail(id) {
  const table = getTable(id);
  if (!table || table.status === "cancelled") {
    return pageLayout(`<section class="access-card"><h1>Mesa não encontrada</h1><p>Esta mesa não está disponível.</p>${routeLink("#mesas-publicas", "Explorar mesas")}</section>`);
  }
  const user = currentUser();
  const ownTable = Boolean(user && table.owner === user.id);
  const myApplication = table.myApplication;
  const full = acceptedCount(table) >= Number(table.seats);
  const canApply = user && !ownTable && table.status === "open" && !full && !myApplication;
  const messages = (table.messages || [])
    .map((message) => `<li><strong>${escapeHtml(message.fromName)}</strong><time>${formatDateTime(message.createdAt)}</time>
      <p>${escapeHtml(message.text)}</p></li>`).join("");
  return pageLayout(`${pageHeader("Detalhes da mesa", escapeHtml(table.title),
    `${escapeHtml(getSystemName(table.system))} · Mestre: ${escapeHtml(table.masterName)}`,
    ownTable ? routeLink(`#gestao-mesa/${table.id}`, "Gerenciar mesa", "button button-primary") : routeLink("#mesas-publicas", "Voltar às mesas"))}
    <div class="detail-grid"><section class="content-panel"><h2>Sobre a aventura</h2><p>${escapeHtml(table.description)}</p>
      <dl class="detail-list"><div><dt>Horário</dt><dd>${escapeHtml(table.schedule)}</dd></div>
      <div><dt>Data</dt><dd>${formatDate(table.startsAt)} (${escapeHtml(table.timezone || "Fuso não informado")})</dd></div>
      <div><dt>Vagas disponíveis</dt><dd>${Math.max(0, Number(table.seats) - acceptedCount(table))} de ${Number(table.seats)}</dd></div>
      <div><dt>Requisitos</dt><dd>${escapeHtml(table.requirements || "Nenhum requisito informado.")}</dd></div>
      <div><dt>Estado</dt><dd>${escapeHtml(table.status === "open" && !full ? "Inscrições abertas" : table.status === "cancelled" ? "Cancelada" : "Encerrada")}</dd></div></dl>
      ${user && ownTable ? `<p class="form-hint">Você é o mestre desta mesa e não pode solicitar vaga.</p>`
        : myApplication ? `<p class="status-chip">Sua inscrição: ${escapeHtml(applicationStatusLabel(myApplication.status))}</p>`
          : canApply ? `<form class="form-panel" data-form="application" data-id="${table.id}">
            <label><span>Mensagem para o mestre (opcional)</span><textarea name="message" rows="3" placeholder="Conte um pouco sobre você"></textarea></label>
            <button class="button button-primary" type="submit">Solicitar vaga</button></form>`
            : !user ? `<button class="button button-primary" type="button" data-open-auth="signup">Entre para solicitar uma vaga</button>`
              : `<p class="status-chip">${full ? "Mesa sem vagas disponíveis" : "Inscrições encerradas"}</p>`}
    </section><section class="content-panel"><h2>Contato com o mestre</h2>
      <p class="form-hint">As mensagens são privadas entre você e o mestre; emails não são exibidos publicamente.</p>
      ${!user ? `<button class="button button-outline" type="button" data-open-auth="login">Entre para enviar mensagem</button>`
          : ownTable ? `<p class="empty-panel">As conversas de interessados aparecem na gestão da mesa.</p>`
            : !myApplication ? `<p class="empty-panel">Solicite uma vaga para iniciar uma conversa privada com o mestre.</p>`
              : `<form class="inline-message-form" data-form="message" data-id="${table.id}">
              <label><span>Mensagem privada</span><textarea name="text" rows="3" required placeholder="Escreva para o mestre"></textarea></label>
              <button class="button button-outline" type="submit">Enviar mensagem</button></form>
              ${messages ? `<ul class="message-list">${messages}</ul>` : `<p class="empty-panel">Nenhuma mensagem nesta conversa.</p>`}`}
    </section></div>`);
}

function renderTableManagement(id) {
  const table = id && id !== "nova" ? getTable(id) : null;
  if (table && table.owner !== currentUser().id) {
    return pageLayout(`<section class="access-card"><h1>Acesso restrito</h1><p>Somente o mestre pode gerenciar esta mesa.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  if (!table) {
    return pageLayout(`${pageHeader("Mesas públicas", "Publicar uma mesa", "Campos obrigatórios para publicar uma oportunidade.")}
      <form class="content-panel form-panel" data-form="table">
        <div class="form-grid"><label><span>Título *</span><input name="title" required></label>
        <label><span>Sistema *</span><select name="system" required><option value="">Selecione</option>
          ${Object.entries(systems).map(([key, system]) => `<option value="${key}">${escapeHtml(system.name)}</option>`).join("")}</select></label>
        <label><span>Data e horário *</span><input type="datetime-local" name="startsAt" required></label>
        <label><span>Fuso horário *</span><input name="timezone" value="America/Sao_Paulo" required></label>
        <label><span>Número de vagas *</span><input type="number" name="seats" min="1" max="30" required></label>
        <label><span>Horário/recorrência</span><input name="schedule" placeholder="Ex.: sábados às 19h" required></label></div>
        <label class="full-field"><span>Descrição *</span><textarea name="description" rows="4" required></textarea></label>
        <label class="full-field"><span>Requisitos opcionais</span><textarea name="requirements" rows="3"></textarea></label>
        <div class="form-actions"><button class="button button-primary" type="submit">Publicar mesa</button></div>
      </form>`);
  }

  const accepted = acceptedCount(table);
  const applications = (table.applications || []).map((application) => `<article class="application-card">
    <div><h3>${escapeHtml(application.userName)}</h3><p>${escapeHtml(application.message || "Sem mensagem de apresentação.")}</p>
      <span class="status-chip">${escapeHtml(applicationStatusLabel(application.status))}</span></div>
      ${application.status === "pending" ? `<div class="card-actions"><button class="button button-primary" type="button" data-action="application-status" data-table="${table.id}" data-application="${application.id}" data-status="aceita" ${accepted >= Number(table.seats) ? "disabled" : ""}>Aceitar</button>
      <button class="button button-outline" type="button" data-action="application-status" data-table="${table.id}" data-application="${application.id}" data-status="recusada">Recusar</button></div>` : ""}
    </article>`).join("");
  return pageLayout(`${pageHeader("Gestão do mestre", escapeHtml(table.title),
    `${escapeHtml(getSystemName(table.system))} · ${accepted}/${Number(table.seats)} vagas aceitas`,
    routeLink(`#mesa/${table.id}`, "Ver página pública"))}
    <section class="content-panel"><div class="panel-heading"><h2>Inscrições recebidas</h2>
      <span class="status-chip">${(table.applications || []).filter((entry) => entry.status === "pending").length} pendente(s)</span></div>
      <div class="list-stack">${applications || `<p class="empty-panel">Nenhuma inscrição recebida ainda.</p>`}</div></section>
    <section class="content-panel"><div class="panel-heading"><h2>Mensagens</h2></div>
      ${table.messages.length ? [...new Set(table.messages.map((message) => message.applicantId))].map((applicantId) => {
        const thread = table.messages.filter((message) => message.applicantId === applicantId);
        const applicantName = thread.find((message) => message.from !== currentUser().id)?.fromName || "Jogador";
        return `<div class="message-thread"><h3>Conversa com ${escapeHtml(applicantName)}</h3>
          <ul class="message-list">${thread.map((message) => `<li><strong>${escapeHtml(message.fromName)}</strong>
            <time>${formatDateTime(message.createdAt)}</time><p>${escapeHtml(message.text)}</p></li>`).join("")}</ul>
          <form class="inline-message-form" data-form="message" data-id="${table.id}" data-applicant-id="${applicantId}">
            <label><span>Responder em privado</span><textarea name="text" rows="2" required></textarea></label>
            <button class="button button-outline" type="submit">Enviar resposta</button></form></div>`;
      }).join("") : `<p class="empty-panel">Nenhuma mensagem recebida.</p>`}</section>
    <section class="content-panel table-controls"><h2>Estado da publicação</h2><p>${escapeHtml(table.status === "open" ? "Inscrições abertas." : "Inscrições encerradas.")}</p>
      ${table.status === "open" ? `<button class="button button-outline" type="button" data-action="close-table" data-id="${table.id}">Encerrar inscrições</button>` : ""}</section>`);
}

function formatDate(value) {
  if (!value) return "Data não informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

function formatDateTime(value) {
  if (!value) return "Horário não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Horário não informado";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function routeFromHash() {
  const rawRoute = location.hash.replace(/^#/, "");
  const [route, query = ""] = rawRoute.split("?");
  const [page, id, action] = route.split("/");
  return { page: page || "inicio", id: id || "", action: action || "", query: new URLSearchParams(query) };
}

async function renderRoute() {
  const route = routeFromHash();
  const requestedHash = location.hash;
  try {
    await refreshBootstrap();
  } catch (error) {
    bootstrapError = error.message;
  }
  if (requestedHash !== location.hash) return;
  renderAuthState();
  if (bootstrapError) {
    homeView.classList.add("hidden");
    appPage.classList.remove("hidden");
    appPage.innerHTML = pageLayout(`<section class="access-card" role="alert">
      <p class="eyebrow">Falha de conexão</p><h1>Não foi possível carregar as informações</h1>
      <p>${escapeHtml(bootstrapError)}</p><p>Confira se o servidor está em execução e tente novamente.</p>
      <button class="button button-outline" type="button" data-action="retry">Tentar novamente</button>
    </section>`);
    return;
  }
  const homeRoutes = ["", "inicio", "mesas", "campanhas", "como-funciona"];
  const isHome = homeRoutes.includes(route.page);
  homeView.classList.toggle("hidden", !isHome);
  appPage.classList.toggle("hidden", isHome);
  siteNav.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("is-current", link.getAttribute("href") === `#${route.page}`);
  });
  if (isHome) {
    appPage.innerHTML = "";
    renderLandingTables();
    if (route.page === "mesas" || route.page === "campanhas" || route.page === "como-funciona") {
      document.getElementById(route.page).scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    return;
  }
  if (!currentUser() && ["painel", "campanha", "campanhas", "minhas-campanhas", "ficha", "sessao", "historico", "gestao-mesa"].includes(route.page)) {
    appPage.innerHTML = pageLayout(requireLogin());
    window.scrollTo(0, 0);
    return;
  }

  switch (route.page) {
    case "painel":
      appPage.innerHTML = renderDashboard();
      break;
    case "campanhas":
      appPage.innerHTML = renderCampaignList();
      break;
    case "minhas-campanhas":
      appPage.innerHTML = renderCampaignList();
      break;
    case "campanha":
      appPage.innerHTML = renderCampaign(route.id);
      break;
    case "ficha":
      if (route.action === "editar") appPage.innerHTML = renderCharacterForm(route.id);
      else if (route.id === "nova") appPage.innerHTML = renderCharacterForm("nova", route.query.get("campanha"));
      else appPage.innerHTML = renderCharacter(route.id);
      break;
    case "sessao":
      appPage.innerHTML = renderActiveSession(route.id);
      break;
    case "historico":
      appPage.innerHTML = renderHistory(route.id);
      break;
    case "mesas-publicas":
      appPage.innerHTML = renderPublicTables();
      break;
    case "mesa":
      appPage.innerHTML = renderTableDetail(route.id);
      break;
    case "gestao-mesa":
      appPage.innerHTML = renderTableManagement(route.id);
      break;
    default:
      appPage.innerHTML = pageLayout(`<section class="access-card"><h1>Página não encontrada</h1>${routeLink("#inicio", "Ir para o início")}</section>`);
  }
  window.scrollTo(0, 0);
}

function filterPublicTableCards() {
  const system = document.querySelector("#public-system-filter");
  const search = document.querySelector("#public-search");
  const list = document.querySelector("#public-table-list");
  if (!system || !search || !list) return;
  const term = search.value.trim().toLocaleLowerCase("pt-BR");
  let count = 0;
  list.querySelectorAll(".public-table-card").forEach((card) => {
    const show = (system.value === "todos" || card.dataset.system === system.value) && card.dataset.search.includes(term);
    card.hidden = !show;
    if (show) count += 1;
  });
  let emptyMessage = list.querySelector(".empty-panel");
  if (count === 0 && !emptyMessage) {
    emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-panel";
    emptyMessage.textContent = "Nenhuma mesa corresponde a esses filtros.";
    list.append(emptyMessage);
  } else if (count > 0 && emptyMessage) {
    emptyMessage.remove();
  }
}

async function handlePageSubmit(event) {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  const formType = form.dataset.form;
  const values = new FormData(form);
  try {
    if (formType === "campaign") {
      const result = await apiRequest("/campaigns", {
        method: "POST",
        body: JSON.stringify({
          name: values.get("name").trim(),
          system: values.get("system"),
          description: values.get("description").trim()
        })
      });
      location.hash = `campanha/${result.campaign.id}`;
      return;
    }

    if (formType === "character") {
      const system = values.get("system");
      const fields = {
        [systems[system].extra]: values.get("extra").trim(),
        "Pontos de vida": values.get("hp"),
        [systems[system].resource]: values.get("resource").trim()
      };
      const payload = {
        name: values.get("name").trim(),
        system,
        campaignId: values.get("campaignId") || null,
        fields,
        notes: values.get("notes").trim()
      };
      const characterId = form.dataset.id;
      const result = await apiRequest(characterId ? `/characters/${characterId}` : "/characters", {
        method: characterId ? "PATCH" : "POST",
        body: JSON.stringify(payload)
      });
      location.hash = payload.campaignId ? `campanha/${payload.campaignId}` : `ficha/${result.character.id}`;
      return;
    }

    if (formType === "invite") {
      await apiRequest(`/campaigns/${routeFromHash().id}/members`, {
        method: "POST",
        body: JSON.stringify({ email: values.get("email").trim() })
      });
      await renderRoute();
      return;
    }

    if (formType === "session-event") {
      await apiRequest(`/sessions/${form.dataset.id}/events`, {
        method: "POST",
        body: JSON.stringify({
          characterId: values.get("characterId"),
          field: values.get("field").trim(),
          after: values.get("after").trim()
        })
      });
      await renderRoute();
      return;
    }

    if (formType === "finish-session") {
      await apiRequest(`/sessions/${form.dataset.id}/finish`, {
        method: "POST",
        body: JSON.stringify({ summary: values.get("summary").trim() })
      });
      location.hash = `historico/${form.dataset.id}`;
      return;
    }

    if (formType === "table") {
      const startsAt = new Date(values.get("startsAt"));
      if (Number.isNaN(startsAt.getTime())) throw new Error("Informe uma data e horário válidos.");
      const result = await apiRequest("/tables", {
        method: "POST",
        body: JSON.stringify({
          title: values.get("title").trim(),
          system: values.get("system"),
          description: values.get("description").trim(),
          schedule: values.get("schedule").trim(),
          startsAt: startsAt.toISOString(),
          timezone: values.get("timezone").trim(),
          seats: Number(values.get("seats")),
          requirements: values.get("requirements").trim()
        })
      });
      location.hash = `gestao-mesa/${result.table.id}`;
      return;
    }

    if (formType === "application") {
      await apiRequest(`/tables/${form.dataset.id}/applications`, {
        method: "POST",
        body: JSON.stringify({ message: values.get("message").trim() })
      });
      await renderRoute();
      return;
    }

    if (formType === "message") {
      await apiRequest(`/tables/${form.dataset.id}/messages`, {
        method: "POST",
        body: JSON.stringify({
          text: values.get("text").trim(),
          applicantId: form.dataset.applicantId || undefined
        })
      });
      await renderRoute();
    }
  } catch (error) {
    showPageNotice(error.message, true);
  }
}

async function handlePageClick(event) {
  const authButton = event.target.closest("[data-open-auth]");
  if (authButton) {
    setAuthView(authButton.dataset.openAuth === "signup" ? "signup" : "login");
    openAuthModal();
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "retry") {
    await renderRoute();
    return;
  }

  if (action === "logout") {
    handleLogout();
    return;
  }

  if (action === "new-campaign") {
    appPage.innerHTML = pageLayout(`${pageHeader("Campanhas privadas", "Criar campanha", "Campanhas ficam privadas e só participantes podem acessá-las.")}
      <form class="content-panel form-panel" data-form="campaign">
        <label><span>Nome da campanha *</span><input name="name" required maxlength="80"></label>
        <label><span>Sistema *</span><select name="system" required><option value="">Selecione</option>
          ${Object.entries(systems).map(([key, system]) => `<option value="${key}">${escapeHtml(system.name)}</option>`).join("")}</select></label>
        <label><span>Descrição</span><textarea name="description" rows="4" maxlength="500"></textarea></label>
        <p class="form-hint">Adicione o email de uma conta já cadastrada no sistema.</p>
        <div class="form-actions"><button class="button button-primary" type="submit">Criar campanha privada</button></div>
      </form>`);
  }

  if (action === "start-session") {
    const campaign = getCampaign(actionButton.dataset.id);
    if (!canManageCampaign(campaign)) return showPageNotice("Somente o mestre pode iniciar uma sessão.", true);
    try {
      const result = await apiRequest(`/campaigns/${campaign.id}/sessions`, { method: "POST", body: "{}" });
      location.hash = `sessao/${result.session.id}`;
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "application-status") {
    const table = getTable(actionButton.dataset.table);
    if (!table || table.owner !== currentUser().id) return showPageNotice("Somente o mestre pode decidir inscrições.", true);
    try {
      await apiRequest(`/applications/${actionButton.dataset.application}`, {
        method: "PATCH",
        body: JSON.stringify({ status: actionButton.dataset.status })
      });
      await renderRoute();
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "close-table") {
    const table = getTable(actionButton.dataset.id);
    if (!table || table.owner !== currentUser().id) return showPageNotice("Somente o mestre pode encerrar inscrições.", true);
    try {
      await apiRequest(`/tables/${table.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "closed" })
      });
      await renderRoute();
    } catch (error) {
      showPageNotice(error.message, true);
    }
  }
}

systemFilter.addEventListener("change", filterTables);
tableSearch.addEventListener("input", filterTables);
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  siteNav.classList.toggle("is-open", !expanded);
});
siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  }
});
loginTrigger.addEventListener("click", openAuthModal);
authOpenButtons.forEach((button) => button.addEventListener("click", openAuthModal));
authCloseButton.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});
authTabs.forEach((tab) => tab.addEventListener("click", () => setAuthView(tab.dataset.authView)));
loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);
appPage.addEventListener("submit", handlePageSubmit);
appPage.addEventListener("click", handlePageClick);
appPage.addEventListener("input", (event) => {
  if (event.target.matches("#public-search")) filterPublicTableCards();
});
appPage.addEventListener("change", (event) => {
  if (event.target.matches("#public-system-filter")) filterPublicTableCards();
});
window.addEventListener("hashchange", renderRoute);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authModal.classList.contains("hidden")) closeAuthModal();
});
renderAuthState();
renderRoute();
