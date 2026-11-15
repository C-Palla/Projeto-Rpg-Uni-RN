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
    body: { name: "A campanha", system: "dnd", description: "" }
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
      system: "dnd",
      campaignId,
      fields: { "Pontos de vida": "12" },
      notes: ""
    }
  });
  assert.equal(characterResult.response.status, 201);
  const characterId = characterResult.payload.character.id;

  const forbiddenCharacter = await api(`/characters/${characterId}`, { cookie: outsiderCookie });
  assert.equal(forbiddenCharacter.response.status, 404);
  const forbiddenEdit = await api(`/characters/${characterId}`, {
    cookie: masterCookie,
    method: "PATCH",
    body: { name: "Não permitido", system: "dnd", campaignId, fields: {}, notes: "" }
  });
  assert.equal(forbiddenEdit.response.status, 403);

  const started = await api(`/campaigns/${campaignId}/sessions`, {
    cookie: masterCookie,
    method: "POST",
    body: {}
  });
  assert.equal(started.response.status, 201);
  const sessionId = started.payload.session.id;

  const secondSession = await api(`/campaigns/${campaignId}/sessions`, {
    cookie: masterCookie,
    method: "POST",
    body: {}
  });
  assert.equal(secondSession.response.status, 409);

  const eventResult = await api(`/sessions/${sessionId}/events`, {
    cookie: playerCookie,
    method: "POST",
    body: { characterId, field: "Pontos de vida", after: "9" }
  });
  assert.equal(eventResult.response.status, 201);
  assert.equal(eventResult.payload.event.before, "12");
  assert.equal(eventResult.payload.event.after, "9");

  const finished = await api(`/sessions/${sessionId}/finish`, {
    cookie: masterCookie,
    method: "POST",
    body: { summary: "O grupo encontrou uma passagem." }
  });
  assert.equal(finished.response.status, 200);
  const lateEvent = await api(`/sessions/${sessionId}/events`, {
    cookie: playerCookie,
    method: "POST",
    body: { characterId, field: "Pontos de vida", after: "8" }
  });
  assert.equal(lateEvent.response.status, 409);

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
