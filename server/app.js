const crypto = require("node:crypto");
const path = require("node:path");
const express = require("express");
const database = require("./db");

const app = express();
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : "";
const sessionTtlDays = Math.min(Math.max(Number(process.env.SESSION_TTL_DAYS || 7), 1), 30);
const cookieName = "mesa_session";
const secureCookie = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";
const loginAttempts = new Map();
const allowedSystems = new Set(["dnd", "tormenta", "ordem"]);
const now = () => new Date().toISOString();
const makeId = () => crypto.randomUUID();

app.disable("x-powered-by");
app.use((request, response, next) => {
  response.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: ${supabaseOrigin}; connect-src 'self' ${supabaseOrigin}; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
  });
  next();
});
app.use(express.json({ limit: "64kb", strict: true }));

function apiError(status, code, message) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function asyncRoute(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}

function validString(value, min, max) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

function validateSystem(system) {
  return allowedSystems.has(system);
}

function bodyString(body, key, min, max) {
  const value = body[key];
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) {
    throw apiError(400, "validation_error", `Campo inválido: ${key}.`);
  }
  return value.trim();
}

function bodySystem(body) {
  if (!validateSystem(body.system)) {
    throw apiError(400, "validation_error", "Selecione um sistema suportado.");
  }
  return body.system;
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, savedHash) {
  const [salt, expectedHash] = savedHash.split(":");
  if (!salt || !expectedHash) return false;
  const actualHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return safeEqual(actualHash, expectedHash);
}

function clearSessionCookie(response) {
  response.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookie,
    path: "/"
  });
}

function setSessionCookie(response, token) {
  response.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookie,
    path: "/",
    maxAge: sessionTtlDays * 24 * 60 * 60 * 1000
  });
}

function cleanExpiredSessions() {
  database.prepare("DELETE FROM auth_sessions WHERE expires_at <= ?").run(now());
}

function userFromSession(request, response, next) {
  const token = request.cookies?.[cookieName];
  if (!token) return next();
  const session = database.prepare(`
    SELECT users.id, users.display_name, users.email, auth_sessions.id AS session_id, auth_sessions.expires_at
    FROM auth_sessions
    JOIN users ON users.id = auth_sessions.user_id
    WHERE auth_sessions.token_hash = ?
  `).get(crypto.createHash("sha256").update(token).digest("hex"));

  if (!session || session.expires_at <= now()) {
    clearSessionCookie(response);
    return next();
  }
  request.user = { id: session.id, name: session.display_name, email: session.email };
  request.sessionId = session.session_id;
  return next();
}

function requireUser(request, response, next) {
  if (!request.user) return next(apiError(401, "unauthenticated", "Entre na sua conta para continuar."));
  next();
}

function verifyOrigin(request, response, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return next();
  const origin = request.get("origin");
  if (!origin) return next();
  const allowedOrigin = process.env.APP_ORIGIN || `${request.protocol}://${request.get("host")}`;
  if (origin !== allowedOrigin) return next(apiError(403, "invalid_origin", "Origem da solicitação não permitida."));
  next();
}

function throttleLogin(request, response, next) {
  const key = request.ip || request.socket.remoteAddress || "unknown";
  const entry = loginAttempts.get(key);
  if (entry && entry.count >= 10 && Date.now() - entry.startedAt < 15 * 60 * 1000) {
    return next(apiError(429, "rate_limited", "Muitas tentativas. Aguarde 15 minutos e tente novamente."));
  }
  next();
}

function recordLoginFailure(request) {
  const key = request.ip || request.socket.remoteAddress || "unknown";
  const previous = loginAttempts.get(key);
  if (!previous || Date.now() - previous.startedAt >= 15 * 60 * 1000) {
    loginAttempts.set(key, { count: 1, startedAt: Date.now() });
  } else {
    previous.count += 1;
  }
}

function startSession(response, userId) {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionTtlDays * 24 * 60 * 60 * 1000).toISOString();
  database.prepare(`
    INSERT INTO auth_sessions (id, user_id, token_hash, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(makeId(), userId, crypto.createHash("sha256").update(token).digest("hex"), expiresAt, now());
  setSessionCookie(response, token);
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function isCampaignMember(campaignId, userId) {
  return Boolean(database.prepare("SELECT 1 FROM campaign_members WHERE campaign_id = ? AND user_id = ?").get(campaignId, userId));
}

function campaignMaster(campaignId) {
  return database.prepare("SELECT owner_id FROM campaigns WHERE id = ?").get(campaignId);
}

function requireCampaignMember(campaignId, userId) {
  if (!isCampaignMember(campaignId, userId)) {
    throw apiError(404, "not_found", "Campanha não encontrada.");
  }
}

function requireCampaignMaster(campaignId, userId) {
  const campaign = campaignMaster(campaignId);
  if (!campaign || campaign.owner_id !== userId) {
    throw apiError(404, "not_found", "Campanha não encontrada.");
  }
}

function requireCharacterCampaignSlot(campaignId, userId, characterId = null) {
  const campaign = campaignMaster(campaignId);
  if (!campaign || campaign.owner_id === userId) return;
  const existingCharacter = characterId
    ? database.prepare("SELECT 1 FROM characters WHERE campaign_id = ? AND owner_id = ? AND id <> ?")
      .get(campaignId, userId, characterId)
    : database.prepare("SELECT 1 FROM characters WHERE campaign_id = ? AND owner_id = ?")
      .get(campaignId, userId);
  if (existingCharacter) {
    throw apiError(409, "campaign_character_limit", "Você pode ter apenas um agente próprio por campanha. Desvincule o atual para adicionar outro.");
  }
}

function serializeCampaign(row, userId) {
  const participants = database.prepare(`
    SELECT users.id, users.display_name AS name, users.email, campaign_members.role
    FROM campaign_members JOIN users ON users.id = campaign_members.user_id
    WHERE campaign_members.campaign_id = ? ORDER BY campaign_members.created_at
  `).all(row.id);
  return {
    id: row.id,
    owner: row.owner_id,
    name: row.name,
    system: row.system,
    description: row.description,
    participants: participants.map((participant) => participant.email),
    members: participants.map((participant) => ({
      id: participant.id,
      name: participant.name,
      email: participant.email,
      role: participant.role
    })),
    createdAt: row.created_at,
    isMaster: row.owner_id === userId
  };
}

function parseFields(value) {
  try {
    const fields = JSON.parse(value);
    return fields && typeof fields === "object" && !Array.isArray(fields) ? fields : {};
  } catch {
    return {};
  }
}

function serializeCharacter(row) {
  return {
    id: row.id,
    owner: row.owner_id,
    campaignId: row.campaign_id,
    name: row.name,
    system: row.system,
    fields: parseFields(row.fields_json),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function serializeEvent(row) {
  return {
    id: row.id,
    characterId: row.character_id,
    characterName: row.character_name,
    author: row.author_email,
    field: row.field_name,
    before: row.value_before,
    after: row.value_after,
    createdAt: row.created_at
  };
}

function serializeGameSession(row) {
  const events = database.prepare(`
    SELECT session_events.*, characters.name AS character_name, users.email AS author_email
    FROM session_events
    JOIN characters ON characters.id = session_events.character_id
    JOIN users ON users.id = session_events.author_id
    WHERE session_id = ? ORDER BY created_at, id
  `).all(row.id).map(serializeEvent);
  const sessionNumber = database.prepare(`
    SELECT COUNT(*) AS number FROM game_sessions
    WHERE campaign_id = ? AND (
      started_at < ? OR (started_at = ? AND id <= ?)
    )
  `).get(row.campaign_id, row.started_at, row.started_at, row.id).number;
  return {
    id: row.id,
    campaignId: row.campaign_id,
    sessionNumber,
    status: row.status,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    masterSummary: row.master_summary,
    events
  };
}

function serializeTable(row, userId) {
  const applications = row.owner_id === userId
    ? database.prepare(`
      SELECT table_applications.*, users.display_name AS user_name
      FROM table_applications JOIN users ON users.id = table_applications.user_id
      WHERE table_id = ? ORDER BY created_at
    `).all(row.id).map((application) => ({
      id: application.id,
      userName: application.user_name,
      userId: application.user_id,
      tableTitle: row.title,
      message: application.message,
      status: application.status,
      createdAt: application.created_at,
      decidedAt: application.decided_at
    }))
    : [];
  const myApplication = userId
    ? database.prepare("SELECT id, status, message, created_at FROM table_applications WHERE table_id = ? AND user_id = ?").get(row.id, userId)
    : null;
  const messages = userId
    ? database.prepare(`
      SELECT table_messages.*, users.display_name AS sender_name
      FROM table_messages JOIN users ON users.id = table_messages.sender_id
      WHERE table_id = ? AND ${row.owner_id === userId ? "1 = 1" : "applicant_id = ?"}
      ORDER BY created_at, id
    `).all(row.owner_id === userId ? [row.id] : [row.id, userId]).map((message) => ({
      id: message.id,
      from: message.sender_id,
      fromName: message.sender_name,
      applicantId: message.applicant_id,
      text: message.body,
      createdAt: message.created_at
    }))
    : [];
  const acceptedCount = database.prepare("SELECT COUNT(*) AS count FROM table_applications WHERE table_id = ? AND status = 'accepted'").get(row.id).count;
  const owner = database.prepare("SELECT display_name FROM users WHERE id = ?").get(row.owner_id);
  const status = row.status === "open" && acceptedCount >= row.seats ? "full" : row.status;
  return {
    id: row.id,
    title: row.title,
    system: row.system,
    description: row.description,
    schedule: row.schedule,
    startsAt: row.starts_at,
    timezone: row.timezone,
    seats: row.seats,
    requirements: row.requirements,
    owner: row.owner_id,
    masterName: owner.display_name,
    status,
    acceptedCount,
    availableSeats: Math.max(0, row.seats - acceptedCount),
    applications,
    myApplication: myApplication ? {
      id: myApplication.id,
      status: myApplication.status,
      message: myApplication.message,
      createdAt: myApplication.created_at
    } : null,
    messages
  };
}

function loadBootstrap(user) {
  const campaigns = user ? database.prepare(`
    SELECT campaigns.* FROM campaigns
    JOIN campaign_members ON campaign_members.campaign_id = campaigns.id
    WHERE campaign_members.user_id = ? ORDER BY campaigns.created_at DESC
  `).all(user.id).map((row) => serializeCampaign(row, user.id)) : [];
  const characters = user ? database.prepare(`
    SELECT DISTINCT characters.* FROM characters
    LEFT JOIN campaign_members ON campaign_members.campaign_id = characters.campaign_id
    WHERE characters.owner_id = ? OR campaign_members.user_id = ?
    ORDER BY characters.created_at DESC
  `).all(user.id, user.id).map(serializeCharacter) : [];
  const sessions = user ? database.prepare(`
    SELECT DISTINCT game_sessions.* FROM game_sessions
    JOIN campaign_members ON campaign_members.campaign_id = game_sessions.campaign_id
    WHERE campaign_members.user_id = ? ORDER BY game_sessions.started_at DESC
  `).all(user.id).map(serializeGameSession) : [];
  const tables = database.prepare(`
    SELECT DISTINCT public_tables.* FROM public_tables
    LEFT JOIN table_applications ON table_applications.table_id = public_tables.id
    WHERE
      (public_tables.status = 'open' AND (
        SELECT COUNT(*) FROM table_applications accepted
        WHERE accepted.table_id = public_tables.id AND accepted.status = 'accepted'
      ) < public_tables.seats)
      ${user ? "OR public_tables.owner_id = ? OR table_applications.user_id = ?" : ""}
    ORDER BY public_tables.created_at DESC
  `).all(...(user ? [user.id, user.id] : [])).map((row) => serializeTable(row, user?.id));

  return { user: user ? publicUser(user) : null, campaigns, characters, sessions, tables };
}

function getTableForUser(tableId, user) {
  const row = database.prepare(`
    SELECT public_tables.* FROM public_tables
    WHERE public_tables.id = ? AND (
      public_tables.status = 'open'
      OR public_tables.owner_id = ?
      OR EXISTS (SELECT 1 FROM table_applications WHERE table_id = public_tables.id AND user_id = ?)
    )
  `).get(tableId, user?.id || "", user?.id || "");
  if (!row) throw apiError(404, "not_found", "Mesa não encontrada.");
  return serializeTable(row, user?.id);
}

function getCharacterOr404(id) {
  const character = database.prepare("SELECT * FROM characters WHERE id = ?").get(id);
  if (!character) throw apiError(404, "not_found", "Ficha não encontrada.");
  return character;
}

function checkApplicationOpen(tableId) {
  const table = database.prepare("SELECT * FROM public_tables WHERE id = ?").get(tableId);
  if (!table || table.status !== "open") throw apiError(409, "table_closed", "Esta mesa não está aceitando inscrições.");
  const accepted = database.prepare("SELECT COUNT(*) AS count FROM table_applications WHERE table_id = ? AND status = 'accepted'").get(tableId).count;
  if (accepted >= table.seats) {
    database.prepare("UPDATE public_tables SET status = 'full' WHERE id = ?").run(tableId);
    throw apiError(409, "table_full", "Não há vagas disponíveis nesta mesa.");
  }
  return table;
}

app.use("/api", verifyOrigin);
app.use((request, response, next) => {
  const cookie = request.headers.cookie || "";
  const match = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`));
  request.cookies = match ? { [cookieName]: decodeURIComponent(match.slice(cookieName.length + 1)) } : {};
  userFromSession(request, response, next);
});
app.use((request, response, next) => {
  if (request.path.startsWith("/api/")) cleanExpiredSessions();
  next();
});

app.get("/api/health", (request, response) => response.json({ status: "ok" }));
app.get("/api/bootstrap", (request, response) => response.json(loadBootstrap(request.user)));
app.get("/supabase-config.js", (request, response) => {
  response.set({
    "Cache-Control": "no-store",
    "Content-Type": "text/javascript; charset=utf-8"
  });
  response.send(`window.MESA_SUPABASE_CONFIG = ${JSON.stringify({
    url: supabaseUrl,
    publishableKey: supabasePublishableKey
  })};`);
});

app.post("/api/auth/register", asyncRoute((request, response) => {
  const name = bodyString(request.body, "name", 1, 80);
  const email = bodyString(request.body, "email", 3, 254).toLowerCase();
  const password = request.body.password;
  if (typeof password !== "string" || password.length < 10 || password.length > 200) {
    throw apiError(400, "validation_error", "A senha deve ter entre 10 e 200 caracteres.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw apiError(400, "validation_error", "Informe um email válido.");
  }
  if (database.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) {
    throw apiError(409, "email_in_use", "Este email já está cadastrado.");
  }
  const user = { id: makeId(), name, email };
  database.prepare("INSERT INTO users (id, display_name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(user.id, user.name, user.email, hashPassword(password), now());
  startSession(response, user.id);
  response.status(201).json({ user });
}));

app.post("/api/auth/login", throttleLogin, asyncRoute((request, response) => {
  const email = typeof request.body.email === "string" ? request.body.email.trim().toLowerCase() : "";
  const password = typeof request.body.password === "string" ? request.body.password : "";
  const user = database.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    recordLoginFailure(request);
    throw apiError(401, "invalid_credentials", "Email ou senha inválidos.");
  }
  loginAttempts.delete(request.ip || request.socket.remoteAddress || "unknown");
  startSession(response, user.id);
  response.json({ user: publicUser({ id: user.id, name: user.display_name, email: user.email }) });
}));

app.post("/api/auth/logout", requireUser, (request, response) => {
  database.prepare("DELETE FROM auth_sessions WHERE id = ?").run(request.sessionId);
  clearSessionCookie(response);
  response.status(204).end();
});

app.post("/api/campaigns", requireUser, asyncRoute((request, response) => {
  const name = bodyString(request.body, "name", 1, 80);
  const description = typeof request.body.description === "string" ? request.body.description.trim() : "";
  if (description.length > 500) throw apiError(400, "validation_error", "A descrição pode ter no máximo 500 caracteres.");
  const system = bodySystem(request.body);
  const id = makeId();
  const createdAt = now();
  const createCampaign = database.transaction(() => {
    database.prepare("INSERT INTO campaigns (id, owner_id, name, system, description, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, request.user.id, name, system, description, createdAt);
    database.prepare("INSERT INTO campaign_members (campaign_id, user_id, role, created_at) VALUES (?, ?, 'master', ?)")
      .run(id, request.user.id, createdAt);
  });
  createCampaign();
  response.status(201).json({ campaign: serializeCampaign(database.prepare("SELECT * FROM campaigns WHERE id = ?").get(id), request.user.id) });
}));

app.post("/api/campaigns/:id/members", requireUser, asyncRoute((request, response) => {
  requireCampaignMaster(request.params.id, request.user.id);
  const email = bodyString(request.body, "email", 3, 254).toLowerCase();
  const invitedUser = database.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (!invitedUser) throw apiError(404, "user_not_found", "Crie uma conta para este email antes de adicioná-lo.");
  try {
    database.prepare("INSERT INTO campaign_members (campaign_id, user_id, role, created_at) VALUES (?, ?, 'player', ?)")
      .run(request.params.id, invitedUser.id, now());
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_PRIMARYKEY") throw apiError(409, "already_member", "Esta pessoa já participa da campanha.");
    throw error;
  }
  response.status(201).json({ campaign: serializeCampaign(database.prepare("SELECT * FROM campaigns WHERE id = ?").get(request.params.id), request.user.id) });
}));

app.post("/api/characters", requireUser, asyncRoute((request, response) => {
  const name = bodyString(request.body, "name", 1, 80);
  const system = bodySystem(request.body);
  const notes = typeof request.body.notes === "string" ? request.body.notes.trim() : "";
  const fields = request.body.fields && typeof request.body.fields === "object" && !Array.isArray(request.body.fields) ? request.body.fields : {};
  if (notes.length > 5000 || JSON.stringify(fields).length > 10000) throw apiError(400, "validation_error", "Os campos da ficha excedem o limite permitido.");
  const campaignId = request.body.campaignId || null;
  const id = makeId();
  const createdAt = now();
  const character = database.transaction(() => {
    if (campaignId) {
      requireCampaignMember(campaignId, request.user.id);
      const campaign = database.prepare("SELECT system FROM campaigns WHERE id = ?").get(campaignId);
      if (campaign.system !== system) throw apiError(400, "system_mismatch", "A ficha deve usar o sistema da campanha.");
      requireCharacterCampaignSlot(campaignId, request.user.id);
    }
    database.prepare(`
      INSERT INTO characters (id, owner_id, campaign_id, name, system, fields_json, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, request.user.id, campaignId, name, system, JSON.stringify(fields), notes, createdAt, createdAt);
    return getCharacterOr404(id);
  })();
  response.status(201).json({ character: serializeCharacter(character) });
}));

app.get("/api/characters/:id", requireUser, asyncRoute((request, response) => {
  const character = getCharacterOr404(request.params.id);
  if (character.owner_id !== request.user.id && (!character.campaign_id || !isCampaignMember(character.campaign_id, request.user.id))) {
    throw apiError(404, "not_found", "Ficha não encontrada.");
  }
  response.json({ character: serializeCharacter(character) });
}));

app.patch("/api/characters/:id", requireUser, asyncRoute((request, response) => {
  const name = bodyString(request.body, "name", 1, 80);
  const system = bodySystem(request.body);
  const notes = typeof request.body.notes === "string" ? request.body.notes.trim() : "";
  const fields = request.body.fields && typeof request.body.fields === "object" && !Array.isArray(request.body.fields) ? request.body.fields : {};
  const campaignId = request.body.campaignId || null;
  if (notes.length > 5000 || JSON.stringify(fields).length > 10000) throw apiError(400, "validation_error", "Os campos da ficha excedem o limite permitido.");
  const character = database.transaction(() => {
    const currentCharacter = getCharacterOr404(request.params.id);
    if (currentCharacter.owner_id !== request.user.id) throw apiError(403, "forbidden", "Você só pode editar fichas próprias.");
    if (campaignId) {
      requireCampaignMember(campaignId, request.user.id);
      const campaign = database.prepare("SELECT system FROM campaigns WHERE id = ?").get(campaignId);
      if (campaign.system !== system) throw apiError(400, "system_mismatch", "A ficha deve usar o sistema da campanha.");
      if (campaignId !== currentCharacter.campaign_id) {
        requireCharacterCampaignSlot(campaignId, request.user.id, currentCharacter.id);
      }
    }
    database.prepare(`
      UPDATE characters SET campaign_id = ?, name = ?, system = ?, fields_json = ?, notes = ?, updated_at = ? WHERE id = ?
    `).run(campaignId, name, system, JSON.stringify(fields), notes, now(), currentCharacter.id);
    return getCharacterOr404(currentCharacter.id);
  })();
  response.json({ character: serializeCharacter(character) });
}));

app.patch("/api/characters/:id/campaign", requireUser, asyncRoute((request, response) => {
  const campaignId = bodyString(request.body, "campaignId", 1, 80);
  const linkedCharacter = database.transaction(() => {
    const character = getCharacterOr404(request.params.id);
    if (character.owner_id !== request.user.id) throw apiError(403, "forbidden", "Você só pode vincular fichas próprias.");
    if (character.campaign_id) throw apiError(409, "character_already_linked", "Esta ficha já está vinculada a uma campanha.");

    requireCampaignMember(campaignId, request.user.id);
    const campaign = database.prepare("SELECT system FROM campaigns WHERE id = ?").get(campaignId);
    if (campaign.system !== character.system) throw apiError(400, "system_mismatch", "A ficha deve usar o sistema da campanha.");
    requireCharacterCampaignSlot(campaignId, request.user.id, character.id);

    const result = database.prepare("UPDATE characters SET campaign_id = ?, updated_at = ? WHERE id = ? AND campaign_id IS NULL")
      .run(campaignId, now(), character.id);
    if (result.changes !== 1) throw apiError(409, "character_already_linked", "Esta ficha já está vinculada a uma campanha.");
    return getCharacterOr404(character.id);
  })();
  response.json({ character: serializeCharacter(linkedCharacter) });
}));

app.patch("/api/characters/:id/resources", requireUser, asyncRoute((request, response) => {
  const character = getCharacterOr404(request.params.id);
  const campaign = character.campaign_id ? campaignMaster(character.campaign_id) : null;
  const isOwner = character.owner_id === request.user.id;
  const isMaster = campaign?.owner_id === request.user.id;
  if (!isOwner && !isMaster) throw apiError(403, "forbidden", "Você não pode alterar os recursos desta ficha.");
  if (character.system !== "ordem") throw apiError(400, "validation_error", "A edição de recursos está disponível para fichas de Ordem Paranormal.");
  if (!isOwner) requireCampaignMember(character.campaign_id, request.user.id);

  const requestedResources = [
    { key: "PV atual", maximum: "PV máximo", label: "Pontos de vida", value: request.body.hp },
    { key: "PE atual", maximum: "PE máximo", label: "Pontos de esforço", value: request.body.pe },
    { key: "SAN atual", maximum: "SAN máxima", label: "Sanidade", value: request.body.san }
  ];
  if (requestedResources.some(({ value }) => !Number.isSafeInteger(value) || value < 0)) {
    throw apiError(400, "validation_error", "Informe valores inteiros iguais ou maiores que zero.");
  }

  const eventIds = [];
  const updatedAt = now();
  const saveResources = database.transaction(() => {
    const currentCharacter = getCharacterOr404(character.id);
    const fields = parseFields(currentCharacter.fields_json);
    for (const resource of requestedResources) {
      const maximum = Number(fields[resource.maximum]);
      if (!Number.isSafeInteger(maximum) || maximum < 0 || resource.value > maximum) {
        throw apiError(400, "validation_error", `O valor de ${resource.label} não pode ultrapassar o máximo da ficha.`);
      }
    }

    const activeSession = currentCharacter.campaign_id && isCampaignMember(currentCharacter.campaign_id, request.user.id)
      ? database.prepare("SELECT id FROM game_sessions WHERE campaign_id = ? AND status = 'active'").get(currentCharacter.campaign_id)
      : null;
    const nextFields = { ...fields };
    for (const resource of requestedResources) {
      const before = Object.hasOwn(fields, resource.key) ? String(fields[resource.key]) : "—";
      const after = String(resource.value);
      if (before === after) continue;

      nextFields[resource.key] = after;
      if (activeSession) {
        const eventId = makeId();
        database.prepare(`
          INSERT INTO session_events (id, session_id, character_id, author_id, field_name, value_before, value_after, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(eventId, activeSession.id, currentCharacter.id, request.user.id, resource.label, before, after, updatedAt);
        eventIds.push(eventId);
      }
    }
    if (eventIds.length || requestedResources.some(({ key, value }) =>
      String(fields[key] ?? "—") !== String(value)
    )) {
      database.prepare("UPDATE characters SET fields_json = ?, updated_at = ? WHERE id = ?")
        .run(JSON.stringify(nextFields), updatedAt, currentCharacter.id);
    }
  });
  saveResources();

  const events = eventIds.map((eventId) => serializeEvent(database.prepare(`
    SELECT session_events.*, characters.name AS character_name, users.email AS author_email
    FROM session_events
    JOIN characters ON characters.id = session_events.character_id
    JOIN users ON users.id = session_events.author_id
    WHERE session_events.id = ?
  `).get(eventId)));
  response.json({ character: serializeCharacter(getCharacterOr404(character.id)), events });
}));

app.post("/api/campaigns/:id/sessions", requireUser, asyncRoute((request, response) => {
  requireCampaignMaster(request.params.id, request.user.id);
  const active = database.prepare("SELECT id FROM game_sessions WHERE campaign_id = ? AND status = 'active'").get(request.params.id);
  if (active) throw apiError(409, "session_already_active", "Esta campanha já possui uma sessão em andamento.");
  const id = makeId();
  database.prepare("INSERT INTO game_sessions (id, campaign_id, status, started_at) VALUES (?, ?, 'active', ?)")
    .run(id, request.params.id, now());
  response.status(201).json({ session: serializeGameSession(database.prepare("SELECT * FROM game_sessions WHERE id = ?").get(id)) });
}));

app.post("/api/sessions/:id/events", requireUser, asyncRoute((request, response) => {
  const session = database.prepare("SELECT * FROM game_sessions WHERE id = ?").get(request.params.id);
  if (!session) throw apiError(404, "not_found", "Sessão não encontrada.");
  requireCampaignMember(session.campaign_id, request.user.id);
  if (session.status !== "active") throw apiError(409, "session_finished", "A sessão não está em andamento.");
  const character = getCharacterOr404(request.body.characterId);
  if (character.owner_id !== request.user.id) throw apiError(403, "forbidden", "Você só pode alterar fichas próprias.");
  if (character.campaign_id !== session.campaign_id) throw apiError(400, "character_campaign_mismatch", "A ficha não pertence a esta campanha.");
  const field = bodyString(request.body, "field", 1, 80);
  const after = bodyString(request.body, "after", 1, 1000);
  const fields = parseFields(character.fields_json);
  const before = Object.hasOwn(fields, field) ? String(fields[field]) : "—";
  const id = makeId();
  const createdAt = now();
  const saveEvent = database.transaction(() => {
    database.prepare("UPDATE characters SET fields_json = ?, updated_at = ? WHERE id = ?")
      .run(JSON.stringify({ ...fields, [field]: after }), createdAt, character.id);
    database.prepare(`
      INSERT INTO session_events (id, session_id, character_id, author_id, field_name, value_before, value_after, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, session.id, character.id, request.user.id, field, before, after, createdAt);
  });
  saveEvent();
  response.status(201).json({
    event: serializeEvent(database.prepare(`
      SELECT session_events.*, characters.name AS character_name, users.email AS author_email
      FROM session_events
      JOIN characters ON characters.id = session_events.character_id
      JOIN users ON users.id = session_events.author_id
      WHERE session_events.id = ?
    `).get(id))
  });
}));

app.post("/api/sessions/:id/finish", requireUser, asyncRoute((request, response) => {
  const session = database.prepare("SELECT * FROM game_sessions WHERE id = ?").get(request.params.id);
  if (!session) throw apiError(404, "not_found", "Sessão não encontrada.");
  requireCampaignMaster(session.campaign_id, request.user.id);
  if (session.status !== "active") throw apiError(409, "session_finished", "Esta sessão já foi encerrada.");
  const masterSummary = typeof request.body.summary === "string" ? request.body.summary.trim() : "";
  if (!masterSummary) throw apiError(400, "session_summary_required", "Escreva um resumo antes de finalizar a sessão.");
  if (masterSummary.length > 10000) throw apiError(400, "validation_error", "O resumo pode ter no máximo 10.000 caracteres.");
  database.prepare("UPDATE game_sessions SET status = 'finished', ended_at = ?, master_summary = ? WHERE id = ? AND status = 'active'")
    .run(now(), masterSummary, session.id);
  response.json({ session: serializeGameSession(database.prepare("SELECT * FROM game_sessions WHERE id = ?").get(session.id)) });
}));

app.delete("/api/sessions/:id", requireUser, asyncRoute((request, response) => {
  const session = database.prepare("SELECT * FROM game_sessions WHERE id = ?").get(request.params.id);
  if (!session) throw apiError(404, "not_found", "Sessão não encontrada.");
  requireCampaignMaster(session.campaign_id, request.user.id);
  if (session.status !== "finished") {
    throw apiError(409, "session_not_finished", "Somente sessões finalizadas podem ser excluídas.");
  }
  database.prepare("DELETE FROM game_sessions WHERE id = ? AND status = 'finished'").run(session.id);
  response.status(204).end();
}));

app.delete("/api/sessions", requireUser, asyncRoute((request, response) => {
  const sessionIds = request.body && request.body.sessionIds;
  if (!Array.isArray(sessionIds) || sessionIds.length < 1 || sessionIds.length > 50
    || sessionIds.some((id) => typeof id !== "string" || !id.trim())
    || new Set(sessionIds).size !== sessionIds.length) {
    throw apiError(400, "validation_error", "Selecione de 1 a 50 sessões válidas, sem duplicatas.");
  }

  const deleteSessions = database.transaction((ids) => {
    const placeholders = ids.map(() => "?").join(", ");
    const sessions = database.prepare(`SELECT * FROM game_sessions WHERE id IN (${placeholders})`).all(...ids);
    if (sessions.length !== ids.length) throw apiError(404, "not_found", "Uma ou mais sessões não foram encontradas.");
    const campaignId = sessions[0].campaign_id;
    if (sessions.some((session) => session.campaign_id !== campaignId)) {
      throw apiError(400, "validation_error", "Selecione sessões da mesma campanha.");
    }
    requireCampaignMaster(campaignId, request.user.id);
    if (sessions.some((session) => session.status !== "finished")) {
      throw apiError(409, "session_not_finished", "Somente sessões finalizadas podem ser excluídas.");
    }
    database.prepare(`DELETE FROM game_sessions WHERE id IN (${placeholders}) AND status = 'finished'`).run(...ids);
  });
  deleteSessions(sessionIds);
  response.status(204).end();
}));

app.delete("/api/campaigns/:id/characters", requireUser, asyncRoute((request, response) => {
  const characterIds = request.body && request.body.characterIds;
  if (!Array.isArray(characterIds) || characterIds.length < 1 || characterIds.length > 50
    || characterIds.some((id) => typeof id !== "string" || !id.trim())
    || new Set(characterIds).size !== characterIds.length) {
    throw apiError(400, "validation_error", "Selecione de 1 a 50 agentes válidos, sem duplicatas.");
  }

  const unlinkCharacters = database.transaction((ids) => {
    const campaign = campaignMaster(request.params.id);
    if (!campaign) throw apiError(404, "not_found", "Campanha não encontrada.");
    const isMaster = campaign.owner_id === request.user.id;
    if (!isMaster) requireCampaignMember(request.params.id, request.user.id);

    const placeholders = ids.map(() => "?").join(", ");
    const characters = database.prepare(`SELECT id, campaign_id, owner_id FROM characters WHERE id IN (${placeholders})`).all(...ids);
    if (characters.length !== ids.length) {
      throw apiError(404, "not_found", "Um ou mais agentes não foram encontrados.");
    }
    if (characters.some((character) => character.campaign_id !== request.params.id)) {
      throw apiError(400, "validation_error", "Selecione agentes vinculados à mesma campanha.");
    }
    if (!isMaster && characters.some((character) => character.owner_id !== request.user.id)) {
      throw apiError(403, "forbidden", "Você só pode desvincular agentes próprios.");
    }

    const result = database.prepare(`
      UPDATE characters SET campaign_id = NULL, updated_at = ?
      WHERE id IN (${placeholders}) AND campaign_id = ?
    `).run(now(), ...ids, request.params.id);
    if (result.changes !== ids.length) {
      throw apiError(409, "character_unavailable", "Um ou mais agentes não podem ser removidos da campanha.");
    }
  });
  unlinkCharacters(characterIds);
  response.status(204).end();
}));

app.post("/api/tables", requireUser, asyncRoute((request, response) => {
  const title = bodyString(request.body, "title", 1, 100);
  const system = bodySystem(request.body);
  const description = bodyString(request.body, "description", 1, 3000);
  const schedule = bodyString(request.body, "schedule", 1, 120);
  const timezone = bodyString(request.body, "timezone", 1, 80);
  const seats = Number(request.body.seats);
  const startsAt = typeof request.body.startsAt === "string" ? new Date(request.body.startsAt) : null;
  const requirements = typeof request.body.requirements === "string" ? request.body.requirements.trim() : "";
  if (!Number.isInteger(seats) || seats < 1 || seats > 30) throw apiError(400, "validation_error", "Informe de 1 a 30 vagas.");
  if (!startsAt || Number.isNaN(startsAt.getTime())) throw apiError(400, "validation_error", "Informe uma data e horário válidos.");
  if (requirements.length > 2000) throw apiError(400, "validation_error", "Os requisitos podem ter no máximo 2.000 caracteres.");
  try {
    new Intl.DateTimeFormat("pt-BR", { timeZone: timezone });
  } catch {
    throw apiError(400, "validation_error", "Informe um fuso horário válido, como America/Sao_Paulo.");
  }
  const id = makeId();
  database.prepare(`
    INSERT INTO public_tables (id, owner_id, title, system, description, schedule, starts_at, timezone, seats, requirements, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)
  `).run(id, request.user.id, title, system, description, schedule, startsAt.toISOString(), timezone, seats, requirements, now());
  response.status(201).json({ table: getTableForUser(id, request.user) });
}));

app.get("/api/tables/:id", asyncRoute((request, response) => {
  response.json({ table: getTableForUser(request.params.id, request.user) });
}));

app.post("/api/tables/:id/applications", requireUser, asyncRoute((request, response) => {
  const table = database.prepare("SELECT * FROM public_tables WHERE id = ?").get(request.params.id);
  if (!table) throw apiError(404, "not_found", "Mesa não encontrada.");
  if (table.owner_id === request.user.id) throw apiError(403, "own_table", "Você não pode solicitar vaga na própria mesa.");
  checkApplicationOpen(table.id);
  const message = typeof request.body.message === "string" ? request.body.message.trim() : "";
  if (message.length > 1000) throw apiError(400, "validation_error", "A mensagem pode ter no máximo 1.000 caracteres.");
  const id = makeId();
  try {
    database.prepare(`
      INSERT INTO table_applications (id, table_id, user_id, message, status, created_at)
      VALUES (?, ?, ?, ?, 'pending', ?)
    `).run(id, table.id, request.user.id, message, now());
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") throw apiError(409, "already_applied", "Você já solicitou vaga nesta mesa.");
    throw error;
  }
  response.status(201).json({ table: getTableForUser(table.id, request.user) });
}));

app.patch("/api/applications/:id", requireUser, asyncRoute((request, response) => {
  const statusMap = { aceita: "accepted", recusada: "rejected", accepted: "accepted", rejected: "rejected" };
  const nextStatus = statusMap[request.body.status];
  if (!nextStatus) throw apiError(400, "validation_error", "Estado de inscrição inválido.");
  const application = database.prepare(`
    SELECT table_applications.*, public_tables.owner_id, public_tables.seats, public_tables.status AS table_status
    FROM table_applications JOIN public_tables ON public_tables.id = table_applications.table_id
    WHERE table_applications.id = ?
  `).get(request.params.id);
  if (!application || application.owner_id !== request.user.id) throw apiError(404, "not_found", "Inscrição não encontrada.");
  if (application.status !== "pending") throw apiError(409, "already_decided", "Esta inscrição já foi decidida.");
  const decide = database.transaction(() => {
    const current = database.prepare("SELECT COUNT(*) AS count FROM table_applications WHERE table_id = ? AND status = 'accepted'").get(application.table_id).count;
    if (nextStatus === "accepted" && (current >= application.seats || application.table_status !== "open")) {
      throw apiError(409, "table_full", "Não há vagas disponíveis para aceitar esta inscrição.");
    }
    database.prepare("UPDATE table_applications SET status = ?, decided_at = ? WHERE id = ? AND status = 'pending'")
      .run(nextStatus, now(), application.id);
    const after = current + (nextStatus === "accepted" ? 1 : 0);
    if (after >= application.seats) database.prepare("UPDATE public_tables SET status = 'full' WHERE id = ?").run(application.table_id);
  });
  decide();
  response.json({ table: getTableForUser(application.table_id, request.user) });
}));

app.post("/api/tables/:id/messages", requireUser, asyncRoute((request, response) => {
  const table = database.prepare("SELECT * FROM public_tables WHERE id = ?").get(request.params.id);
  if (!table) throw apiError(404, "not_found", "Mesa não encontrada.");
  const applicantId = table.owner_id === request.user.id ? request.body.applicantId : request.user.id;
  if (applicantId === request.user.id && table.owner_id === request.user.id) {
    throw apiError(400, "validation_error", "Selecione uma conversa para responder.");
  }
  if (table.owner_id !== request.user.id && table.status !== "open" && table.status !== "full") {
    throw apiError(409, "table_closed", "Esta mesa não está recebendo mensagens.");
  }
  const applicant = database.prepare("SELECT id FROM users WHERE id = ?").get(applicantId);
  if (!applicant || applicantId === table.owner_id) throw apiError(404, "not_found", "Conversa não encontrada.");
  const hasApplied = database.prepare("SELECT 1 FROM table_applications WHERE table_id = ? AND user_id = ?")
    .get(table.id, applicantId);
  if (!hasApplied) throw apiError(403, "application_required", "Solicite uma vaga antes de conversar com o mestre.");
  const text = bodyString(request.body, "text", 1, 2000);
  const id = makeId();
  database.prepare(`
    INSERT INTO table_messages (id, table_id, sender_id, applicant_id, body, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, table.id, request.user.id, applicantId, text, now());
  response.status(201).json({ table: getTableForUser(table.id, request.user) });
}));

app.patch("/api/tables/:id/status", requireUser, asyncRoute((request, response) => {
  const table = database.prepare("SELECT * FROM public_tables WHERE id = ?").get(request.params.id);
  if (!table || table.owner_id !== request.user.id) throw apiError(404, "not_found", "Mesa não encontrada.");
  if (request.body.status !== "closed") throw apiError(400, "validation_error", "Estado de mesa inválido.");
  if (!["open", "full"].includes(table.status)) throw apiError(409, "table_closed", "A mesa já está encerrada.");
  database.prepare("UPDATE public_tables SET status = 'closed' WHERE id = ?").run(table.id);
  response.json({ table: getTableForUser(table.id, request.user) });
}));

const frontendFiles = express.static(path.join(__dirname, ".."), {
  dotfiles: "deny",
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
  setHeaders(response, filePath) {
    if (filePath.endsWith(".html")) response.setHeader("Cache-Control", "no-store");
  }
});
app.get(["/", "/index.html", "/app.js", "/styles.css"], (request, response, next) => {
  frontendFiles(request, response, next);
});
app.use("/assets", express.static(path.join(__dirname, "..", "assets"), {
  dotfiles: "deny",
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "1h" : 0
}));
app.get("/vendor/supabase.js", (request, response, next) => {
  response.sendFile(path.join(__dirname, "..", "node_modules", "@supabase", "supabase-js", "dist", "umd", "supabase.js"), (error) => {
    if (error) next(error);
  });
});

app.use((request, response, next) => {
  if (request.path.startsWith("/api/")) return next(apiError(404, "not_found", "Rota da API não encontrada."));
  next();
});

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  if (error.type === "entity.parse.failed") {
    return response.status(400).json({ error: { code: "invalid_json", message: "O corpo da solicitação contém JSON inválido." } });
  }
  if (error.code && String(error.code).startsWith("SQLITE_CONSTRAINT")) {
    console.warn("A solicitação violou uma restrição de integridade.", error.code);
    return response.status(400).json({ error: { code: "constraint_violation", message: "Os dados não atendem às regras do sistema." } });
  }
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error("Erro não tratado na API.", error);
  response.status(status).json({
    error: {
      code: error.code || "internal_error",
      message: status >= 500 ? "Ocorreu um erro interno. Tente novamente." : error.message
    }
  });
});

module.exports = app;
