const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { after, before, test } = require("node:test");

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "mesa-rpg-test-"));
process.env.DATABASE_PATH = path.join(temporaryDirectory, "test.sqlite");
process.env.NODE_ENV = "test";

const app = require("../server/app");
const database = require("../server/db");
let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  database.close();
  fs.rmSync(temporaryDirectory, { recursive: true, force: true });
});

test("serve os vídeos D20 da página inicial", async () => {
  const logoResponse = await fetch(`${baseUrl}/assets/logo-mesa-rpg.png`);
  assert.equal(logoResponse.status, 200);
  assert.match(logoResponse.headers.get("content-type") ?? "", /^image\/png\b/);
  assert.ok((await logoResponse.arrayBuffer()).byteLength > 0);

  const mp4Response = await fetch(`${baseUrl}/assets/d20_loop_transparente.mp4`);
  assert.equal(mp4Response.status, 200);
  assert.match(mp4Response.headers.get("content-type") ?? "", /^video\/mp4\b/);
  assert.ok((await mp4Response.arrayBuffer()).byteLength > 0);

  const webmResponse = await fetch(`${baseUrl}/assets/d20_loop_transparente.webm`);
  assert.equal(webmResponse.status, 200);
  assert.match(webmResponse.headers.get("content-type") ?? "", /^video\/webm\b/);
  assert.ok((await webmResponse.arrayBuffer()).byteLength > 0);
});

test("serve a biblioteca cliente Supabase para o frontend", async () => {
  const response = await fetch(`${baseUrl}/vendor/supabase.js`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/javascript\b/);
  assert.match(await response.text(), /createClient/);
});

test("pagina de login oferece recuperação e redefinição de senha", async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /id="forgot-password-trigger"/);
  assert.match(html, /id="recovery-form"/);
  assert.match(html, /id="reset-password-form"/);
});

async function api(pathname, { cookie, method = "GET", body } = {}) {
  const response = await fetch(`${baseUrl}/api${pathname}`, {
    method,
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body ? { "Content-Type": "application/json" } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const payload = response.status === 204 ? null : await response.json();
  const setCookie = response.headers.getSetCookie?.()[0]?.split(";")[0];
  return { response, payload, cookie: setCookie || cookie };
}

async function register(name, email) {
  const result = await api("/auth/register", {
    method: "POST",
    body: { name, email, password: "uma-senha-segura-123" }
  });
  assert.equal(result.response.status, 201);
  assert.ok(result.cookie);
  return result.cookie;
}

test("limita cada conta a 15 fichas e libera espaço após exclusão", async () => {
  const cookie = await register("Jogador do limite", "limite@example.com");
  const characterIds = [];
  for (let index = 1; index <= 15; index += 1) {
    const result = await api("/characters", {
      cookie,
      method: "POST",
      body: { name: `Ficha ${index}`, system: "dnd", fields: {}, notes: "" }
    });
    assert.equal(result.response.status, 201);
    characterIds.push(result.payload.character.id);
  }

  const overLimit = await api("/characters", {
    cookie,
    method: "POST",
    body: { name: "Ficha extra", system: "dnd", fields: {}, notes: "" }
  });
  assert.equal(overLimit.response.status, 409);
  assert.equal(overLimit.payload.error.code, "character_limit_reached");

  const otherCookie = await register("Outra conta", "outra-conta@example.com");
  const forbiddenDelete = await api(`/characters/${characterIds[0]}`, {
    cookie: otherCookie,
    method: "DELETE"
  });
  assert.equal(forbiddenDelete.response.status, 404);

  const deleted = await api(`/characters/${characterIds[0]}`, { cookie, method: "DELETE" });
  assert.equal(deleted.response.status, 204);
  const replacement = await api("/characters", {
    cookie,
    method: "POST",
    body: { name: "Ficha substituta", system: "dnd", fields: {}, notes: "" }
  });
  assert.equal(replacement.response.status, 201);
});

test("API protege campanhas, grava eventos atomicamente e controla vagas", async () => {
  const anonymousBootstrap = await api("/bootstrap");
  assert.equal(anonymousBootstrap.response.status, 200);
  assert.equal(anonymousBootstrap.payload.user, null);
  assert.deepEqual(anonymousBootstrap.payload.campaigns, []);

  const masterCookie = await register("Mestre", "mestre@example.com");
  const playerCookie = await register("Jogadora", "jogadora@example.com");
  const outsiderCookie = await register("Visitante", "visitante@example.com");

  const campaignResult = await api("/campaigns", {
    cookie: masterCookie,
    method: "POST",
    body: { name: "A campanha", system: "ordem", description: "" }
  });
  assert.equal(campaignResult.response.status, 201);
  const campaignId = campaignResult.payload.campaign.id;

  const privateData = await api("/bootstrap", { cookie: outsiderCookie });
  assert.equal(privateData.payload.campaigns.length, 0);

  const inviteResult = await api(`/campaigns/${campaignId}/members`, {
    cookie: masterCookie,
    method: "POST",
    body: { email: "jogadora@example.com" }
  });
  assert.equal(inviteResult.response.status, 201);

  const characterResult = await api("/characters", {
    cookie: playerCookie,
    method: "POST",
    body: {
      name: "Aventureira",
      system: "ordem",
      fields: {
        "PV atual": "12",
        "PV máximo": "20",
        "PE atual": "3",
        "PE máximo": "5",
        "SAN atual": "15",
        "SAN máxima": "20"
      },
      notes: ""
    }
  });
  assert.equal(characterResult.response.status, 201);
  const characterId = characterResult.payload.character.id;
  assert.equal(characterResult.payload.character.campaignId, null);
  const standaloneBootstrap = await api("/bootstrap", { cookie: playerCookie });
  assert.equal(
    standaloneBootstrap.payload.characters.find((character) => character.id === characterId).campaignId,
    null
  );
  const linkedCharacterResult = await api(`/characters/${characterId}/campaign`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { campaignId }
  });
  assert.equal(linkedCharacterResult.response.status, 200);
  assert.equal(linkedCharacterResult.payload.character.campaignId, campaignId);
  assert.deepEqual(linkedCharacterResult.payload.character.fields, characterResult.payload.character.fields);
  const reserveCharacterResult = await api("/characters", {
    cookie: playerCookie,
    method: "POST",
    body: { name: "Agente reserva", system: "ordem", fields: {}, notes: "" }
  });
  assert.equal(reserveCharacterResult.response.status, 201);
  const reserveLinkResult = await api(`/characters/${reserveCharacterResult.payload.character.id}/campaign`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { campaignId }
  });
  assert.equal(reserveLinkResult.response.status, 409);
  const reserveEditLinkResult = await api(`/characters/${reserveCharacterResult.payload.character.id}`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { name: "Agente reserva", system: "ordem", campaignId, fields: {}, notes: "" }
  });
  assert.equal(reserveEditLinkResult.response.status, 409);
  const secondPlayerCampaignCharacter = await api("/characters", {
    cookie: playerCookie,
    method: "POST",
    body: { name: "Agente extra", system: "ordem", campaignId, fields: {}, notes: "" }
  });
  assert.equal(secondPlayerCampaignCharacter.response.status, 409);
  const duplicateLinkResult = await api(`/characters/${characterId}/campaign`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { campaignId }
  });
  assert.equal(duplicateLinkResult.response.status, 409);

  const incompatibleCharacterResult = await api("/characters", {
    cookie: playerCookie,
    method: "POST",
    body: { name: "Exploradora", system: "dnd", fields: {}, notes: "" }
  });
  assert.equal(incompatibleCharacterResult.response.status, 201);
  const incompatibleLinkResult = await api(`/characters/${incompatibleCharacterResult.payload.character.id}/campaign`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { campaignId }
  });
  assert.equal(incompatibleLinkResult.response.status, 400);
  const incompatibleCharacter = (await api("/bootstrap", { cookie: playerCookie })).payload.characters
    .find((character) => character.id === incompatibleCharacterResult.payload.character.id);
  assert.equal(incompatibleCharacter.campaignId, null);

  const masterCharacterResult = await api("/characters", {
    cookie: masterCookie,
    method: "POST",
    body: {
      name: "Agente do mestre",
      system: "ordem",
      campaignId,
      fields: {
        "PV atual": "10",
        "PV máximo": "15",
        "PE atual": "2",
        "PE máximo": "4",
        "SAN atual": "12",
        "SAN máxima": "20"
      },
      notes: ""
    }
  });
  assert.equal(masterCharacterResult.response.status, 201);
  const masterCharacterId = masterCharacterResult.payload.character.id;
  const secondMasterCharacterResult = await api("/characters", {
    cookie: masterCookie,
    method: "POST",
    body: { name: "Outro agente do mestre", system: "ordem", campaignId, fields: {}, notes: "" }
  });
  assert.equal(secondMasterCharacterResult.response.status, 201);
  const secondMasterCharacterId = secondMasterCharacterResult.payload.character.id;

  const forbiddenCharacter = await api(`/characters/${characterId}`, { cookie: outsiderCookie });
  assert.equal(forbiddenCharacter.response.status, 404);
  const forbiddenEdit = await api(`/characters/${characterId}`, {
    cookie: masterCookie,
    method: "PATCH",
    body: { name: "Não permitido", system: "dnd", campaignId, fields: {}, notes: "" }
  });
  assert.equal(forbiddenEdit.response.status, 403);
  const forbiddenLink = await api(`/characters/${characterId}/campaign`, {
    cookie: masterCookie,
    method: "PATCH",
    body: { campaignId }
  });
  assert.equal(forbiddenLink.response.status, 403);

  const started = await api(`/campaigns/${campaignId}/sessions`, {
    cookie: masterCookie,
    method: "POST",
    body: {}
  });
  assert.equal(started.response.status, 201);
  const sessionId = started.payload.session.id;
  assert.equal(started.payload.session.sessionNumber, 1);

  const playerResourceUpdate = await api(`/characters/${characterId}/resources`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { hp: 9, pe: 2, san: 11 }
  });
  assert.equal(playerResourceUpdate.response.status, 200);
  assert.equal(playerResourceUpdate.payload.events.length, 3);
  assert.deepEqual(playerResourceUpdate.payload.events.map((event) => event.field), [
    "Pontos de vida",
    "Pontos de esforço",
    "Sanidade"
  ]);
  assert.equal(playerResourceUpdate.payload.events[0].before, "12");
  assert.equal(playerResourceUpdate.payload.events[0].after, "9");

  const masterResourceUpdate = await api(`/characters/${characterId}/resources`, {
    cookie: masterCookie,
    method: "PATCH",
    body: { hp: 8, pe: 1, san: 10 }
  });
  assert.equal(masterResourceUpdate.response.status, 200);
  assert.equal(masterResourceUpdate.payload.events.length, 3);
  assert.equal(masterResourceUpdate.payload.events[0].author, "mestre@example.com");

  const forbiddenResourceUpdate = await api(`/characters/${masterCharacterId}/resources`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { hp: 8, pe: 1, san: 10 }
  });
  assert.equal(forbiddenResourceUpdate.response.status, 403);

  const overMaximumResourceUpdate = await api(`/characters/${characterId}/resources`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { hp: 21, pe: 1, san: 10 }
  });
  assert.equal(overMaximumResourceUpdate.response.status, 400);

  const secondSession = await api(`/campaigns/${campaignId}/sessions`, {
    cookie: masterCookie,
    method: "POST",
    body: {}
  });
  assert.equal(secondSession.response.status, 409);
  const activeSessionDelete = await api(`/sessions/${sessionId}`, {
    cookie: masterCookie,
    method: "DELETE"
  });
  assert.equal(activeSessionDelete.response.status, 409);

  const eventResult = await api(`/sessions/${sessionId}/events`, {
    cookie: playerCookie,
    method: "POST",
    body: { characterId, field: "PV atual", after: "9" }
  });
  assert.equal(eventResult.response.status, 201);
  assert.equal(eventResult.payload.event.before, "8");
  assert.equal(eventResult.payload.event.after, "9");
  const deleteCharacterWithHistory = await api(`/characters/${characterId}`, {
    cookie: playerCookie,
    method: "DELETE"
  });
  assert.equal(deleteCharacterWithHistory.response.status, 409);
  assert.equal(deleteCharacterWithHistory.payload.error.code, "character_has_history");
  const activeBootstrap = await api("/bootstrap", { cookie: playerCookie });
  const activeSession = activeBootstrap.payload.sessions.find((session) => session.id === sessionId);
  assert.equal(activeSession.events.length, 7);
  assert.ok(activeSession.events.some((event) => event.field === "Pontos de esforço" && event.author === "mestre@example.com"));

  const missingSummary = await api(`/sessions/${sessionId}/finish`, {
    cookie: masterCookie,
    method: "POST",
    body: { summary: "   " }
  });
  assert.equal(missingSummary.response.status, 400);
  const activeBatchSessionDelete = await api("/sessions", {
    cookie: masterCookie,
    method: "DELETE",
    body: { sessionIds: [sessionId] }
  });
  assert.equal(activeBatchSessionDelete.response.status, 409);
  const stillActive = (await api("/bootstrap", { cookie: masterCookie })).payload.sessions
    .find((session) => session.id === sessionId);
  assert.equal(stillActive.status, "active");

  const finished = await api(`/sessions/${sessionId}/finish`, {
    cookie: masterCookie,
    method: "POST",
    body: { summary: "O grupo encontrou uma passagem." }
  });
  assert.equal(finished.response.status, 200);
  const lateEvent = await api(`/sessions/${sessionId}/events`, {
    cookie: playerCookie,
    method: "POST",
    body: { characterId, field: "PV atual", after: "8" }
  });
  assert.equal(lateEvent.response.status, 409);

  const postSessionResourceUpdate = await api(`/characters/${characterId}/resources`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { hp: 7, pe: 1, san: 9 }
  });
  assert.equal(postSessionResourceUpdate.response.status, 200);
  assert.deepEqual(postSessionResourceUpdate.payload.events, []);
  assert.equal(postSessionResourceUpdate.payload.character.fields["PV atual"], "7");
  const finishedBootstrap = await api("/bootstrap", { cookie: playerCookie });
  const finishedSession = finishedBootstrap.payload.sessions.find((session) => session.id === sessionId);
  assert.equal(finishedSession.events.length, 7);
  assert.equal(finishedSession.sessionNumber, 1);
  assert.equal(finishedSession.masterSummary, "O grupo encontrou uma passagem.");

  const forbiddenOtherCharacterUnlink = await api(`/campaigns/${campaignId}/characters`, {
    cookie: playerCookie,
    method: "DELETE",
    body: { characterIds: [masterCharacterId] }
  });
  assert.equal(forbiddenOtherCharacterUnlink.response.status, 403);
  const playerUnlink = await api(`/campaigns/${campaignId}/characters`, {
    cookie: playerCookie,
    method: "DELETE",
    body: { characterIds: [characterId] }
  });
  assert.equal(playerUnlink.response.status, 204);
  const unlinkedCharacter = (await api("/bootstrap", { cookie: playerCookie })).payload.characters
    .find((character) => character.id === characterId);
  assert.equal(unlinkedCharacter.campaignId, null);
  assert.deepEqual(unlinkedCharacter.fields, postSessionResourceUpdate.payload.character.fields);
  const preservedHistory = (await api("/bootstrap", { cookie: playerCookie })).payload.sessions
    .find((session) => session.id === sessionId);
  assert.equal(preservedHistory.events.length, 7);
  const playerReplacementLink = await api(`/characters/${reserveCharacterResult.payload.character.id}/campaign`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { campaignId }
  });
  assert.equal(playerReplacementLink.response.status, 200);
  const unlinkedCharacters = await api(`/campaigns/${campaignId}/characters`, {
    cookie: masterCookie,
    method: "DELETE",
    body: {
      characterIds: [
        reserveCharacterResult.payload.character.id,
        masterCharacterId,
        secondMasterCharacterId
      ]
    }
  });
  assert.equal(unlinkedCharacters.response.status, 204);

  const nextSession = await api(`/campaigns/${campaignId}/sessions`, {
    cookie: masterCookie,
    method: "POST",
    body: {}
  });
  assert.equal(nextSession.response.status, 201);
  assert.equal(nextSession.payload.session.sessionNumber, 2);
  const nextFinished = await api(`/sessions/${nextSession.payload.session.id}/finish`, {
    cookie: masterCookie,
    method: "POST",
    body: { summary: "O grupo seguiu para o próximo local." }
  });
  assert.equal(nextFinished.response.status, 200);
  const thirdSession = await api(`/campaigns/${campaignId}/sessions`, {
    cookie: masterCookie,
    method: "POST",
    body: {}
  });
  assert.equal(thirdSession.response.status, 201);
  const thirdFinished = await api(`/sessions/${thirdSession.payload.session.id}/finish`, {
    cookie: masterCookie,
    method: "POST",
    body: { summary: "O grupo encontrou um novo desafio." }
  });
  assert.equal(thirdFinished.response.status, 200);
  const archivedSessions = (await api("/bootstrap", { cookie: playerCookie })).payload.sessions
    .filter((session) => session.campaignId === campaignId)
    .sort((left, right) => left.sessionNumber - right.sessionNumber);
  assert.deepEqual(archivedSessions.map((session) => session.sessionNumber), [1, 2, 3]);
  assert.deepEqual(archivedSessions.map((session) => session.masterSummary), [
    "O grupo encontrou uma passagem.",
    "O grupo seguiu para o próximo local.",
    "O grupo encontrou um novo desafio."
  ]);
  const forbiddenSessionDelete = await api("/sessions", {
    cookie: playerCookie,
    method: "DELETE",
    body: { sessionIds: [sessionId, nextSession.payload.session.id] }
  });
  assert.equal(forbiddenSessionDelete.response.status, 404);
  const deletedSessions = await api("/sessions", {
    cookie: masterCookie,
    method: "DELETE",
    body: { sessionIds: [sessionId, nextSession.payload.session.id] }
  });
  assert.equal(deletedSessions.response.status, 204);
  const remainingSessions = (await api("/bootstrap", { cookie: playerCookie })).payload.sessions
    .filter((session) => session.campaignId === campaignId);
  assert.equal(remainingSessions.length, 1);
  assert.equal(remainingSessions[0].sessionNumber, 1);
  assert.equal(remainingSessions[0].masterSummary, "O grupo encontrou um novo desafio.");
  const deletedHistory = await api(`/sessions/${sessionId}`, { cookie: playerCookie });
  assert.equal(deletedHistory.response.status, 404);

  const tableResult = await api("/tables", {
    cookie: masterCookie,
    method: "POST",
    body: {
      title: "Mesa aberta",
      system: "tormenta",
      description: "Uma aventura para o grupo.",
      schedule: "Sábados às 19h",
      startsAt: "2027-01-15T22:00:00.000Z",
      timezone: "America/Sao_Paulo",
      seats: 1,
      requirements: ""
    }
  });
  assert.equal(tableResult.response.status, 201);
  const tableId = tableResult.payload.table.id;

  const application = await api(`/tables/${tableId}/applications`, {
    cookie: playerCookie,
    method: "POST",
    body: { message: "Tenho interesse." }
  });
  assert.equal(application.response.status, 201);
  assert.equal(application.payload.table.myApplication.status, "pending");

  const firstMessage = await api(`/tables/${tableId}/messages`, {
    cookie: playerCookie,
    method: "POST",
    body: { text: "Olá, mestre." }
  });
  assert.equal(firstMessage.response.status, 201);
  assert.equal(firstMessage.payload.table.messages.length, 1);
  const ownerTable = (await api("/bootstrap", { cookie: masterCookie }))
    .payload.tables.find((table) => table.id === tableId);
  const ownerReply = await api(`/tables/${tableId}/messages`, {
    cookie: masterCookie,
    method: "POST",
    body: { applicantId: ownerTable.applications[0].userId, text: "Olá, jogadora." }
  });
  assert.equal(ownerReply.response.status, 201);
  const privateMessages = await api(`/tables/${tableId}`, { cookie: outsiderCookie });
  assert.equal(privateMessages.response.status, 200);
  assert.equal(privateMessages.payload.table.messages.length, 0);
  assert.equal(firstMessage.payload.table.messages.some((message) => message.text === "Olá, jogadora."), false);

  const duplicateApplication = await api(`/tables/${tableId}/applications`, {
    cookie: playerCookie,
    method: "POST",
    body: {}
  });
  assert.equal(duplicateApplication.response.status, 409);

  const applicationId = (await api("/bootstrap", { cookie: masterCookie }))
    .payload.tables.find((table) => table.id === tableId).applications[0].id;
  const decision = await api(`/applications/${applicationId}`, {
    cookie: masterCookie,
    method: "PATCH",
    body: { status: "accepted" }
  });
  assert.equal(decision.response.status, 200);
  assert.equal(decision.payload.table.status, "full");
  assert.equal(decision.payload.table.availableSeats, 0);

  const hiddenTable = await api(`/tables/${tableId}`, { cookie: outsiderCookie });
  assert.equal(hiddenTable.response.status, 404);
  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
});

test("salva as seções de Ordem e registra alterações de itens somente em sessão ativa", async () => {
  const masterCookie = await register("Mestre da seção", "secao-mestre@example.com");
  const playerCookie = await register("Jogador da seção", "secao-jogador@example.com");
  const outsiderCookie = await register("Pessoa externa", "secao-externa@example.com");
  const campaignResult = await api("/campaigns", {
    cookie: masterCookie,
    method: "POST",
    body: { name: "Campanha de teste", system: "ordem", description: "" }
  });
  assert.equal(campaignResult.response.status, 201);
  const campaignId = campaignResult.payload.campaign.id;
  const invitation = await api(`/campaigns/${campaignId}/members`, {
    cookie: masterCookie,
    method: "POST",
    body: { email: "secao-jogador@example.com" }
  });
  assert.equal(invitation.response.status, 201);
  const characterResult = await api("/characters", {
    cookie: playerCookie,
    method: "POST",
    body: {
      name: "Agente de teste",
      system: "ordem",
      campaignId,
      fields: { "PV máximo": "10", "PV atual": "10" },
      notes: ""
    }
  });
  assert.equal(characterResult.response.status, 201);
  const characterId = characterResult.payload.character.id;

  const ability = await api(`/characters/${characterId}/section`, {
    cookie: playerCookie,
    method: "PATCH",
    body: {
      section: "abilities",
      value: [{ id: "ability-1", name: "Habilidade própria", category: "Própria", description: "Criada pelo jogador." }]
    }
  });
  assert.equal(ability.response.status, 200);
  assert.equal(ability.payload.character.fields.Habilidades[0].name, "Habilidade própria");

  const ritual = await api(`/characters/${characterId}/section`, {
    cookie: playerCookie,
    method: "PATCH",
    body: {
      section: "rituals",
      value: [{ id: "ritual-1", name: "Ritual de teste", element: "Energia", circle: 1, description: "Descrição livre." }]
    }
  });
  assert.equal(ritual.response.status, 200);
  assert.equal(ritual.payload.character.fields.Rituais[0].circle, 1);
  const invalidRitual = await api(`/characters/${characterId}/section`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { section: "rituals", value: [{ id: "ritual-2", name: "Ritual inválido", circle: 5 }] }
  });
  assert.equal(invalidRitual.response.status, 400);

  const description = await api(`/characters/${characterId}/section`, {
    cookie: playerCookie,
    method: "PATCH",
    body: {
      section: "description",
      value: {
        notes: "Anotações do agente",
        appearance: "Aparência",
        personality: "Personalidade",
        history: "Histórico",
        objective: "Objetivo"
      }
    }
  });
  assert.equal(description.response.status, 200);
  assert.equal(description.payload.character.notes, "Anotações do agente");
  assert.equal(description.payload.character.fields.Histórico, "Histórico");

  const inventory = {
    prestige: 3,
    rank: "Recruta",
    creditLimit: "Baixo",
    capacity: 10,
    itemLimits: { "0": 5, I: 3, II: 1, III: 0 },
    items: [
      { id: "item-lanterna", name: "Lanterna", type: "geral", category: "0", quantity: 1, spaces: 1, capacityBonus: 0, description: "" },
      { id: "item-kit", name: "Kit", type: "geral", category: "I", quantity: 1, spaces: 1, capacityBonus: 0, description: "" }
    ]
  };
  const savedInventory = await api(`/characters/${characterId}/section`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { section: "inventory", value: inventory }
  });
  assert.equal(savedInventory.response.status, 200);
  assert.deepEqual(savedInventory.payload.events, []);
  const forbiddenInventoryEdit = await api(`/characters/${characterId}/section`, {
    cookie: outsiderCookie,
    method: "PATCH",
    body: { section: "inventory", value: inventory }
  });
  assert.equal(forbiddenInventoryEdit.response.status, 403);

  const started = await api(`/campaigns/${campaignId}/sessions`, {
    cookie: masterCookie,
    method: "POST",
    body: {}
  });
  assert.equal(started.response.status, 201);
  const activeInventory = {
    ...inventory,
    items: [
      { ...inventory.items[0], quantity: 2 },
      { id: "item-rifle", name: "Arma de teste", type: "arma", category: "I", quantity: 1, spaces: 2, capacityBonus: 0, damage: "1d6", description: "" }
    ]
  };
  const changedInventory = await api(`/characters/${characterId}/section`, {
    cookie: masterCookie,
    method: "PATCH",
    body: { section: "inventory", value: activeInventory }
  });
  assert.equal(changedInventory.response.status, 200);
  assert.equal(changedInventory.payload.events.length, 3);
  assert.deepEqual(changedInventory.payload.events.map((event) => event.after).sort(), [
    "Adicionado: Arma de teste (x1) · arma · cat. I",
    "Alterado: Lanterna (x2) · geral · cat. 0",
    "Removido: Kit (x1) · geral · cat. I"
  ].sort());
  assert.ok(changedInventory.payload.events.every((event) => event.author === "secao-mestre@example.com"));

  const finished = await api(`/sessions/${started.payload.session.id}/finish`, {
    cookie: masterCookie,
    method: "POST",
    body: { summary: "Sessão de teste." }
  });
  assert.equal(finished.response.status, 200);
  const afterSessionInventory = await api(`/characters/${characterId}/section`, {
    cookie: playerCookie,
    method: "PATCH",
    body: { section: "inventory", value: { ...activeInventory, items: [] } }
  });
  assert.equal(afterSessionInventory.response.status, 200);
  assert.deepEqual(afterSessionInventory.payload.events, []);
});
