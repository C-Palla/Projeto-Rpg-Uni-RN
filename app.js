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
const authTabsContainer = document.querySelector(".auth-tabs");
const authTitle = document.querySelector("#auth-title");
const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const recoveryForm = document.querySelector("#recovery-form");
const resetPasswordForm = document.querySelector("#reset-password-form");
const loginMessage = document.querySelector("#login-message");
const signupMessage = document.querySelector("#signup-message");
const recoveryMessage = document.querySelector("#recovery-message");
const resetPasswordMessage = document.querySelector("#reset-password-message");
const forgotPasswordTrigger = document.querySelector("#forgot-password-trigger");
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
let data = { campaigns: [], characters: [], sessions: [], tables: [], galleryImages: [] };
let bootstrapError = "";
const supabaseConfig = window.MESA_SUPABASE_CONFIG || {};
const supabaseClient = supabaseConfig.url && supabaseConfig.publishableKey && window.supabase?.createClient
  ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.publishableKey)
  : null;
const systems = {
  dnd: { name: "D&D 5e", resource: "Espaços de magia", extra: "Classe" },
  tormenta: { name: "Tormenta20", resource: "PM", extra: "Raça" },
  ordem: { name: "Ordem Paranormal", resource: "PE", extra: "NEX" }
};
const orderAttributes = [
  { key: "FOR", name: "Força" },
  { key: "AGI", name: "Agilidade" },
  { key: "INT", name: "Intelecto" },
  { key: "VIG", name: "Vigor" },
  { key: "PRE", name: "Presença" }
];
const orderSkills = [
  ["Acrobacia", "AGI", false, true], ["Adestramento", "PRE", true, false],
  ["Artes", "PRE", true, false], ["Atletismo", "FOR", false, false],
  ["Atualidades", "INT", false, false], ["Ciências", "INT", true, false],
  ["Crime", "AGI", true, true], ["Diplomacia", "PRE", false, false],
  ["Enganação", "PRE", false, false], ["Fortitude", "VIG", false, false],
  ["Furtividade", "AGI", false, true], ["Iniciativa", "AGI", false, false],
  ["Intimidação", "PRE", false, false], ["Intuição", "PRE", false, false],
  ["Investigação", "INT", false, false], ["Luta", "FOR", false, false],
  ["Medicina", "INT", false, false], ["Ocultismo", "INT", true, false],
  ["Percepção", "PRE", false, false], ["Pilotagem", "AGI", true, false],
  ["Pontaria", "AGI", false, false], ["Profissão", "INT", true, false],
  ["Reflexos", "AGI", false, false], ["Religião", "PRE", true, false],
  ["Sobrevivência", "INT", false, false], ["Tática", "INT", true, false],
  ["Tecnologia", "INT", true, false], ["Vontade", "PRE", false, false]
].map(([name, attribute, trainedOnly, loadPenalty]) => ({ name, attribute, trainedOnly, loadPenalty }));
const orderDamageTypes = [
  "Balístico", "Conhecimento", "Corte", "Eletricidade", "Energia", "Fogo", "Frio",
  "Impacto", "Medo", "Mental", "Morte", "Perfuração", "Sangue", "Químico"
];
const orderClasses = {
  combatente: { name: "Combatente", pv: 20, pvPerNex: 4, pe: 2, pePerNex: 2, san: 12, sanPerNex: 3, skillCount: 1 },
  especialista: { name: "Especialista", pv: 16, pvPerNex: 3, pe: 3, pePerNex: 3, san: 16, sanPerNex: 4, skillCount: 7 },
  ocultista: { name: "Ocultista", pv: 12, pvPerNex: 2, pe: 4, pePerNex: 4, san: 20, sanPerNex: 5, skillCount: 3 }
};
const orderOriginCatalog = [
  {
    name: "Acadêmico", skills: ["Ciências", "Investigação"],
    description: "Pesquisas ou aulas sobre temas misteriosos levaram você ao conhecimento da Ordo Realitas.",
    power: "Saber é Poder",
    powerNotes: "Ao testar uma habilidade baseada em Intelecto, você pode gastar 2 PE para receber +5 no teste."
  },
  {
    name: "Agente de Saúde", skills: ["Intuição", "Medicina"],
    description: "Sua experiência cuidando de pessoas, em uma profissão de saúde, chamou a atenção da Ordem durante um caso paranormal.",
    power: "Técnica Medicinal",
    powerNotes: "Ao curar alguém, some seu Intelecto aos PV recuperados."
  },
  {
    name: "Amnésico", skills: [], choiceCount: 2,
    description: "Sem lembranças claras do passado, você encontrou na Ordem sua família e uma possível pista sobre a própria história.",
    power: "Vislumbres do Passado",
    powerNotes: "Uma vez por sessão, teste Intelecto (DT 10) para reconhecer alguém ou algum lugar familiar. Com sucesso, recebe 1d4 PE temporários e pode obter uma informação útil, a critério do mestre."
  },
  {
    name: "Artista", skills: ["Artes", "Enganação"],
    description: "Sua carreira criativa pode ter nascido de um encontro com o paranormal, mesmo que o público desconheça essa influência.",
    power: "Magnum Opus",
    powerNotes: "Uma vez por missão, alguém pode reconhecer sua obra durante uma interação. Contra essa pessoa, recebe +5 em testes de Presença e perícias baseadas nela; o mestre pode aplicar o bônus em outras situações de reconhecimento."
  },
  {
    name: "Atleta", skills: ["Acrobacia", "Atletismo"],
    description: "A competição e o alto desempenho marcaram sua vida antes de um evento paranormal aproximá-lo da Ordem.",
    power: "110%",
    powerNotes: "Em testes de perícia baseados em Força ou Agilidade, exceto Luta e Pontaria, gaste 2 PE para receber +5."
  },
  {
    name: "Chef", skills: ["Fortitude", "Profissão"], skillDisplay: "Fortitude · Profissão (cozinheiro)",
    description: "Cozinhar, profissionalmente ou para pessoas próximas, tornou-se uma forma inesperada de apoiar os agentes.",
    power: "Ingrediente Secreto",
    powerNotes: "Durante um interlúdio, ao cozinhar com a ação alimentar-se, você e os aliados que também a usaram recebem os benefícios de dois pratos. Benefícios iguais se acumulam."
  },
  {
    name: "Cientista Forense", skills: ["Ciências", "Investigação"],
    description: "Seu trabalho técnico na coleta e análise de evidências passou a investigar crimes ligados ao paranormal.",
    power: "Investigação Científica",
    powerNotes: "Uma vez por cena de investigação, use uma ação livre para procurar pistas com Ciências no lugar da perícia normalmente exigida."
  },
  {
    name: "Criminoso", skills: ["Crime", "Furtividade"],
    description: "A Ordem preferiu aproveitar suas habilidades fora da lei depois que você se envolveu com um caso paranormal.",
    power: "O Crime Compensa",
    powerNotes: "Ao fim de uma missão, escolha um item encontrado nela. Na missão seguinte, leve-o sem contar no limite de itens por patente."
  },
  {
    name: "Cultista Arrependido", skills: ["Ocultismo", "Religião"],
    description: "Você abandonou um culto paranormal e agora luta ao lado da Ordem, embora ainda precise conquistar a confiança de outros agentes.",
    power: "Traços do Outro Lado",
    powerNotes: "Escolha um poder paranormal. Sua Sanidade inicial é reduzida à metade do valor normal da classe."
  },
  {
    name: "Desgarrado", skills: ["Fortitude", "Sobrevivência"],
    description: "Uma vida à margem da rotina e dos confortos modernos, por escolha ou necessidade, preparou você para sobreviver.",
    power: "Calejado",
    powerNotes: "Recebe +1 PV para cada 5% de NEX."
  },
  {
    name: "Dublê", skills: ["Pilotagem", "Reflexos"],
    description: "A busca por adrenalina e por manobras arriscadas fez da exposição ao perigo parte do seu ofício.",
    power: "Destemido",
    powerNotes: "Recebe +5 em testes de perícia cuja falha causaria diretamente dano ou uma condição negativa."
  },
  {
    name: "Engenheiro", skills: ["Profissão", "Tecnologia"],
    description: "Você prefere construir e testar soluções práticas; uma invenção ligada ao paranormal pode ter atraído a Ordem.",
    power: "Ferramentas Favoritas",
    powerNotes: "Escolha um item que não seja arma. Para você, ele conta como uma categoria abaixo."
  },
  {
    name: "Escritor", skills: ["Artes", "Atualidades"],
    description: "As histórias que você criava se cruzaram com o paranormal; agora, você tenta impedir que a realidade tenha um final trágico.",
    power: "Bagagem de Leitura",
    powerNotes: "Uma vez por cena, gaste 2 PE para se tornar treinado em uma perícia à escolha até o fim da cena."
  },
  {
    name: "Executivo", skills: ["Diplomacia", "Profissão"],
    description: "Uma carreira corporativa aparentemente comum revelou segredos paranormais e levou você das rotinas de escritório às missões.",
    power: "Processo Otimizado",
    powerNotes: "Em um teste de perícia de teste estendido ou ao revisar documentos físicos ou digitais, gaste 2 PE para receber +5."
  },
  {
    name: "Gaudério Abutre", skills: ["Luta", "Pilotagem"],
    description: "Você fez parte dos Gaudérios Abutres e mantém a lealdade e o companheirismo do motoclube.",
    power: "Fraternidade Gaudéria",
    powerNotes: "Uma vez por rodada, quando um aliado adjacente for alvo de ataque ou efeito, gaste 1 PE para trocar de lugar com ele e virar o alvo. No seu próximo turno, recebe +2 em ataques contra o agressor."
  },
  {
    name: "Ginasta", skills: ["Acrobacia", "Reflexos"],
    description: "Anos de treino exigente desenvolveram seu corpo, sua técnica e sua disciplina para enfrentar o Outro Lado.",
    power: "Mobilidade Acrobática",
    powerNotes: "Recebe +2 na Defesa e aumenta seu deslocamento em 3 m."
  },
  {
    name: "Investigador", skills: ["Investigação", "Percepção"],
    description: "Sua experiência investigando casos, para o governo ou por conta própria, ajudou a Ordem a resolver mistérios.",
    power: "Faro para Pistas",
    powerNotes: "Uma vez por cena, ao procurar pistas, gaste 1 PE para receber +5 no teste."
  },
  {
    name: "Jornalista", skills: ["Atualidades", "Investigação"],
    description: "Sua busca por notícias revelou um caso paranormal; agora você procura a verdade para proteger as pessoas.",
    power: "Fontes Confiáveis",
    powerNotes: "Uma vez por sessão, gaste 1 PE para repetir um teste já feito para encontrar pistas, com +5, ou obter outra informação relevante a critério do mestre."
  },
  {
    name: "Lutador", skills: ["Luta", "Reflexos"],
    description: "A prática de artes marciais, esportes de luta ou brigas de rua fez do combate parte da sua trajetória.",
    power: "Mão Pesada",
    powerNotes: "Recebe +2 nas rolagens de dano de ataques corpo a corpo."
  },
  {
    name: "Magnata", skills: ["Diplomacia", "Pilotagem"],
    description: "Uma grande fortuna, herdada ou conquistada, permite que você apoie a luta contra o paranormal.",
    power: "Patrocinador da Ordem",
    powerNotes: "Seu limite de crédito é tratado como uma categoria acima do atual."
  },
  {
    name: "Mercenário", skills: ["Iniciativa", "Intimidação"],
    description: "Trabalhos militares de aluguel colocaram você em contato com situações paranormais.",
    power: "Posição de Combate",
    powerNotes: "No primeiro turno de cada cena de ação, gaste 2 PE para receber uma ação de movimento adicional."
  },
  {
    name: "Militar", skills: ["Pontaria", "Tática"],
    description: "O treinamento e a experiência em uma força militar prepararam você para missões e armas de fogo.",
    power: "Para Bellum",
    powerNotes: "Recebe +2 nas rolagens de dano com armas de fogo."
  },
  {
    name: "Operário", skills: ["Fortitude", "Profissão"],
    description: "O trabalho prático e braçal deu a você uma visão direta do mundo, até que o paranormal rompeu sua rotina.",
    power: "Ferramenta de Trabalho",
    powerNotes: "Escolha, com aprovação do mestre, uma arma simples ou tática que também sirva como ferramenta do seu ofício. Você sabe usá-la e recebe +1 em ataques, dano e margem de ameaça com ela."
  },
  {
    name: "Policial", skills: ["Percepção", "Pontaria"],
    description: "Uma ocorrência paranormal durante seu serviço em uma força de segurança levou você à Ordem.",
    power: "Patrulha",
    powerNotes: "Recebe +2 na Defesa."
  },
  {
    name: "Professor", skills: ["Ciências", "Intuição"],
    description: "Sua experiência ensinando e lidando com pessoas agora serve para preparar agentes contra ameaças do Outro Lado.",
    power: "Aula de Campo",
    powerNotes: "Uma vez por cena, use uma ação padrão e gaste 2 PE para dar +1 em um atributo de outro personagem em alcance curto até o fim da cena."
  },
  {
    name: "Religioso", skills: ["Religião", "Vontade"],
    description: "Sua fé e dedicação ao cuidado espiritual de outras pessoas abriram caminho para seu contato com o paranormal.",
    power: "Acalentar",
    powerNotes: "Recebe +5 em testes de Religião para acalmar. Quando acalma alguém, essa pessoa recupera Sanidade igual a 1d6 + sua Presença."
  },
  {
    name: "Revoltado", skills: ["Furtividade", "Vontade"],
    description: "Uma perda ou experiência marcante fez você aprender a depender de si e lutar para que outros não passem pelo mesmo.",
    power: "Antes Só",
    powerNotes: "Sem aliados em alcance curto, recebe +1 na Defesa, nos testes de perícia e no limite de PE por turno."
  },
  {
    name: "Servidor Público", skills: ["Intuição", "Vontade"],
    description: "Seu trabalho em um órgão público revelou que até representantes da comunidade podem estar ligados ao paranormal.",
    power: "Espírito Cívico",
    powerNotes: "Ao fazer um teste para ajudar, gaste 1 PE para aumentar em +2 o bônus concedido."
  },
  {
    name: "Teórico da Conspiração", skills: ["Investigação", "Ocultismo"],
    description: "Investigações sobre teorias conspiratórias acabaram revelando ameaças reais do paranormal à Ordem.",
    power: "Eu Já Sabia",
    powerNotes: "Recebe resistência a dano mental igual ao seu Intelecto."
  },
  {
    name: "T.I.", skills: ["Investigação", "Tecnologia"],
    description: "Sua experiência com computadores e sistemas chamou a atenção da Ordem.",
    power: "Motor de Busca",
    powerNotes: "Com acesso à internet e autorização do mestre, gaste 2 PE para substituir um teste de perícia por Tecnologia."
  },
  {
    name: "Trabalhador Rural", skills: ["Adestramento", "Sobrevivência"],
    description: "O trabalho no campo ou em áreas isoladas aproximou você da natureza e de histórias que se provaram verdadeiras.",
    power: "Desbravador",
    powerNotes: "Ao testar Adestramento ou Sobrevivência, gaste 2 PE para receber +5. Você também ignora penalidades de deslocamento por terreno difícil."
  },
  {
    name: "Trambiqueiro", skills: ["Crime", "Enganação"],
    description: "Depois de viver de golpes e falcatruas, você passou a usar sua lábia a serviço da Ordem.",
    power: "Impostor",
    powerNotes: "Uma vez por cena, gaste 2 PE para substituir um teste de perícia por Enganação."
  },
  {
    name: "Universitário", skills: ["Atualidades", "Investigação"],
    description: "Um achado paranormal interrompeu sua rotina de estudos e colocou você em uma formação muito mais perigosa.",
    power: "Dedicação",
    powerNotes: "Recebe +1 PE e mais 1 PE a cada NEX ímpar (15%, 25% etc.). Seu limite de PE por turno também aumenta em 1; isso não altera a DT dos efeitos."
  },
  {
    name: "Vítima", skills: ["Reflexos", "Vontade"],
    description: "Um encontro traumático com o paranormal levou você a lutar para proteger outras pessoas de passar pela mesma experiência.",
    power: "Cicatrizes Psicológicas",
    powerNotes: "Recebe +1 Sanidade para cada 5% de NEX."
  }
].map((origin) => ({ ...origin, source: "Livro básico" }));

function currentUser() {
  return activeUser;
}

function supabaseFailure(error, fallback) {
  if (!error) return;
  const friendlyMessages = {
    "Invalid login credentials": "Email ou senha inválidos.",
    user_not_found: "Crie uma conta para este email antes de adicioná-lo.",
    campaign_not_available: "Campanha não encontrada ou sem permissão para alterá-la.",
    session_summary_required: "Escreva um resumo antes de finalizar a sessão.",
    session_not_finished: "Somente sessões finalizadas podem ser excluídas.",
    session_not_available: "Sessão não encontrada ou sem permissão para excluí-la.",
    invalid_character_selection: "Selecione de 1 a 50 agentes válidos, sem duplicatas.",
    character_not_in_campaign: "Um ou mais agentes já não estão vinculados a esta campanha.",
    character_not_owned: "Você só pode desvincular fichas próprias.",
    campaign_character_limit: "Você pode ter apenas um agente próprio por campanha. Desvincule o atual para adicionar outro.",
    invalid_character_resources: "Informe valores válidos, dentro dos limites máximos da ficha.",
    character_resources_not_supported: "A edição desses recursos está disponível apenas para fichas de Ordem Paranormal.",
    table_full: "Não há vagas disponíveis nesta mesa.",
    application_already_decided: "Esta inscrição já foi decidida."
  };
  throw new Error(friendlyMessages[error.message] || error.message || fallback);
}

function requireSupabase() {
  if (!supabaseClient) {
    throw new Error("Configure a Project URL e a publishable key do Supabase no arquivo .env e reinicie o servidor.");
  }
  return supabaseClient;
}

async function supabaseRows(query, fallback) {
  const { data: rows, error } = await query;
  supabaseFailure(error, fallback);
  return rows || [];
}

async function apiRequest(path, options = {}) {
  const client = requireSupabase();
  const method = options.method || "GET";
  const body = options.body ? JSON.parse(options.body) : {};

  if (path === "/auth/login" && method === "POST") {
    const { data: result, error } = await client.auth.signInWithPassword(body);
    supabaseFailure(error, "Não foi possível entrar.");
    return result;
  }
  if (path === "/auth/register" && method === "POST") {
    const { data: result, error } = await client.auth.signUp({
      email: body.email,
      password: body.password,
      options: { data: { display_name: body.name } }
    });
    supabaseFailure(error, "Não foi possível criar a conta.");
    return result;
  }
  if (path === "/auth/recover" && method === "POST") {
    const { error } = await client.auth.resetPasswordForEmail(body.email, {
      redirectTo: new URL("./", location.href).href
    });
    supabaseFailure(error, "Não foi possível enviar o email de recuperação.");
    return null;
  }
  if (path === "/auth/update-password" && method === "POST") {
    const { data: result, error } = await client.auth.updateUser({ password: body.password });
    supabaseFailure(error, "Não foi possível atualizar a senha.");
    return result;
  }
  if (path === "/auth/logout" && method === "POST") {
    const { error } = await client.auth.signOut();
    supabaseFailure(error, "Não foi possível sair da conta.");
    return null;
  }
  const { data: verifiedUser, error: userError } = await client.auth.getUser();
  supabaseFailure(userError, "Sua sessão expirou. Entre novamente.");
  const user = verifiedUser.user;
  if (!user) throw new Error("Entre na sua conta para continuar.");

  if (path === "/campaigns" && method === "POST") {
    const { data: campaignId, error } = await client.rpc("create_campaign", {
      campaign_name: body.name,
      campaign_system: body.system,
      campaign_description: body.description
    });
    supabaseFailure(error, "Não foi possível criar a campanha.");
    return { campaign: { id: campaignId } };
  }
  const campaignCharactersMatch = path.match(/^\/campaigns\/([^/]+)\/characters$/);
  if (campaignCharactersMatch && method === "DELETE") {
    const { error } = await client.rpc("unlink_campaign_characters", {
      target_campaign: campaignCharactersMatch[1],
      target_characters: body.characterIds
    });
    supabaseFailure(error, "Não foi possível desvincular os agentes da campanha.");
    return null;
  }
  const campaignMatch = path.match(/^\/campaigns\/([^/]+)$/);
  if (campaignMatch && method === "DELETE") {
    const { data: campaign, error } = await client.from("campaigns")
      .delete()
      .eq("id", campaignMatch[1])
      .select("id")
      .maybeSingle();
    supabaseFailure(error, "Não foi possível excluir a campanha.");
    if (!campaign) throw new Error("Somente o mestre pode excluir esta campanha.");
    return { campaign };
  }
  const inviteMatch = path.match(/^\/campaigns\/([^/]+)\/members$/);
  if (inviteMatch && method === "POST") {
    const { error } = await client.rpc("invite_campaign_member", {
      target_campaign: inviteMatch[1],
      invited_email: body.email
    });
    supabaseFailure(error, "Não foi possível adicionar esse participante.");
    return null;
  }
  const resourceMatch = path.match(/^\/characters\/([^/]+)\/resources$/);
  if (resourceMatch && method === "PATCH") {
    const { error } = await client.rpc("update_character_resources", {
      target_character: resourceMatch[1],
      new_hp: body.hp,
      new_pe: body.pe,
      new_san: body.san
    });
    supabaseFailure(error, "Não foi possível salvar os recursos da ficha.");
    return null;
  }
  const characterCampaignMatch = path.match(/^\/characters\/([^/]+)\/campaign$/);
  if (characterCampaignMatch && method === "PATCH") {
    if (typeof body.campaignId !== "string" || !body.campaignId) {
      throw new Error("Selecione uma campanha para vincular a ficha.");
    }
    const { data: character, error: characterError } = await client.from("characters")
      .select("owner_id,campaign_id,system")
      .eq("id", characterCampaignMatch[1])
      .maybeSingle();
    supabaseFailure(characterError, "Não foi possível carregar a ficha.");
    if (!character) throw new Error("Ficha não encontrada.");
    if (character.owner_id !== user.id) throw new Error("Você só pode vincular fichas próprias.");
    if (character.campaign_id) throw new Error("Esta ficha já está vinculada a uma campanha.");

    const { data: campaign, error: campaignError } = await client.from("campaigns")
      .select("system")
      .eq("id", body.campaignId)
      .maybeSingle();
    supabaseFailure(campaignError, "Não foi possível carregar a campanha.");
    if (!campaign) throw new Error("Campanha não encontrada ou sem permissão para acessá-la.");
    if (campaign.system !== character.system) throw new Error("A ficha deve usar o sistema da campanha.");

    const { data: linkedCharacter, error: linkError } = await client.from("characters")
      .update({ campaign_id: body.campaignId })
      .eq("id", characterCampaignMatch[1])
      .eq("owner_id", user.id)
      .is("campaign_id", null)
      .select()
      .single();
    supabaseFailure(linkError, "Não foi possível vincular a ficha à campanha.");
    return { character: linkedCharacter };
  }
  const characterMatch = path.match(/^\/characters(?:\/([^/]+))?$/);
  if (characterMatch && ["POST", "PATCH"].includes(method)) {
    const values = {
      owner_id: user.id,
      campaign_id: body.campaignId || null,
      name: body.name,
      system: body.system,
      fields: body.fields,
      notes: body.notes
    };
    const query = characterMatch[1]
      ? client.from("characters").update(values).eq("id", characterMatch[1])
      : client.from("characters").insert(values);
    const { data: character, error } = await query.select().single();
    supabaseFailure(error, "Não foi possível salvar a ficha.");
    return { character };
  }
  const startSessionMatch = path.match(/^\/campaigns\/([^/]+)\/sessions$/);
  if (startSessionMatch && method === "POST") {
    const { data: session, error } = await client.from("game_sessions").insert({
      campaign_id: startSessionMatch[1],
      status: "active"
    }).select().single();
    supabaseFailure(error, "Não foi possível iniciar a sessão.");
    return { session };
  }
  const finishMatch = path.match(/^\/sessions\/([^/]+)\/finish$/);
  if (finishMatch && method === "POST") {
    if (typeof body.summary !== "string" || !body.summary.trim()) {
      throw new Error("Escreva um resumo antes de finalizar a sessão.");
    }
    const { data: session, error } = await client.from("game_sessions").update({
      status: "finished",
      ended_at: new Date().toISOString(),
      master_summary: body.summary.trim()
    }).eq("id", finishMatch[1]).eq("status", "active").select().single();
    supabaseFailure(error, "Não foi possível finalizar a sessão.");
    return { session };
  }
  const deleteSessionMatch = path.match(/^\/sessions\/([^/]+)$/);
  if (deleteSessionMatch && method === "DELETE") {
    const { error } = await client.rpc("delete_finished_session", {
      target_session: deleteSessionMatch[1]
    });
    supabaseFailure(error, "Não foi possível excluir a sessão.");
    return null;
  }
  if (path === "/sessions" && method === "DELETE") {
    const { error } = await client.rpc("delete_finished_sessions", {
      target_sessions: body.sessionIds
    });
    supabaseFailure(error, "Não foi possível excluir as sessões.");
    return null;
  }
  if (path === "/tables" && method === "POST") {
    const { data: table, error } = await client.from("public_tables").insert({
      owner_id: user.id,
      title: body.title,
      system: body.system,
      description: body.description,
      schedule: body.schedule,
      starts_at: body.startsAt,
      timezone: body.timezone,
      seats: body.seats,
      requirements: body.requirements
    }).select().single();
    supabaseFailure(error, "Não foi possível publicar a mesa.");
    return { table };
  }
  const applicationMatch = path.match(/^\/tables\/([^/]+)\/applications$/);
  if (applicationMatch && method === "POST") {
    const { error } = await client.from("table_applications").insert({
      table_id: applicationMatch[1],
      user_id: user.id,
      message: body.message
    });
    supabaseFailure(error, "Não foi possível solicitar uma vaga.");
    return null;
  }
  const decisionMatch = path.match(/^\/applications\/([^/]+)$/);
  if (decisionMatch && method === "PATCH") {
    const { error } = await client.rpc("decide_table_application", {
      target_application: decisionMatch[1],
      decision: body.status
    });
    supabaseFailure(error, "Não foi possível atualizar a inscrição.");
    return null;
  }
  const messageMatch = path.match(/^\/tables\/([^/]+)\/messages$/);
  if (messageMatch && method === "POST") {
    const table = data.tables.find((entry) => entry.id === messageMatch[1]);
    if (!table) throw new Error("Mesa não encontrada.");
    const applicantId = table.owner === user.id ? body.applicantId : user.id;
    if (!applicantId) throw new Error("Selecione uma conversa para responder.");
    const { error } = await client.from("table_messages").insert({
      table_id: messageMatch[1],
      sender_id: user.id,
      applicant_id: applicantId,
      body: body.text
    });
    supabaseFailure(error, "Não foi possível enviar a mensagem.");
    return null;
  }
  const closeTableMatch = path.match(/^\/tables\/([^/]+)\/status$/);
  if (closeTableMatch && method === "PATCH" && body.status === "closed") {
    const { error } = await client.from("public_tables").update({ status: "closed" })
      .eq("id", closeTableMatch[1]);
    supabaseFailure(error, "Não foi possível encerrar as inscrições.");
    return null;
  }
  throw new Error("Operação não suportada pela integração Supabase.");
}

async function refreshBootstrap() {
  const client = requireSupabase();
  const { data: sessionResult, error: sessionError } = await client.auth.getSession();
  supabaseFailure(sessionError, "Não foi possível verificar a sessão.");
  const authUser = sessionResult.session?.user || null;
  const userId = authUser?.id;

  const tableQuery = client.from("public_tables").select("*").order("created_at", { ascending: false });
  const [
    campaignRows,
    membershipRows,
    characterRows,
    sessionRows,
    eventRows,
    tableRows,
    applicationRows,
    messageRows,
    profileRows
  ] = await Promise.all([
    userId ? supabaseRows(client.from("campaigns").select("*").order("created_at", { ascending: false }), "Não foi possível carregar as campanhas.") : [],
    userId ? supabaseRows(client.from("campaign_members").select("*"), "Não foi possível carregar os participantes.") : [],
    userId ? supabaseRows(client.from("characters").select("*").order("created_at", { ascending: false }), "Não foi possível carregar as fichas.") : [],
    userId ? supabaseRows(client.from("game_sessions").select("*").order("started_at", { ascending: false }), "Não foi possível carregar as sessões.") : [],
    userId ? supabaseRows(client.from("session_events").select("*").order("created_at"), "Não foi possível carregar o histórico.") : [],
    supabaseRows(tableQuery, "Não foi possível carregar as mesas públicas."),
    userId ? supabaseRows(client.from("table_applications").select("*").order("created_at"), "Não foi possível carregar as inscrições.") : [],
    userId ? supabaseRows(client.from("table_messages").select("*").order("created_at"), "Não foi possível carregar as conversas.") : [],
    userId ? supabaseRows(client.from("profiles").select("id,display_name"), "Não foi possível carregar os perfis.") : []
  ]);
  const attachedImageIds = [...new Set(characterRows
    .flatMap((character) => Array.isArray(character.fields?.Ataques)
      ? character.fields.Ataques.map((attack) => attack && typeof attack === "object" ? attack.imageId : null)
      : [])
    .filter((id) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)))];
  const [ownedImageRows, attachedImageRows] = userId ? await Promise.all([
    supabaseRows(client.from("character_gallery_images").select("id,owner_id,storage_path,filename,content_type")
      .eq("owner_id", userId).order("created_at", { ascending: false }), "Não foi possível carregar sua galeria."),
    attachedImageIds.length
      ? supabaseRows(client.from("character_gallery_images").select("id,owner_id,storage_path,filename,content_type")
        .in("id", attachedImageIds), "Não foi possível carregar imagens anexadas às fichas.")
      : []
  ]) : [[], []];
  const imageRows = new Map([...ownedImageRows, ...attachedImageRows].map((image) => [image.id, image]));
  const galleryImages = await Promise.all([...imageRows.values()].map(async (image) => {
    const { data: signedImage, error } = await client.storage.from("character-gallery")
      .createSignedUrl(image.storage_path, 3600);
    return {
      id: image.id,
      owner: image.owner_id,
      storagePath: image.storage_path,
      filename: image.filename,
      contentType: image.content_type,
      url: signedImage?.signedUrl || "",
      error: error?.message || ""
    };
  }));
  const profiles = new Map(profileRows.map((profile) => [profile.id, profile.display_name]));
  const sessionNumbers = new Map();
  const sessionCounts = new Map();
  [...sessionRows]
    .sort((left, right) => left.campaign_id.localeCompare(right.campaign_id)
      || new Date(left.started_at) - new Date(right.started_at)
      || left.id.localeCompare(right.id))
    .forEach((session) => {
      const number = (sessionCounts.get(session.campaign_id) || 0) + 1;
      sessionCounts.set(session.campaign_id, number);
      sessionNumbers.set(session.id, number);
    });
  const eventCharacterIds = new Set(eventRows.map((event) => event.character_id));
  const characterNames = new Map(characterRows
    .filter((character) => eventCharacterIds.has(character.id))
    .map((character) => [character.id, character.name]));

  activeUser = authUser ? {
    id: authUser.id,
    name: profiles.get(authUser.id) || authUser.user_metadata?.display_name || authUser.email,
    email: authUser.email || ""
  } : null;
  const campaignIds = new Set(campaignRows.map((campaign) => campaign.id));
  data = {
    campaigns: campaignRows.map((campaign) => {
      const members = membershipRows.filter((member) => member.campaign_id === campaign.id)
        .map((member) => ({
          id: member.user_id,
          name: profiles.get(member.user_id) || "Aventureiro",
          email: member.user_id === userId ? authUser.email || "" : "",
          role: member.role
        }));
      return {
        id: campaign.id,
        owner: campaign.owner_id,
        name: campaign.name,
        system: campaign.system,
        description: campaign.description,
        participants: members.map((member) => member.id),
        members,
        createdAt: campaign.created_at,
        isMaster: campaign.owner_id === userId
      };
    }),
    characters: characterRows.map((character) => ({
      id: character.id,
      owner: character.owner_id,
      campaignId: character.campaign_id,
      name: character.name,
      system: character.system,
      fields: character.fields,
      notes: character.notes,
      createdAt: character.created_at,
      updatedAt: character.updated_at
    })),
    galleryImages,
    sessions: sessionRows.filter((session) => campaignIds.has(session.campaign_id)).map((session) => ({
      id: session.id,
      campaignId: session.campaign_id,
      sessionNumber: sessionNumbers.get(session.id),
      status: session.status,
      startedAt: session.started_at,
      endedAt: session.ended_at,
      masterSummary: session.master_summary,
      events: eventRows.filter((event) => event.session_id === session.id).map((event) => ({
        id: event.id,
        characterId: event.character_id,
        characterName: characterNames.get(event.character_id) || "Personagem",
        author: profiles.get(event.author_id) || "Aventureiro",
        field: event.field_name,
        before: event.value_before,
        after: event.value_after,
        createdAt: event.created_at
      }))
    })),
    tables: await Promise.all(tableRows.map(async (table) => {
      const tableApplications = applicationRows.filter((application) => application.table_id === table.id);
      const { data: count, error } = await client.rpc("accepted_application_count", { target_table: table.id });
      supabaseFailure(error, "Não foi possível carregar a quantidade de vagas.");
      return {
        id: table.id,
        title: table.title,
        system: table.system,
        description: table.description,
        schedule: table.schedule,
        startsAt: table.starts_at,
        timezone: table.timezone,
        seats: table.seats,
        requirements: table.requirements,
        owner: table.owner_id,
        masterName: profiles.get(table.owner_id) || "Mestre",
        status: table.status,
        acceptedCount: Number(count || 0),
        availableSeats: Math.max(0, table.seats - Number(count || 0)),
        applications: table.owner_id === userId ? tableApplications.map((application) => ({
          id: application.id,
          userName: profiles.get(application.user_id) || "Aventureiro",
          userId: application.user_id,
          tableTitle: table.title,
          message: application.message,
          status: application.status,
          createdAt: application.created_at,
          decidedAt: application.decided_at
        })) : [],
        myApplication: tableApplications.find((application) => application.user_id === userId) ? (() => {
          const application = tableApplications.find((entry) => entry.user_id === userId);
          return {
            id: application.id,
            status: application.status,
            message: application.message,
            createdAt: application.created_at
          };
        })() : null,
        messages: messageRows.filter((message) => message.table_id === table.id).map((message) => ({
          id: message.id,
          from: message.sender_id,
          fromName: profiles.get(message.sender_id) || "Aventureiro",
          applicantId: message.applicant_id,
          text: message.body,
          createdAt: message.created_at
        }))
      };
    }))
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
  return Boolean(user && campaign && campaign.participants.includes(user.id));
}

function canManageCampaign(campaign) {
  const user = currentUser();
  return Boolean(user && campaign && campaign.owner === user.id);
}

function canAddCharacterToCampaign(character, campaign) {
  const user = currentUser();
  return Boolean(user && canAccessCampaign(campaign)
    && (canManageCampaign(campaign) || !data.characters.some((entry) =>
      entry.id !== character?.id && entry.owner === user.id && entry.campaignId === campaign.id
    )));
}

function availableCharacterCampaigns(character, system) {
  return data.campaigns.filter((campaign) => canAccessCampaign(campaign)
    && campaign.system === system
    && (campaign.id === character?.campaignId || canAddCharacterToCampaign(character, campaign)));
}

function getCampaignSessionNumber(session) {
  if (Number.isSafeInteger(session.sessionNumber)) return session.sessionNumber;
  const orderedSessions = data.sessions
    .filter((entry) => entry.campaignId === session.campaignId)
    .sort((left, right) => new Date(left.startedAt) - new Date(right.startedAt)
      || left.id.localeCompare(right.id));
  return orderedSessions.findIndex((entry) => entry.id === session.id) + 1;
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
  const activeView = ["login", "signup", "recovery", "reset-password"].includes(view) ? view : "login";
  const isLogin = activeView === "login";
  const isSignup = activeView === "signup";
  const isRecovery = activeView === "recovery";
  const isResetPassword = activeView === "reset-password";
  const forms = {
    login: loginForm,
    signup: signupForm,
    recovery: recoveryForm,
    "reset-password": resetPasswordForm
  };
  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authView === activeView;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  authTabsContainer.classList.toggle("hidden", !isLogin && !isSignup);
  Object.entries(forms).forEach(([name, form]) => form.classList.toggle("hidden", name !== activeView));
  authTitle.textContent = isLogin
    ? "Entre na sua mesa"
    : isSignup
      ? "Crie sua conta"
      : isRecovery
        ? "Recupere sua senha"
        : "Escolha uma nova senha";
  [loginMessage, signupMessage, recoveryMessage, resetPasswordMessage].forEach((message) => {
    message.textContent = "";
    message.classList.remove("is-error");
  });
  forms[activeView].querySelector("input")?.focus();
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

function handlePasswordRecovery(event) {
  event.preventDefault();
  const email = recoveryForm.elements.email.value.trim();
  apiRequest("/auth/recover", {
    method: "POST",
    body: JSON.stringify({ email })
  }).then(() => {
    recoveryForm.reset();
    setAuthMessage(recoveryMessage, "Se o email estiver cadastrado, enviaremos um link para criar uma nova senha.");
  }).catch((error) => setAuthMessage(recoveryMessage, error.message, true));
}

function handlePasswordReset(event) {
  event.preventDefault();
  const password = resetPasswordForm.elements.password.value;
  const confirmation = resetPasswordForm.elements.passwordConfirmation.value;
  if (password.length < 10) {
    setAuthMessage(resetPasswordMessage, "A senha precisa ter pelo menos 10 caracteres.", true);
    return;
  }
  if (password !== confirmation) {
    setAuthMessage(resetPasswordMessage, "As senhas não coincidem.", true);
    return;
  }

  apiRequest("/auth/update-password", {
    method: "POST",
    body: JSON.stringify({ password })
  }).then((result) => {
    resetPasswordForm.reset();
    resetPasswordForm.querySelectorAll("input, button[type='submit']").forEach((element) => {
      element.disabled = true;
    });
    const user = result.user;
    if (user) {
      activeUser = {
        id: user.id,
        name: user.user_metadata?.display_name || user.email || "",
        email: user.email || ""
      };
      renderAuthState();
    }
    setAuthMessage(resetPasswordMessage, "Senha alterada com sucesso. Você já pode continuar usando sua conta.");
  }).catch((error) => setAuthMessage(resetPasswordMessage, error.message, true));
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
  }).then(async (result) => {
    if (!result.session) {
      signupForm.reset();
      setAuthMessage(signupMessage, "Conta criada. Verifique seu email para confirmar o cadastro e depois entre.", false);
      return;
    }
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
    <p class="prototype-note page-disclaimer">MVP em desenvolvimento: autenticação e dados são salvos no Supabase.</p></div>`;
}

function routeLink(href, label, style = "button button-outline") {
  return `<a class="${style}" href="${href}">${label}</a>`;
}

function requireLogin() {
  return `<section class="access-card">
    <p class="eyebrow">Acesso necessário</p><h1>Entre para continuar</h1>
    <p>Esta área é destinada a pessoas autenticadas na sua conta Mesa RPG.</p>
    <button class="button button-primary" type="button" data-open-auth="login">Entrar ou criar conta</button>
  </section>`;
}

function renderDashboard() {
  const user = currentUser();
  const campaigns = data.campaigns.filter((campaign) => campaign.participants.includes(user.id));
  const characters = data.characters.filter((character) => character.owner === user.id);
  const sessions = data.sessions.filter((session) => campaigns.some((campaign) => campaign.id === session.campaignId));
  const activeSessions = sessions.filter((session) => session.status === "active");
  const tables = data.tables.filter((table) => table.owner === user.id);
  const characterItems = characters.map((character) => {
    const campaign = character.campaignId ? getCampaign(character.campaignId) : null;
    const campaignLabel = campaign
      ? campaign.name
      : character.campaignId ? "Vinculada a uma campanha" : "Ficha avulsa";
    return `<article class="list-card compact-card">
      <div><h3>${escapeHtml(character.name)}</h3>
        <p>${escapeHtml(getSystemName(character.system))} · ${escapeHtml(campaignLabel)}</p></div>
      ${routeLink(`#ficha/${character.id}`, "Abrir ficha")}</article>`;
  }).join("");
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
        <div class="list-stack">${characterItems || `<p class="empty-panel">Nenhuma ficha criada ainda.</p>`}</div>
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
    <div class="card-actions">
      ${routeLink(`#campanha/${campaign.id}`, "Abrir campanha")}
      ${canManageCampaign(campaign) ? `<button class="button button-outline" type="button" data-action="delete-campaign" data-id="${campaign.id}">Excluir campanha</button>` : ""}
    </div>
  </article>`).join("");
  return pageLayout(`${pageHeader("Campanhas privadas", "Minhas campanhas", "Conteúdo visível somente aos participantes autorizados.", `<button class="button button-primary" type="button" data-action="new-campaign">Criar campanha</button>`)}
    <section class="list-stack">${items || `<p class="empty-panel">Nenhuma campanha encontrada.</p>`}</section>`);
}

function renderCampaignCreationForm() {
  return pageLayout(`${pageHeader("Campanhas privadas", "Criar campanha", "Campanhas ficam privadas e só participantes podem acessá-las.")}
    <form class="content-panel form-panel" data-form="campaign">
      <label><span>Nome da campanha *</span><input name="name" required maxlength="80"></label>
      <label><span>Sistema *</span><select name="system" required><option value="">Selecione</option>
        ${Object.entries(systems).map(([key, system]) => `<option value="${key}">${escapeHtml(system.name)}</option>`).join("")}</select></label>
      <label><span>Descrição</span><textarea name="description" rows="4" maxlength="500"></textarea></label>
      <p class="form-hint">Adicione o email de uma conta já cadastrada no sistema.</p>
      <div class="form-actions"><button class="button button-primary" type="submit">Criar campanha privada</button>
        ${routeLink("#painel", "Cancelar", "button button-outline")}</div>
    </form>`);
}

function renderCampaign(id, showFinishForm = false) {
  const campaign = getCampaign(id);
  if (!canAccessCampaign(campaign)) {
    return pageLayout(`<section class="access-card"><p class="eyebrow">Campanha privada</p><h1>Campanha indisponível</h1>
      <p>Ela não existe ou sua conta não está na lista de participantes.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  const characters = data.characters.filter((character) => character.campaignId === campaign.id);
  const sessions = data.sessions.filter((session) => session.campaignId === campaign.id)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  const activeSession = sessions.find((session) => session.status === "active");
  const isMaster = canManageCampaign(campaign);
  const finishedSessionCount = sessions.filter((session) => session.status === "finished").length;
  const canSelectCharactersToUnlink = isMaster || characters.some((character) => character.owner === currentUser().id);
  const hasOwnCampaignCharacter = characters.some((character) => character.owner === currentUser().id);
  const ownStandaloneCharacters = data.characters.filter((character) =>
    character.owner === currentUser().id && !character.campaignId
  );
  const characterItems = characters.map((character) => {
    const ownerName = campaign.members.find((member) => member.id === character.owner)?.name || "Proprietário não disponível";
    return `<article class="list-card compact-card">
      ${isMaster || character.owner === currentUser().id ? `<label class="session-select"><input type="checkbox" data-character-select value="${escapeHtml(character.id)}"
        aria-label="Selecionar agente ${escapeHtml(character.name)} para desvincular da campanha"></label>` : ""}
      <div><h3>${escapeHtml(character.name)}</h3>
        <p>${escapeHtml(getSystemName(character.system))} · Jogador: ${escapeHtml(ownerName)}</p></div>
      ${routeLink(`#ficha/${character.id}`, "Abrir ficha")}</article>`;
  }).join("");
  const agentPickerItems = ownStandaloneCharacters.map((character) => {
    const isCompatible = character.system === campaign.system;
    const canLink = isCompatible && canAddCharacterToCampaign(character, campaign);
    return `<article class="list-card compact-card">
      <div><h3>${escapeHtml(character.name)}</h3>
        <p>${escapeHtml(getSystemName(character.system))}${!isCompatible
          ? " · Sistema diferente da campanha"
          : canLink ? " · Ficha avulsa" : " · Você já tem um agente nesta campanha"}</p></div>
      <button class="button button-outline" type="button" data-action="link-character"
        data-id="${character.id}" data-campaign="${campaign.id}" ${canLink ? "" : "disabled"}>
        ${!isCompatible ? "Incompatível" : canLink ? "Vincular à campanha" : "Limite atingido"}</button></article>`;
  }).join("");
  const sessionItems = sessions.map((session) => `<article class="list-card compact-card" data-session-item>
    ${session.status === "finished" && isMaster
      ? `<label class="session-select"><input type="checkbox" data-session-select value="${session.id}"
          aria-label="Selecionar Sessão ${getCampaignSessionNumber(session)} para excluir"></label>`
      : ""}
    <div><h3>Sessão ${getCampaignSessionNumber(session)}${session.status === "active" ? " · Em andamento" : ""}</h3>
    <p>${formatDate(session.startedAt)}</p></div>
    <div class="card-actions">${routeLink(session.status === "active" ? `#sessao/${session.id}` : `#historico/${session.id}`,
      session.status === "active" ? "Abrir sessão ativa" : "Ver resumo e linha do tempo")}</div></article>`).join("");
  const action = isMaster
    ? activeSession
      ? `<div class="campaign-session-actions">${routeLink(`#sessao/${activeSession.id}`, "Abrir sessão ativa", "button button-outline")}
          ${routeLink(`#campanha/${campaign.id}/encerrar`, "Encerrar sessão", "button button-primary")}</div>`
      : `<button class="button button-primary" type="button" data-action="start-session" data-id="${campaign.id}">Iniciar sessão</button>`
    : activeSession
      ? routeLink(`#sessao/${activeSession.id}`, "Abrir sessão ativa", "button button-outline")
      : "";
  const finishForm = showFinishForm && activeSession && isMaster
    ? `<form class="content-panel form-panel session-finish-form" data-form="finish-session" data-id="${activeSession.id}">
        <p class="eyebrow">Encerramento da sessão ${getCampaignSessionNumber(activeSession)}</p>
        <h2>Escreva o resumo antes de arquivar</h2>
        <p>A sessão e sua linha do tempo só serão finalizadas depois que você salvar um resumo.</p>
        <label><span>Resumo da sessão *</span><textarea name="summary" rows="5" maxlength="10000" minlength="1" required
          placeholder="Registre o que aconteceu nesta sessão."></textarea></label>
        <div class="form-actions"><button class="button button-primary" type="submit">Salvar resumo e finalizar sessão</button>
          ${routeLink(`#campanha/${campaign.id}`, "Cancelar", "button button-outline")}</div>
      </form>`
    : showFinishForm && !activeSession
      ? `<p class="empty-panel">Não há uma sessão ativa para encerrar.</p>`
      : "";
  return pageLayout(`${pageHeader(escapeHtml(getSystemName(campaign.system)), escapeHtml(campaign.name),
    escapeHtml(campaign.description || "Sem descrição."), action)}
    ${finishForm}
    <div class="campaign-overview">
      <section class="content-panel"><div class="panel-heading"><h2>Personagens</h2>
        <div class="card-actions">
          <button class="button button-outline" type="button" data-action="toggle-agent-picker"
            aria-expanded="false" aria-controls="campaign-agent-picker">Adicionar agentes</button>
          ${routeLink(`#ficha/nova?campanha=${campaign.id}`, "Criar ficha", "text-button")}
          ${canSelectCharactersToUnlink && characters.length ? `<div class="session-header-actions">
            <div class="session-selection-tools" data-character-selection-tools hidden>
              <span data-character-selection-count>0 selecionados</span>
              <button class="button button-outline" type="button" data-action="unlink-selected-characters"
                data-campaign="${escapeHtml(campaign.id)}" disabled>Desvincular selecionados</button>
            </div>
            <button class="icon-button" type="button" data-action="toggle-character-selection"
              aria-label="Selecionar agentes para desvincular" aria-pressed="false" title="Selecionar agentes para desvincular">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg>
            </button>
          </div>` : ""}
        </div></div>
        <div id="campaign-agent-picker" class="agent-picker" hidden>
          <p class="form-hint">${isMaster
            ? "Escolha fichas avulsas que você criou; como mestre, você pode adicionar quantas quiser."
            : hasOwnCampaignCharacter
              ? "Você já tem um agente nesta campanha. Desvincule sua ficha atual para adicionar outra."
              : "Escolha uma ficha avulsa sua. Você pode ter apenas um agente próprio nesta campanha."}</p>
          <div class="list-stack">${agentPickerItems || `<p class="empty-panel">Você não tem fichas avulsas para adicionar.</p>`}</div>
        </div>
        <div class="list-stack character-list" data-character-list>${characterItems || `<p class="empty-panel">Ainda não há fichas vinculadas a esta campanha.</p>`}</div>
      </section>
      <section class="content-panel"><div class="panel-heading"><h2>Sessões</h2>
        ${isMaster && finishedSessionCount > 0
          ? `<div class="session-header-actions">
              <div class="session-selection-tools" data-session-selection-tools hidden>
                <span data-session-selection-count>0 selecionadas</span>
                <button class="button button-outline" type="button" data-action="delete-selected-sessions" disabled>Excluir selecionadas</button>
              </div>
              <button class="icon-button" type="button" data-action="toggle-session-selection" aria-label="Selecionar sessões para excluir"
                aria-pressed="false" title="Selecionar sessões para excluir">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg>
              </button>
            </div>`
          : ""}
      </div>
        <div class="list-stack session-list" data-session-list>${sessionItems || `<p class="empty-panel">Nenhuma sessão registrada. ${canManageCampaign(campaign) ? "Inicie a primeira sessão." : ""}</p>`}</div>
      </section>
      <section class="content-panel"><div class="panel-heading"><h2>Participantes</h2></div>
        <ul class="member-list">${campaign.members.map((member) => `<li><span class="user-avatar">${escapeHtml(member.name.charAt(0).toUpperCase())}</span>
            <span>${escapeHtml(member.name)}${member.role === "master" ? " · mestre" : ""}</span></li>`).join("")}</ul>
        ${canManageCampaign(campaign) ? `<form class="inline-form" data-form="invite"><label><span>Adicionar participante por email</span>
          <input type="email" name="email" placeholder="jogador@email.com" required></label><button class="button button-outline" type="submit">Adicionar</button></form>
          <p class="form-hint">A pessoa precisa já ter uma conta confirmada no Mesa RPG com este email.</p>` : ""}
      </section>
    </div>`);
}

function orderSkillOptions(selected = "") {
  return `<option value="">Selecione uma perícia</option>${orderSkills.map((skill) =>
    `<option value="${escapeHtml(skill.name)}" ${skill.name === selected ? "selected" : ""}>${escapeHtml(skill.name)} · ${skill.attribute}${skill.trainedOnly ? " · requer treino" : ""}${skill.loadPenalty ? " · penalidade de carga" : ""}</option>`
  ).join("")}`;
}

function renderOrderSkillSelect(name, label, selected = "", required = false, extraAttributes = "") {
  return `<label><span>${escapeHtml(label)}</span><select name="${escapeHtml(name)}" ${required ? "required" : ""} ${extraAttributes}>
    ${orderSkillOptions(selected)}</select></label>`;
}

function renderCombatRoller() {
  return `<section class="combat-roll-panel" aria-labelledby="dice-roller-title" data-dice-roller>
    <div><p class="eyebrow">Rolador de dados</p><h3 id="dice-roller-title">Teste livre</h3>
      <p class="form-hint">Escolha a quantidade e o dado. O resultado mostra cada rolagem e a soma.</p></div>
    <div class="dice-roller-controls">
      <label><span>Quantidade</span><input type="number" min="1" max="20" value="1" data-dice-count></label>
      <label><span>Tipo de dado</span><select data-dice-sides>
        ${[4, 6, 8, 10, 12, 20, 100].map((sides) => `<option value="${sides}" ${sides === 20 ? "selected" : ""}>d${sides}</option>`).join("")}
      </select></label>
      <button class="button button-outline" type="button" data-action="roll-dice">Rolar dados</button>
    </div>
    <p class="dice-roller-result" role="status" aria-live="polite" data-dice-result>Escolha um dado para começar.</p>
  </section>`;
}

function setCharacterTab(container, selectedTab) {
  container.querySelectorAll("[data-character-tab-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.characterTabPanel !== selectedTab;
  });
  container.querySelectorAll("[data-action='character-tab']").forEach((tab) => {
    const selected = tab.dataset.tab === selectedTab;
    tab.classList.toggle("is-current", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
}

function sanitizeAttackNotes(html) {
  const template = document.createElement("template");
  template.innerHTML = String(html || "");
  const allowedTags = new Set(["B", "STRONG", "I", "EM", "U", "BR"]);
  const clean = (parent) => {
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) return;
      if (node.nodeType !== Node.ELEMENT_NODE) {
        node.remove();
        return;
      }
      clean(node);
      if (allowedTags.has(node.tagName)) {
        [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
      } else {
        node.replaceWith(...node.childNodes);
      }
    });
  };
  clean(template.content);
  return template.innerHTML;
}

function renderGalleryImageButton(image, selectedId = "") {
  const selected = image.id === selectedId;
  const preview = image.url
    ? `<img src="${escapeHtml(image.url)}" alt="" loading="lazy">`
    : `<span class="gallery-image-unavailable">Imagem indisponível</span>`;
  return `<button class="gallery-image-option ${selected ? "is-selected" : ""}" type="button"
    data-gallery-image data-action="select-gallery-image" data-id="${escapeHtml(image.id)}" aria-pressed="${selected}">
    ${preview}<span>${escapeHtml(image.filename)}</span></button>`;
}

function renderGalleryPicker(selectedId = "") {
  const ownImages = data.galleryImages.filter((image) => image.owner === currentUser()?.id);
  return `<section class="attack-gallery" aria-labelledby="attack-gallery-title">
    <div class="panel-heading"><h4 id="attack-gallery-title">Galeria privada</h4>
      <span class="form-hint">Imagens anexadas a este ataque ficam visíveis aos membros autorizados da campanha.</span></div>
    <label class="gallery-upload"><span>Adicionar imagem à galeria (PNG, JPEG, WebP ou GIF; até 5 MB)</span>
      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-gallery-upload></label>
    <button class="button button-outline" type="button" data-action="upload-gallery-image">Enviar para a galeria</button>
    <input type="hidden" name="attackImageId" data-attack-image-id value="${escapeHtml(selectedId)}">
    <div class="gallery-image-grid" data-gallery-items>
      ${ownImages.map((image) => renderGalleryImageButton(image, selectedId)).join("")
        || `<p class="empty-panel" data-gallery-empty>Sua galeria está vazia. Envie uma imagem para começar.</p>`}
    </div>
    <div class="attack-image-preview" data-attack-image-preview>
      ${ownImages.find((image) => image.id === selectedId)?.url
        ? `<img src="${escapeHtml(ownImages.find((image) => image.id === selectedId).url)}" alt="Imagem selecionada para o ataque">`
        : `<span>Nenhuma imagem selecionada</span>`}
    </div>
  </section>`;
}

function renderAttackCard(attack, editable = false) {
  const image = data.galleryImages.find((item) => item.id === attack.imageId);
  const extraDamage = Array.isArray(attack.extraDamage)
    ? attack.extraDamage.filter((extra) => extra && typeof extra === "object")
    : [];
  return `<article class="attack-card ${image?.url ? "has-image" : ""}" data-attack-id="${escapeHtml(attack.id)}">
    ${image?.url ? `<img class="attack-card-image" src="${escapeHtml(image.url)}" alt="Imagem do ataque ${escapeHtml(attack.name)}" loading="lazy">` : ""}
    <div class="attack-card-content"><div class="panel-heading"><h4>${escapeHtml(attack.name)}</h4>
      <span class="status-chip">${escapeHtml(attack.damageType)}</span></div>
      <p>${escapeHtml(attack.damage)}${extraDamage.length ? ` + ${extraDamage.map((extra) => escapeHtml(extra.formula)).join(" + ")}` : ""}
        · crítico ${escapeHtml(attack.critical)}/${escapeHtml(attack.multiplier)}x · bônus ${escapeHtml(attack.attackBonus >= 0 ? `+${attack.attackBonus}` : attack.attackBonus)}</p>
      <p class="form-hint">${escapeHtml(attack.range || "Alcance não informado")}${attack.skill ? ` · ${escapeHtml(attack.skill)}` : ""}
        ${attack.damageAttribute ? ` · atributo de dano: ${escapeHtml(attack.damageAttribute)}` : ""}</p>
      ${image && !image.url ? `<p class="form-hint">Imagem indisponível${image.error ? `: ${escapeHtml(image.error)}` : "."}</p>` : ""}
      ${attack.notes ? `<div class="attack-notes">${sanitizeAttackNotes(attack.notes)}</div>` : ""}
      <p class="attack-roll-result" role="status" aria-live="polite" data-attack-result></p>
      <div class="form-actions"><button class="button button-outline" type="button" data-action="roll-attack"
        data-bonus="${escapeHtml(attack.attackBonus)}" data-critical="${escapeHtml(attack.critical)}">Testar ataque</button>
        ${editable ? `<button class="button button-outline" type="button" data-action="edit-character-attack" data-id="${escapeHtml(attack.id)}">Editar</button>
          <button class="button button-outline" type="button" data-action="delete-character-attack" data-id="${escapeHtml(attack.id)}">Excluir</button>` : ""}</div>
    </div>
  </article>`;
}

function renderOrderCombatPanel(character, canEdit) {
  const savedAttacks = storedCharacterAttacks(character?.fields?.Ataques);
  const attackSection = canEdit
    ? `<form class="form-panel attack-editor-form" data-form="character-attacks" data-system="ordem"
        data-id="${escapeHtml(character.id)}" novalidate>
        <input type="hidden" name="attacks" data-character-attacks value="${escapeHtml(JSON.stringify(savedAttacks))}">
        <section class="attack-builder" aria-labelledby="attack-builder-title">
          <div><p class="eyebrow">Ordem Paranormal</p><h3 id="attack-builder-title">Cadastrar ataque</h3>
            <p class="form-hint">O teste rola somente 1d20 + bônus. O resultado não determina acerto nem rola dano.</p></div>
          <div class="form-grid">
            <label><span>Nome do ataque *</span><input name="attackName" maxlength="80" required></label>
            <label><span>Dano *</span><input name="attackDamage" required pattern="\\d{1,2}d(?:4|6|8|10|12|20|100)(?:\\s*(?:\\+|-)\\s*\\d{1,3})?"
              title="Use uma fórmula como 1d4 ou 2d6 + 3" placeholder="1d4"></label>
            <label><span>Crítico (resultado natural mínimo)</span><input name="attackCritical" type="number" min="1" max="20" value="20" required></label>
            <label><span>Multiplicador crítico</span><input name="attackMultiplier" type="number" min="1" max="10" value="2" required></label>
            <label><span>Bônus de ataque</span><input name="attackBonus" type="number" min="-99" max="99" value="0" required></label>
            <label><span>Tipo de dano</span><select name="attackDamageType" required>
              <option value="">Selecione</option>${orderDamageTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join("")}
            </select></label>
            <label><span>Alcance</span><input name="attackRange" maxlength="80" placeholder="Ex.: curto"></label>
            ${renderOrderSkillSelect("attackSkill", "Perícia *", "", true)}
            <label><span>Atributo de dano *</span><select name="attackDamageAttribute" required>
              <option value="">Selecione</option>${orderAttributes.map(({ name }) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}
            </select></label>
          </div>
          <section class="extra-damage-editor" aria-labelledby="extra-damage-title">
            <div class="panel-heading"><h4 id="extra-damage-title">Dano extra</h4>
              <button class="button button-outline" type="button" data-action="add-extra-damage">Adicionar dano extra</button></div>
            <div class="extra-damage-list" data-extra-damage-list></div>
          </section>
          ${renderGalleryPicker()}
          <section class="attack-notes-editor">
            <h4>Anotações do ataque</h4>
            <div class="rich-text-toolbar" role="toolbar" aria-label="Formatação das anotações">
              <button class="button button-outline" type="button" data-action="format-attack-notes" data-command="bold" aria-label="Negrito"><strong>N</strong></button>
              <button class="button button-outline" type="button" data-action="format-attack-notes" data-command="italic" aria-label="Itálico"><em>I</em></button>
              <button class="button button-outline" type="button" data-action="format-attack-notes" data-command="underline" aria-label="Sublinhado"><u>S</u></button>
            </div>
            <div class="rich-text-editor" contenteditable="true" role="textbox" aria-label="Anotações do ataque" aria-multiline="true"
              data-attack-notes></div>
          </section>
          <div class="form-actions"><button class="button button-outline" type="button" data-action="save-character-attack">Adicionar ataque</button>
            <button class="button button-outline" type="button" data-action="cancel-character-attack" hidden>Cancelar edição</button></div>
        </section>
        <section class="attack-list-panel" aria-labelledby="attack-list-title"><div class="panel-heading"><h3 id="attack-list-title">Ataques cadastrados</h3></div>
          <div class="list-stack" data-attack-list>${savedAttacks.map((attack) => renderAttackCard(attack, true)).join("")
            || `<p class="empty-panel">Nenhum ataque cadastrado ainda.</p>`}</div></section>
      </form>`
    : `<section class="attack-list-panel" aria-labelledby="attack-list-title"><div class="panel-heading"><h3 id="attack-list-title">Ataques cadastrados</h3></div>
        <div class="list-stack">${savedAttacks.map((attack) => renderAttackCard(attack)).join("")
          || `<p class="empty-panel">Nenhum ataque cadastrado ainda.</p>`}</div></section>`;
  return `<section class="character-tab-panel combat-tab-panel" id="character-panel-combate" role="tabpanel"
    aria-labelledby="character-tab-combate" data-character-tab-panel="combate" hidden>
    <div class="content-panel">
      <div class="panel-heading"><div><p class="eyebrow">Combate</p><h2>Dados e ataques</h2></div></div>
      ${renderCombatRoller()}
      ${canEdit ? `<p class="form-hint">Você pode cadastrar ataques nesta ficha. Cada alteração é salva imediatamente.</p>` : ""}
      ${attackSection}
    </div>
  </section>`;
}

function storedCharacterAttacks(value) {
  return Array.isArray(value)
    ? value.filter((attack) => attack && typeof attack === "object" && !Array.isArray(attack))
    : [];
}

function characterAttacks(form) {
  const parsed = JSON.parse(form.querySelector("[data-character-attacks]").value || "[]");
  if (!Array.isArray(parsed)) throw new Error("Os ataques desta ficha não puderam ser carregados.");
  return storedCharacterAttacks(parsed);
}

function renderCharacterAttackList(form) {
  const attacks = characterAttacks(form);
  form.querySelector("[data-attack-list]").innerHTML = attacks.map((attack) => renderAttackCard(attack, true)).join("")
    || `<p class="empty-panel">Nenhum ataque cadastrado ainda.</p>`;
}

async function persistCharacterAttacks(form, attacks) {
  const character = getCharacter(form.dataset.id);
  if (!character || character.owner !== currentUser()?.id) {
    throw new Error("Somente o proprietário pode alterar os ataques desta ficha.");
  }
  const fields = { ...(character.fields || {}), Ataques: attacks };
  await apiRequest(`/characters/${character.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: character.name,
      system: character.system,
      campaignId: character.campaignId || null,
      fields,
      notes: character.notes || ""
    })
  });
  character.fields = fields;
  form.querySelector("[data-character-attacks]").value = JSON.stringify(attacks);
  renderCharacterAttackList(form);
}

function renderExtraDamageRow(extra = {}) {
  return `<div class="extra-damage-row" data-extra-damage-row>
    <label><span>Fórmula de dano</span><input data-extra-damage-formula required
      pattern="\\d{1,2}d(?:4|6|8|10|12|20|100)(?:\\s*(?:\\+|-)\\s*\\d{1,3})?" title="Use uma fórmula como 1d4 ou 2d6 + 3"
      placeholder="1d4" value="${escapeHtml(extra.formula || "")}"></label>
    <label><span>Tipo</span><select data-extra-damage-type>
      <option value="">Mesmo tipo do ataque</option>${orderDamageTypes.map((type) =>
        `<option value="${escapeHtml(type)}" ${extra.type === type ? "selected" : ""}>${escapeHtml(type)}</option>`
      ).join("")}
    </select></label>
    <button class="button button-outline" type="button" data-action="remove-extra-damage">Remover</button>
  </div>`;
}

function setGalleryImage(form, imageId) {
  const selected = data.galleryImages.find((image) =>
    image.id === imageId && image.owner === currentUser()?.id
  );
  form.querySelector("[data-attack-image-id]").value = selected?.id || "";
  form.querySelectorAll("[data-gallery-image]").forEach((button) => {
    const isSelected = button.dataset.id === selected?.id;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  const preview = form.querySelector("[data-attack-image-preview]");
  preview.innerHTML = selected?.url
    ? `<img src="${escapeHtml(selected.url)}" alt="Imagem selecionada para o ataque">`
    : `<span>${selected ? "Imagem indisponível" : "Nenhuma imagem selecionada"}</span>`;
}

function resetCharacterAttackEditor(form) {
  const builder = form.querySelector(".attack-builder");
  builder.dataset.editingAttack = "";
  for (const name of ["attackName", "attackDamage", "attackRange"]) form.elements.namedItem(name).value = "";
  form.elements.namedItem("attackCritical").value = "20";
  form.elements.namedItem("attackMultiplier").value = "2";
  form.elements.namedItem("attackBonus").value = "0";
  form.elements.namedItem("attackDamageType").value = "";
  form.elements.namedItem("attackSkill").value = "";
  form.elements.namedItem("attackDamageAttribute").value = "";
  form.querySelector("[data-extra-damage-list]").replaceChildren();
  form.querySelector("[data-attack-notes]").innerHTML = "";
  setGalleryImage(form, "");
  form.querySelector('[data-action="save-character-attack"]').textContent = "Adicionar ataque";
  form.querySelector('[data-action="cancel-character-attack"]').hidden = true;
}

function editCharacterAttack(form, attack) {
  const builder = form.querySelector(".attack-builder");
  builder.dataset.editingAttack = attack.id;
  for (const [name, value] of [
    ["attackName", attack.name],
    ["attackDamage", attack.damage],
    ["attackCritical", attack.critical],
    ["attackMultiplier", attack.multiplier],
    ["attackBonus", attack.attackBonus],
    ["attackDamageType", attack.damageType],
    ["attackRange", attack.range],
    ["attackSkill", attack.skill],
    ["attackDamageAttribute", attack.damageAttribute]
  ]) form.elements.namedItem(name).value = value ?? "";
  form.querySelector("[data-extra-damage-list]").innerHTML =
    (Array.isArray(attack.extraDamage) ? attack.extraDamage.filter((extra) => extra && typeof extra === "object") : [])
      .map(renderExtraDamageRow).join("");
  form.querySelector("[data-attack-notes]").innerHTML = sanitizeAttackNotes(attack.notes);
  setGalleryImage(form, attack.imageId || "");
  form.querySelector('[data-action="save-character-attack"]').textContent = "Salvar ataque";
  form.querySelector('[data-action="cancel-character-attack"]').hidden = false;
  form.querySelector('[name="attackName"]').focus();
}

async function saveCharacterAttack(form) {
  const builder = form.querySelector(".attack-builder");
  const requiredInputs = [...builder.querySelectorAll("input[required], select[required]")];
  const invalid = requiredInputs.find((input) => !input.checkValidity());
  if (invalid) {
    invalid.reportValidity();
    return;
  }
  const extraRows = [...form.querySelectorAll("[data-extra-damage-row]")];
  const invalidExtra = extraRows.flatMap((row) => [...row.querySelectorAll("input")]).find((input) => !input.checkValidity());
  if (invalidExtra) {
    invalidExtra.reportValidity();
    return;
  }
  if (extraRows.length > 10) {
    showPageNotice("Um ataque pode ter no máximo 10 danos extras.", true);
    return;
  }
  const value = (name) => form.elements.namedItem(name).value.trim();
  const attacks = characterAttacks(form);
  const editingId = builder.dataset.editingAttack;
  const attack = {
    id: editingId || crypto.randomUUID(),
    name: value("attackName"),
    damage: value("attackDamage"),
    critical: Number(value("attackCritical")),
    multiplier: Number(value("attackMultiplier")),
    attackBonus: Number(value("attackBonus")),
    damageType: value("attackDamageType"),
    range: value("attackRange"),
    skill: value("attackSkill"),
    damageAttribute: value("attackDamageAttribute"),
    extraDamage: extraRows.map((row) => ({
      formula: row.querySelector("[data-extra-damage-formula]").value.trim(),
      type: row.querySelector("[data-extra-damage-type]").value
    })),
    imageId: value("attackImageId"),
    notes: sanitizeAttackNotes(form.querySelector("[data-attack-notes]").innerHTML)
  };
  const existingIndex = attacks.findIndex((item) => item.id === editingId);
  if (editingId && existingIndex < 0) throw new Error("Este ataque não está mais disponível para edição.");
  if (existingIndex >= 0) attacks[existingIndex] = attack;
  else attacks.push(attack);
  await persistCharacterAttacks(form, attacks);
  resetCharacterAttackEditor(form);
  showPageNotice(editingId ? "Ataque atualizado e salvo na ficha." : "Ataque adicionado e salvo na ficha.");
}

function rollDie(sides) {
  const values = new Uint32Array(1);
  const range = 0x100000000 - (0x100000000 % sides);
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= range);
  return (values[0] % sides) + 1;
}

async function uploadGalleryImage(form) {
  const fileInput = form.querySelector("[data-gallery-upload]");
  const file = fileInput.files[0];
  if (!file) throw new Error("Escolha uma imagem antes de enviar.");
  const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
  if (!extensions[file.type]) throw new Error("Use uma imagem PNG, JPEG, WebP ou GIF.");
  if (file.size > 5 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 5 MB.");
  const user = currentUser();
  if (!user) throw new Error("Entre na sua conta para enviar imagens.");

  const client = requireSupabase();
  const imageId = crypto.randomUUID();
  const storagePath = `${user.id}/${imageId}.${extensions[file.type]}`;
  const storage = client.storage.from("character-gallery");
  const { error: uploadError } = await storage.upload(storagePath, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false
  });
  supabaseFailure(uploadError, "Não foi possível enviar a imagem para a galeria.");

  const { data: image, error: insertError } = await client.from("character_gallery_images").insert({
    id: imageId,
    owner_id: user.id,
    storage_path: storagePath,
    filename: file.name.trim().slice(0, 120) || `Imagem.${extensions[file.type]}`,
    content_type: file.type
  }).select("id,owner_id,storage_path,filename,content_type").single();
  if (insertError) {
    const { error: cleanupError } = await storage.remove([storagePath]);
    const cleanupMessage = cleanupError ? ` A limpeza do arquivo também falhou: ${cleanupError.message}` : "";
    throw new Error(`Não foi possível registrar a imagem na galeria: ${insertError.message}.${cleanupMessage}`);
  }
  const { data: signedImage, error: signError } = await storage.createSignedUrl(storagePath, 3600);
  if (signError) {
    const { error: deleteRowError } = await client.from("character_gallery_images").delete().eq("id", imageId);
    const { error: cleanupError } = await storage.remove([storagePath]);
    const cleanupErrors = [deleteRowError, cleanupError].filter(Boolean).map((error) => error.message);
    throw new Error(`Não foi possível preparar a prévia da imagem: ${signError.message}${cleanupErrors.length ? ` Limpeza incompleta: ${cleanupErrors.join("; ")}` : ""}`);
  }
  data.galleryImages.push({
    id: image.id,
    owner: image.owner_id,
    storagePath: image.storage_path,
    filename: image.filename,
    contentType: image.content_type,
    url: signedImage.signedUrl
  });
  const gallery = form.querySelector("[data-gallery-items]");
  gallery.innerHTML = data.galleryImages.filter((item) => item.owner === user.id)
    .map((item) => renderGalleryImageButton(item, imageId)).join("");
  setGalleryImage(form, imageId);
  fileInput.value = "";
  showPageNotice("Imagem enviada para sua galeria privada.");
}

function orderNexValue(value) {
  const parsed = Number.parseInt(String(value || "5").replace("%", ""), 10);
  return Number.isInteger(parsed) && (parsed === 99 || (parsed >= 5 && parsed <= 95 && parsed % 5 === 0)) ? parsed : 5;
}

function calculateOrderStats(classId, attributes, nex, customStats = {}) {
  const classStats = orderClasses[classId] || customStats;
  const steps = Math.max(0, Math.floor((nex - 5) / 5));
  return {
    hp: classStats.pv + attributes.VIG + steps * (classStats.pvPerNex + attributes.VIG),
    pe: classStats.pe + attributes.PRE + steps * (classStats.pePerNex + attributes.PRE),
    san: classStats.san + steps * classStats.sanPerNex,
    defense: 10 + attributes.AGI,
    ritualDifficulty: 11 + attributes.PRE,
    carry: attributes.FOR === 0 ? 2 : 5 * attributes.FOR,
    block: 0,
    dodge: 10 + attributes.AGI
  };
}

function renderOrderOriginCard(origin, selected = false) {
  const searchText = [
    origin.name,
    origin.source,
    origin.description,
    origin.skillDisplay,
    ...origin.skills,
    origin.power,
    origin.powerNotes
  ].join(" ").toLocaleLowerCase("pt-BR");
  return `<article class="order-origin-card ${selected ? "is-selected" : ""}" data-origin-card
    data-origin-source="${escapeHtml(origin.source)}" data-origin-search="${escapeHtml(searchText)}"
    data-origin-name="${escapeHtml(origin.name)}" data-origin-description="${escapeHtml(origin.description)}"
    data-origin-skill1="${escapeHtml(origin.skills[0])}" data-origin-skill2="${escapeHtml(origin.skills[1])}"
    data-origin-power="${escapeHtml(origin.power)}" data-origin-power-notes="${escapeHtml(origin.powerNotes)}"
    data-origin-choice-count="${origin.choiceCount || 0}">
    <div class="order-origin-card-heading">
      <div><span class="order-origin-source">${escapeHtml(origin.source)}</span><h3>${escapeHtml(origin.name)}</h3></div>
      <button type="button" class="button ${selected ? "button-primary" : "button-outline"}" data-action="select-character-origin"
        aria-pressed="${selected}">${selected ? "Selecionada" : "Escolher"}</button>
    </div>
    <details class="order-origin-details"><summary>Ver detalhes</summary>
      <p>${escapeHtml(origin.description || "Sem descrição cadastrada.")}</p>
      <dl><div><dt>Perícias treinadas</dt><dd>${origin.choiceCount
        ? `Duas perícias à escolha ${origin.choiceCount === 2 ? "do mestre" : ""}`
        : escapeHtml(origin.skillDisplay || origin.skills.join(" · "))}</dd></div>
        <div><dt>Poder de origem</dt><dd>${escapeHtml(origin.power || "Consulte o livro de referência.")}</dd></div></dl>
      ${origin.powerNotes ? `<p>${escapeHtml(origin.powerNotes)}</p>` : ""}
      ${origin.choiceCount ? `<div class="order-origin-choice-skills">
        ${renderOrderSkillSelect("originChoice1", "Perícia escolhida 1 *", origin.skills[0], true, "data-origin-choice=\"0\"")}
        ${renderOrderSkillSelect("originChoice2", "Perícia escolhida 2 *", origin.skills[1], true, "data-origin-choice=\"1\"")}
      </div>` : ""}
    </details>
  </article>`;
}

function filterOrderOriginCards(form) {
  const search = form.querySelector("[data-origin-search]");
  let visibleCount = 0;
  form.querySelectorAll("[data-origin-card]").forEach((card) => {
    const matchesSearch = card.dataset.originSearch.includes(search.value.trim().toLocaleLowerCase("pt-BR"));
    card.hidden = !matchesSearch;
    if (!card.hidden) visibleCount += 1;
  });
  form.querySelector("[data-origin-empty]").hidden = visibleCount > 0;
}

function selectOrderOrigin(form, card) {
  const choiceSelects = [...card.querySelectorAll("[data-origin-choice]")];
  const skills = choiceSelects.length
    ? choiceSelects.map((select) => select.value)
    : [card.dataset.originSkill1, card.dataset.originSkill2];
  const originFields = {
    originName: card.dataset.originName,
    originSource: card.dataset.originSource,
    originDescription: card.dataset.originDescription,
    originSkill1: skills[0],
    originSkill2: skills[1],
    originPower: card.dataset.originPower,
    originPowerNotes: card.dataset.originPowerNotes
  };
  for (const [name, value] of Object.entries(originFields)) {
    form.elements.namedItem(name).value = value;
  }
  form.dataset.selectedOrigin = "true";
  form.dataset.selectedOriginChoiceCount = card.dataset.originChoiceCount || "0";
  form.querySelectorAll("[data-origin-card]").forEach((originCard) => {
    const selected = originCard === card;
    originCard.classList.toggle("is-selected", selected);
    const button = originCard.querySelector('[data-action="select-character-origin"]');
    button.classList.toggle("button-primary", selected);
    button.classList.toggle("button-outline", !selected);
    button.setAttribute("aria-pressed", String(selected));
    button.textContent = selected ? "Selecionada" : "Escolher";
  });
  if (choiceSelects.length) card.querySelector(".order-origin-details").open = true;
  form.querySelector("[data-origin-selection-status]").textContent = `Origem selecionada: ${card.dataset.originName}.`;
}

function renderOrderCharacterForm(character, campaignId, draft = {}) {
  const fields = character?.fields || {};
  const field = (name, fallback = "") => fields[name] ?? fallback;
  const selectedClass = field("Classe ID", "combatente");
  const nex = orderNexValue(field("NEX", "5"));
  const attributeDefaults = Object.fromEntries(orderAttributes.map(({ key, name }) => [key, Number(field(name, 1))]));
  const skillCount = (classId, intellect, customCount = 0) => classId === "mundano"
    ? customCount
    : Math.min(10, (orderClasses[classId]?.skillCount || 0) + intellect);
  const initialSkillCount = skillCount(selectedClass, attributeDefaults.INT, Number(field("Mundano perícias de classe", 0)));
  const skillSlots = Array.from({ length: 10 }, (_, index) =>
    `<div class="order-class-skill" data-order-skill-slot="${index}" ${index < initialSkillCount ? "" : "hidden"}>
      ${renderOrderSkillSelect(`classSkill${index + 1}`, `Perícia de classe ${index + 1}`, field(`Perícia de classe ${index + 1}`), index < initialSkillCount, index < initialSkillCount ? "" : "disabled")}</div>`
  ).join("");
  const classOptions = [
    ...Object.entries(orderClasses).map(([key, value]) => `<option value="${key}" ${selectedClass === key ? "selected" : ""}>${value.name}</option>`),
    `<option value="mundano" ${selectedClass === "mundano" ? "selected" : ""}>Mundano · valores personalizados</option>`
  ].join("");
  const statSummary = calculateOrderStats(selectedClass, attributeDefaults, nex, {
    pv: Number(field("Mundano PV inicial", 0)),
    pvPerNex: Number(field("Mundano PV por NEX", 0)),
    pe: Number(field("Mundano PE inicial", 0)),
    pePerNex: Number(field("Mundano PE por NEX", 0)),
    san: Number(field("Mundano SAN inicial", 0)),
    sanPerNex: Number(field("Mundano SAN por NEX", 0))
  });
  const campaignSelection = character?.campaignId || campaignId || "";
  const campaignOptions = availableCharacterCampaigns(character, "ordem").map((campaign) =>
    `<option value="${campaign.id}" ${campaign.id === campaignSelection ? "selected" : ""}>${escapeHtml(campaign.name)}</option>`
  ).join("");
  const attributeInputs = orderAttributes.map(({ key, name }) => `<label class="order-attribute">
    <span>${escapeHtml(name)} <small>${key}</small></span><input name="attribute${key}" type="number" min="0" max="3" step="1" required
      value="${escapeHtml(attributeDefaults[key])}" aria-label="${escapeHtml(name)} (0 a 3)"></label>`).join("");
  const mundanoStats = [
    ["mundanoSkillCount", "Perícias treinadas pela classe", field("Mundano perícias de classe", 0)],
    ["mundanoPV", "PV inicial", field("Mundano PV inicial", 0)],
    ["mundanoPVPerNex", "PV a cada 5% de NEX", field("Mundano PV por NEX", 0)],
    ["mundanoPE", "PE inicial", field("Mundano PE inicial", 0)],
    ["mundanoPEPerNex", "PE a cada 5% de NEX", field("Mundano PE por NEX", 0)],
    ["mundanoSAN", "SAN inicial", field("Mundano SAN inicial", 0)],
    ["mundanoSANPerNex", "SAN a cada 5% de NEX", field("Mundano SAN por NEX", 0)]
  ].map(([name, label, value]) => `<label><span>${label}</span><input name="${name}" type="number" min="0" max="${name === "mundanoSkillCount" ? "10" : "500"}" step="1" value="${escapeHtml(value)}"
    data-mundano-stat ${selectedClass === "mundano" ? "required" : "disabled"}></label>`).join("");
  const nexOptions = [...Array.from({ length: 19 }, (_, index) => 5 + index * 5), 99].map((value) =>
    `<option value="${value}" ${nex === value ? "selected" : ""}>${value}%</option>`
  ).join("");
  const selectedOriginSkills = (field("Perícias da origem") || "").split(";").map((skill) => skill.trim());
  const selectedOrigin = field("Origem") ? {
    name: field("Origem"),
    source: field("Fonte da origem", "Personalizada"),
    description: field("Descrição da origem"),
    skills: [field("Perícia de origem 1", selectedOriginSkills[0]), field("Perícia de origem 2", selectedOriginSkills[1])],
    power: field("Poder da origem"),
    powerNotes: field("Efeito do poder de origem"),
    choiceCount: orderOriginCatalog.find((origin) => origin.name === field("Origem") && origin.source === field("Fonte da origem"))?.choiceCount || 0
  } : null;
  const selectedCatalogOrigin = selectedOrigin && orderOriginCatalog.some((origin) =>
    origin.name === selectedOrigin.name && origin.source === selectedOrigin.source
  );
  const catalogOrigins = orderOriginCatalog.map((origin) =>
    renderOrderOriginCard(selectedOrigin?.name === origin.name && selectedOrigin?.source === origin.source
      ? { ...origin, skills: selectedOrigin.skills }
      : origin, selectedOrigin?.name === origin.name && selectedOrigin?.source === origin.source)
  ).join("");
  const originCards = selectedOrigin && !selectedCatalogOrigin
    ? `${renderOrderOriginCard(selectedOrigin, true)}${catalogOrigins}`
    : catalogOrigins;

  return pageLayout(`${pageHeader("Ordem Paranormal", character ? "Editar agente" : "Criar agente",
    "Monte a ficha em quatro etapas. Os cálculos usam os valores de classe e progressão informados na referência; confirme as regras da sua mesa.",
    routeLink("#painel", "Cancelar"))}
    <form class="content-panel form-panel order-character-form" data-form="character" data-system="ordem" data-id="${character?.id || ""}"
      data-selected-origin="${selectedOrigin ? "true" : "false"}" novalidate>
      <input type="hidden" name="system" value="ordem">
      <input type="hidden" name="attacks" value="${escapeHtml(JSON.stringify(storedCharacterAttacks(fields.Ataques)))}">
      <label><span>Vincular a uma campanha</span><select name="campaignId"><option value="">Sem campanha</option>${campaignOptions}</select></label>
      <p class="form-hint">Jogadores podem vincular uma ficha própria por campanha; para trocar, desvincule a atual. Mestres não têm esse limite.</p>
      <nav class="order-creation-steps" aria-label="Etapas da criação da ficha">
        ${["Atributos", "Origem", "Classe", "Toques finais"].map((label, index) =>
          `<button type="button" class="order-step-button ${index === 0 ? "is-current" : ""}" data-action="character-step" data-step="${index}" aria-current="${index === 0 ? "step" : "false"}">
            <span>${index + 1}</span>${label}</button>`
        ).join("")}
      </nav>
      <section class="order-step-panel" data-order-step="0">
        <div><p class="eyebrow">Etapa 1 de 4</p><h2>Atributos</h2>
          <p>Comece com 1 em cada atributo e distribua 4 pontos. Você pode reduzir um atributo a 0 para ganhar 1 ponto adicional; nenhum atributo pode passar de 3.</p></div>
        <div class="order-attributes-grid">${attributeInputs}</div>
        <p class="order-points-remaining" role="status">Pontos disponíveis: <strong data-order-points-remaining>4</strong></p>
        <div class="form-actions"><button type="button" class="button button-primary" data-action="character-step" data-step="1">Continuar para origem</button></div>
      </section>
      <section class="order-step-panel" data-order-step="1" hidden>
        <div><p class="eyebrow">Etapa 2 de 4</p><h2>Origem</h2>
          <p>Busque e escolha uma origem. Os detalhes são resumos para consulta; confirme a aplicação das regras com o mestre.</p></div>
        <input type="hidden" name="originName" value="${escapeHtml(selectedOrigin?.name || "")}">
        <input type="hidden" name="originSource" value="${escapeHtml(selectedOrigin?.source || "")}">
        <input type="hidden" name="originDescription" value="${escapeHtml(selectedOrigin?.description || "")}">
        <input type="hidden" name="originSkill1" value="${escapeHtml(selectedOrigin?.skills[0] || "")}">
        <input type="hidden" name="originSkill2" value="${escapeHtml(selectedOrigin?.skills[1] || "")}">
        <input type="hidden" name="originPower" value="${escapeHtml(selectedOrigin?.power || "")}">
        <input type="hidden" name="originPowerNotes" value="${escapeHtml(selectedOrigin?.powerNotes || "")}">
        <div class="order-origin-controls">
          <label class="order-origin-search"><span>Buscar origem</span><input type="search" data-origin-search placeholder="Digite o nome ou uma perícia"></label>
        </div>
        <div class="order-origin-list" data-origin-list>${originCards}</div>
        <p class="empty-panel" data-origin-empty hidden>Nenhuma origem corresponde à busca. Ajuste os filtros ou cadastre uma origem.</p>
        <p class="form-hint" data-origin-selection-status role="status">${selectedOrigin ? `Origem selecionada: ${escapeHtml(selectedOrigin.name)}.` : "Escolha uma origem para continuar."}</p>
        <details class="order-origin-builder">
          <summary>Cadastrar origem para esta ficha</summary>
          <p class="form-hint">O cadastro fica disponível neste assistente e na ficha criada. Informe as perícias e escreva um resumo próprio dos detalhes.</p>
          <div class="form-grid">
            <label><span>Nome da origem *</span><input name="originDraftName" required maxlength="80" placeholder="Nome da origem"></label>
            <label><span>Fonte *</span><select name="originDraftSource" required>
              <option value="Livro básico">Livro básico</option><option value="Marcas Fragmentadas">Marcas Fragmentadas</option>
              <option value="Personalizada">Personalizada</option></select></label>
            <label><span>Perícia treinada 1 *</span><select name="originDraftSkill1" required>${orderSkillOptions()}</select></label>
            <label><span>Perícia treinada 2 *</span><select name="originDraftSkill2" required>${orderSkillOptions()}</select></label>
            <label><span>Nome do poder de origem (opcional)</span><input name="originDraftPower" maxlength="100"></label>
          </div>
          <label class="full-field"><span>Descrição breve (opcional)</span><textarea name="originDraftDescription" rows="3" maxlength="1000"></textarea></label>
          <label class="full-field"><span>Notas do poder (opcional)</span><textarea name="originDraftPowerNotes" rows="3" maxlength="1000" placeholder="Escreva um resumo próprio ou consulte o livro."></textarea></label>
          <div class="form-actions"><button type="button" class="button button-outline" data-action="add-character-origin">Adicionar origem à lista</button></div>
        </details>
        <div class="form-actions"><button type="button" class="button button-outline" data-action="character-step" data-step="0">Voltar</button>
          <button type="button" class="button button-primary" data-action="character-step" data-step="2">Continuar para classe</button></div>
      </section>
      <section class="order-step-panel" data-order-step="2" hidden>
        <div><p class="eyebrow">Etapa 3 de 4</p><h2>Classe</h2>
          <p>Os campos de perícias de classe se ajustam ao Intelecto. Para Mundano, informe os valores acordados com o mestre.</p></div>
        <div class="form-grid">
          <label><span>Classe *</span><select name="orderClass" required>${classOptions}</select></label>
          <label data-order-fixed-skills ${selectedClass === "combatente" ? "" : "hidden"}>
            <span>Escolha de perícia fixa 1 *</span><select name="fixedSkill1" ${selectedClass === "combatente" ? "required" : "disabled"}>
              <option value="">Selecione</option><option value="Luta" ${field("Perícia fixa 1") === "Luta" ? "selected" : ""}>Luta</option>
              <option value="Pontaria" ${field("Perícia fixa 1") === "Pontaria" ? "selected" : ""}>Pontaria</option></select></label>
          <label data-order-fixed-skills ${selectedClass === "combatente" ? "" : "hidden"}>
            <span>Escolha de perícia fixa 2 *</span><select name="fixedSkill2" ${selectedClass === "combatente" ? "required" : "disabled"}>
              <option value="">Selecione</option><option value="Fortitude" ${field("Perícia fixa 2") === "Fortitude" ? "selected" : ""}>Fortitude</option>
              <option value="Reflexos" ${field("Perícia fixa 2") === "Reflexos" ? "selected" : ""}>Reflexos</option></select></label>
        </div>
        <p class="form-hint" data-order-occultist-skills ${selectedClass === "ocultista" ? "" : "hidden"}>Ocultismo e Vontade são adicionadas automaticamente para Ocultista.</p>
        <div class="form-grid order-mundano-fields" data-order-mundano-fields ${selectedClass === "mundano" ? "" : "hidden"}>${mundanoStats}</div>
        <div class="order-class-skills"><h3>Perícias treinadas pela classe</h3><div class="form-grid">${skillSlots}</div></div>
        <div class="form-actions"><button type="button" class="button button-outline" data-action="character-step" data-step="1">Voltar</button>
          <button type="button" class="button button-primary" data-action="character-step" data-step="3">Continuar para os detalhes</button></div>
      </section>
      <section class="order-step-panel" data-order-step="3" hidden>
        <div><p class="eyebrow">Etapa 4 de 4</p><h2>Toques finais</h2>
          <p>Revise os valores calculados e complete a descrição do agente.</p></div>
        <div class="form-grid">
          <label><span>Nome do personagem *</span><input name="name" required maxlength="80" value="${escapeHtml(character?.name || draft.name || "")}"></label>
          <label><span>Jogador</span><input name="playerName" maxlength="80" value="${escapeHtml(field("Jogador", currentUser().name))}"></label>
          <label><span>NEX</span><select name="nex">${nexOptions}</select></label>
          <label><span>PV atual</span><input name="currentPV" type="number" min="0" step="1" value="${escapeHtml(field("PV atual"))}"
            data-order-current data-saved-value="${field("PV atual") === "" ? "false" : "true"}"></label>
          <label><span>PE atual</span><input name="currentPE" type="number" min="0" step="1" value="${escapeHtml(field("PE atual"))}"
            data-order-current data-saved-value="${field("PE atual") === "" ? "false" : "true"}"></label>
          <label><span>Sanidade atual</span><input name="currentSAN" type="number" min="0" step="1" value="${escapeHtml(field("SAN atual"))}"
            data-order-current data-saved-value="${field("SAN atual") === "" ? "false" : "true"}"></label>
        </div>
        <div class="order-stat-summary" aria-live="polite">
          <h3>Resumo calculado</h3><dl>
            <div><dt>PV máximo</dt><dd data-order-stat="hp">${statSummary.hp}</dd></div>
            <div><dt>PE máximo</dt><dd data-order-stat="pe">${statSummary.pe}</dd></div>
            <div><dt>Sanidade máxima</dt><dd data-order-stat="san">${statSummary.san}</dd></div>
            <div><dt>Defesa sem proteção</dt><dd data-order-stat="defense">${statSummary.defense}</dd></div>
            <div><dt>DT de rituais</dt><dd data-order-stat="ritualDifficulty">${statSummary.ritualDifficulty}</dd></div>
            <div><dt>Carga máxima</dt><dd data-order-stat="carry">${statSummary.carry} espaços</dd></div>
            <div><dt>Bloqueio (Fortitude treinada)</dt><dd data-order-stat="block">5</dd></div>
            <div><dt>Esquiva (Reflexos treinados)</dt><dd data-order-stat="dodge">${statSummary.dodge}</dd></div>
          </dl><p class="form-hint">Defesa não considera proteção ou bônus. Progressão de poderes, trilhas, rituais e perícias veteranas/expert deve ser conferida e registrada conforme as regras da mesa.</p>
        </div>
        <div class="form-grid">
          <label><span>Aparência</span><textarea name="appearance" rows="3" maxlength="1000">${escapeHtml(field("Aparência"))}</textarea></label>
          <label><span>Personalidade</span><textarea name="personality" rows="3" maxlength="1000">${escapeHtml(field("Personalidade"))}</textarea></label>
          <label><span>Histórico</span><textarea name="background" rows="3" maxlength="2000">${escapeHtml(field("Histórico"))}</textarea></label>
          <label><span>Objetivo</span><textarea name="objective" rows="3" maxlength="1000">${escapeHtml(field("Objetivo"))}</textarea></label>
        </div>
        <label class="full-field"><span>Anotações</span><textarea name="notes" rows="3" maxlength="5000">${escapeHtml(character?.notes || "")}</textarea></label>
        <div class="form-actions"><button type="button" class="button button-outline" data-action="character-step" data-step="2">Voltar</button>
          <button class="button button-primary" type="submit">${character ? "Salvar agente" : "Finalizar e criar agente"}</button></div>
      </section>
    </form>`);
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
  if (selectedSystem === "ordem") return renderOrderCharacterForm(character, campaignId);
  const sys = systems[selectedSystem];
  return pageLayout(`${pageHeader("Ficha de personagem", character ? "Editar ficha" : "Criar ficha", "Os campos do sistema são exemplos de interface; confirme edição e regras antes de usar em jogo.", routeLink("#painel", "Cancelar"))}
    <form class="content-panel form-panel" data-form="character" data-id="${character?.id || ""}">
      <div class="form-grid">
        <label><span>Nome do personagem *</span><input name="name" required value="${escapeHtml(character?.name || "")}"></label>
        <label><span>Sistema *</span><select name="system" required>
          ${Object.entries(systems).map(([key, value]) => `<option value="${key}" ${key === selectedSystem ? "selected" : ""}>${escapeHtml(value.name)}</option>`).join("")}
        </select></label>
        <label><span>Campanha</span><select name="campaignId"><option value="">Sem campanha</option>
          ${availableCharacterCampaigns(character, selectedSystem).map((campaign) => `<option value="${campaign.id}" ${campaign.id === (character?.campaignId || campaignId) ? "selected" : ""}>${escapeHtml(campaign.name)}</option>`).join("")}
        </select></label>
        <p class="form-hint">Jogadores podem vincular uma ficha própria por campanha; para trocar, desvincule a atual. Mestres não têm esse limite.</p>
        <label><span>${escapeHtml(sys.extra)}</span><input name="extra" value="${escapeHtml(fields[sys.extra] || "")}" placeholder="Ex.: atributo do personagem"></label>
        <label><span>Pontos de vida (exemplo)</span><input name="hp" type="number" min="0" value="${escapeHtml(fields["Pontos de vida"] || "")}" placeholder="0"></label>
        <label><span>${escapeHtml(sys.resource)} (exemplo)</span><input name="resource" value="${escapeHtml(fields[sys.resource] || "")}" placeholder="Campo ilustrativo"></label>
      </div>
      <label class="full-field"><span>Observações da ficha</span><textarea name="notes" rows="4" placeholder="Notas pessoais">${escapeHtml(character?.notes || "")}</textarea></label>
      <div class="form-actions"><button class="button button-primary" type="submit">${character ? "Salvar alterações" : "Criar ficha"}</button></div>
    </form>`);
}

function renderOrderCharacterSheet(character, campaign, options = {}) {
  const fields = character.fields || {};
  const value = (name, fallback = "—") => fields[name] === undefined || fields[name] === ""
    ? fallback
    : String(fields[name]);
  const attributes = orderAttributes.map(({ key, name }) => ({
    key,
    name,
    value: value(name)
  }));
  const trainedSkills = new Set(
    (fields["Perícias treinadas"] || "")
      .split(/\r?\n/)
      .map((skill) => skill.replace(/\s*\(\+5 base\)$/, "").trim())
      .filter(Boolean)
  );
  const skillRows = orderSkills.map((skill) => `<li class="order-sheet-skill ${trainedSkills.has(skill.name) ? "is-trained" : ""}">
    <span class="order-sheet-skill-name">${escapeHtml(skill.name)}</span>
    <span class="order-sheet-skill-attribute">${skill.attribute}</span>
    <span class="order-sheet-skill-training">${trainedSkills.has(skill.name) ? "Treinada · +5 base" : "Sem treino"}</span>
    ${skill.loadPenalty ? `<span class="order-sheet-skill-note">Penalidade de carga</span>` : ""}
  </li>`).join("");
  const resource = (label, currentName, maximumName, inputName, color) => {
    const current = Number(fields[currentName]);
    const maximum = Number(fields[maximumName]);
    const hasValues = Number.isFinite(current) && Number.isFinite(maximum) && maximum > 0;
    const percentage = hasValues ? Math.max(0, Math.min(100, current / maximum * 100)) : 0;
    return `<article class="order-sheet-resource" style="--resource-color:${color}">
      <div class="order-sheet-resource-heading"><h3>${label}</h3>
        <strong>${escapeHtml(value(currentName))}<span> / ${escapeHtml(value(maximumName))}</span></strong></div>
      ${canEditResources ? `<label class="order-sheet-resource-input"><span>Valor atual</span>
        <input type="number" name="${inputName}" min="0" max="${maximum}" step="1" required
          value="${escapeHtml(value(currentName, "0"))}" aria-label="${label} atuais"></label>` : ""}
      <progress value="${hasValues ? percentage : 0}" max="100" aria-label="${label}: ${escapeHtml(value(currentName))} de ${escapeHtml(value(maximumName))}"></progress>
    </article>`;
  };
  const detail = (label, fieldName) => `<div class="order-sheet-detail">
    <span>${label}</span><strong>${escapeHtml(value(fieldName))}</strong></div>`;
  const resourceLimitsAvailable = ["PV máximo", "PE máximo", "SAN máxima"].every((name) =>
    Number.isSafeInteger(Number(fields[name])) && Number(fields[name]) > 0
  );
  const canEditResources = options.canEditResources && resourceLimitsAvailable;
  const activeSession = options.activeSession;
  const storyFields = [
    ["Aparência", "Aparência"],
    ["Personalidade", "Personalidade"],
    ["Histórico", "Histórico"],
    ["Objetivo", "Objetivo"]
  ].filter(([, name]) => fields[name]);
  const knownFields = new Set([
    ...orderAttributes.map(({ name }) => name),
    "Origem", "Fonte da origem", "Descrição da origem", "Perícia de origem 1", "Perícia de origem 2",
    "Perícias da origem", "Poder da origem", "Efeito do poder de origem", "Classe", "Classe ID",
    "Perícia fixa 1", "Perícia fixa 2", "Perícias de classe", "Perícias treinadas", "NEX",
    "PV máximo", "PV atual", "PE máximo", "PE atual", "SAN máxima", "SAN atual",
    "Defesa sem proteção", "DT de rituais", "Carga máxima", "Bloqueio", "Esquiva",
    "Jogador", "Aparência", "Personalidade", "Histórico", "Objetivo",
    "Ataques",
    "Mundano perícias de classe", "Mundano PV inicial", "Mundano PV por NEX",
    "Mundano PE inicial", "Mundano PE por NEX", "Mundano SAN inicial", "Mundano SAN por NEX",
    ...Array.from({ length: 10 }, (_, index) => `Perícia de classe ${index + 1}`)
  ]);
  const otherFields = Object.entries(fields).filter(([name, fieldValue]) => !knownFields.has(name) && fieldValue !== "");

  return `<div class="order-sheet">
    <section class="content-panel order-sheet-overview" aria-label="Resumo do agente">
      <div class="order-sheet-identity">
        <p class="eyebrow">Ficha de agente · ${escapeHtml(value("NEX"))} NEX</p>
        <h2>${escapeHtml(character.name)}</h2>
        <p>${escapeHtml(value("Classe"))}${fields["Origem"] ? ` · ${escapeHtml(value("Origem"))}` : ""}</p>
      </div>
      <div class="order-sheet-meta">
        ${fields["Jogador"] ? detail("Jogador", "Jogador") : ""}
        ${campaign ? `<div class="order-sheet-detail"><span>Campanha</span><strong>${escapeHtml(campaign.name)}</strong></div>` : ""}
      </div>
    </section>
    ${canEditResources ? `<form class="order-sheet-resources" data-form="character-resources" data-id="${escapeHtml(character.id)}"
      aria-label="Recursos atuais">
      ${resource("Pontos de vida", "PV atual", "PV máximo", "hp", "#c84c4c")}
      ${resource("Pontos de esforço", "PE atual", "PE máximo", "pe", "#d99132")}
      ${resource("Sanidade", "SAN atual", "SAN máxima", "san", "#9d63d7")}
      <div class="order-sheet-resource-actions">
        <p class="form-hint" role="status">${activeSession
          ? "Sessão ativa: ao salvar, cada recurso alterado será registrado na linha do tempo."
          : "Os valores ficam salvos na ficha. Durante uma sessão ativa, as alterações também entram na linha do tempo."}</p>
        <button class="button button-primary" type="submit">Salvar recursos</button>
      </div>
    </form>` : `<section class="order-sheet-resources" aria-label="Recursos atuais">
      ${resource("Pontos de vida", "PV atual", "PV máximo", "hp", "#c84c4c")}
      ${resource("Pontos de esforço", "PE atual", "PE máximo", "pe", "#d99132")}
      ${resource("Sanidade", "SAN atual", "SAN máxima", "san", "#9d63d7")}
    </section>${options.canEditResources && !resourceLimitsAvailable
      ? `<p class="form-hint">Não foi possível editar os recursos: a ficha não tem limites máximos válidos cadastrados.</p>`
      : ""}`}
    <div class="order-sheet-columns">
      <div class="order-sheet-side">
        <section class="content-panel order-sheet-panel">
          <div class="panel-heading"><h2>Atributos</h2></div>
          <div class="order-sheet-attributes">${attributes.map(({ key, name, value: attributeValue }) => `<div class="order-sheet-attribute">
            <span>${escapeHtml(name)} <small>${key}</small></span><strong>${escapeHtml(attributeValue)}</strong>
          </div>`).join("")}</div>
        </section>
        <section class="content-panel order-sheet-panel">
          <div class="panel-heading"><h2>Combate e limites</h2></div>
          <div class="order-sheet-details">
            ${detail("Defesa", "Defesa sem proteção")}
            ${detail("Bloqueio", "Bloqueio")}
            ${detail("Esquiva", "Esquiva")}
            ${detail("DT de rituais", "DT de rituais")}
            ${detail("Carga máxima", "Carga máxima")}
          </div>
        </section>
      </div>
      <section class="content-panel order-sheet-panel order-sheet-skills-panel">
        <div class="panel-heading"><h2>Perícias</h2><span class="form-hint">Atributo · treino</span></div>
        <ul class="order-sheet-skills">${skillRows}</ul>
        <p class="order-sheet-legend">Perícias treinadas recebem o bônus-base indicado. Penalidades de carga podem afetar algumas perícias.</p>
      </section>
      <div class="order-sheet-side">
        ${fields["Poder da origem"] || fields["Efeito do poder de origem"] ? `<section class="content-panel order-sheet-panel">
          <div class="panel-heading"><h2>Origem</h2></div>
          ${fields["Descrição da origem"] ? `<p>${escapeHtml(value("Descrição da origem"))}</p>` : ""}
          ${fields["Perícias da origem"] ? detail("Perícias treinadas", "Perícias da origem") : ""}
          ${fields["Poder da origem"] ? `<h3 class="order-sheet-power-title">${escapeHtml(value("Poder da origem"))}</h3>` : ""}
          ${fields["Efeito do poder de origem"] ? `<p>${escapeHtml(value("Efeito do poder de origem"))}</p>` : ""}
        </section>` : ""}
        ${storyFields.length ? `<section class="content-panel order-sheet-panel">
          <div class="panel-heading"><h2>Descrição do agente</h2></div>
          ${storyFields.map(([label, name]) => `<div class="order-sheet-story"><h3>${label}</h3><p>${escapeHtml(value(name))}</p></div>`).join("")}
        </section>` : ""}
        ${otherFields.length ? `<section class="content-panel order-sheet-panel">
          <div class="panel-heading"><h2>Outros campos</h2></div>
          <div class="order-sheet-details">${otherFields.map(([name, fieldValue]) => `<div class="order-sheet-detail">
            <span>${escapeHtml(name)}</span><strong>${escapeHtml(String(fieldValue))}</strong>
          </div>`).join("")}</div>
        </section>` : ""}
      </div>
    </div>
    ${character.notes ? `<section class="content-panel order-sheet-panel"><div class="panel-heading"><h2>Anotações</h2></div>
      <p class="order-sheet-notes">${escapeHtml(character.notes)}</p></section>` : ""}
  </div>`;
}

function renderCharacterTabs(sheetContent, combatContent) {
  return `<div class="character-tab-container" data-character-tabs>
    <nav class="character-tabs" role="tablist" aria-label="Seções da ficha">
      <button class="character-tab-button is-current" id="character-tab-ficha" type="button" role="tab"
        aria-selected="true" aria-controls="character-panel-ficha" data-action="character-tab" data-tab="ficha">Ficha</button>
      <button class="character-tab-button" id="character-tab-combate" type="button" role="tab"
        aria-selected="false" aria-controls="character-panel-combate" data-action="character-tab" data-tab="combate" tabindex="-1">Combate</button>
    </nav>
    <section class="character-tab-panel" id="character-panel-ficha" role="tabpanel"
      aria-labelledby="character-tab-ficha" data-character-tab-panel="ficha">${sheetContent}</section>
    ${combatContent}
  </div>`;
}

function renderGenericCombatPanel() {
  return `<section class="character-tab-panel combat-tab-panel" id="character-panel-combate" role="tabpanel"
    aria-labelledby="character-tab-combate" data-character-tab-panel="combate" hidden>
    <div class="content-panel">${renderCombatRoller()}
      <p class="form-hint">O cadastro de ataques será configurado quando as regras deste sistema forem definidas.</p>
    </div>
  </section>`;
}

function renderCharacter(id, sessionId = "") {
  const character = getCharacter(id);
  if (!character || !currentUser() || (character.owner !== currentUser().id && !canAccessCampaign(getCampaign(character.campaignId)))) {
    return pageLayout(`<section class="access-card"><p class="eyebrow">Ficha privada</p><h1>Ficha indisponível</h1>
      <p>Esta ficha não existe ou você não tem permissão para consultá-la.</p>${routeLink("#painel", "Voltar ao painel")}</section>`);
  }
  const campaign = getCampaign(character.campaignId);
  const returnSession = data.sessions.find((session) =>
    session.id === sessionId && session.campaignId === campaign?.id && session.status === "active"
  );
  const returnLink = returnSession && canAccessCampaign(campaign)
    ? routeLink(`#sessao/${returnSession.id}`, "Voltar à sessão")
    : campaign ? routeLink(`#campanha/${campaign.id}`, "Voltar à campanha") : routeLink("#painel", "Voltar ao painel");
  if (character.system === "ordem") {
    const activeSession = campaign && data.sessions.find((session) =>
      session.campaignId === campaign.id && session.status === "active"
    );
    const canEditResources = character.owner === currentUser().id || canManageCampaign(campaign);
    return pageLayout(`${pageHeader("Ordem Paranormal", escapeHtml(character.name),
      campaign ? `Campanha: ${escapeHtml(campaign.name)}` : "Ficha sem campanha vinculada.",
      character.owner === currentUser().id ? routeLink(`#ficha/${character.id}/editar`, "Editar ficha", "button button-primary") : "")}
      ${renderCharacterTabs(
        renderOrderCharacterSheet(character, campaign, { canEditResources, activeSession: Boolean(activeSession) }),
        renderOrderCombatPanel(character, character.owner === currentUser().id)
      )}
      ${returnLink}`);
  }
  const fields = Object.entries(character.fields || {}).map(([name, value]) => `<div class="character-stat"><span>${escapeHtml(name)}</span><strong>${escapeHtml(value || "—")}</strong></div>`).join("");
  return pageLayout(`${pageHeader(escapeHtml(getSystemName(character.system)), escapeHtml(character.name),
    campaign ? `Campanha: ${escapeHtml(campaign.name)}` : "Ficha sem campanha vinculada.",
    character.owner === currentUser().id ? routeLink(`#ficha/${character.id}/editar`, "Editar ficha", "button button-primary") : "")}
    ${renderCharacterTabs(
      `<section class="content-panel"><h2>Resumo da ficha</h2><div class="character-stats">${fields}</div>
        ${character.notes ? `<h3>Observações</h3><p>${escapeHtml(character.notes)}</p>` : ""}</section>`,
      renderGenericCombatPanel()
    )}
    ${returnLink}`);
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
  const characterItems = characters.map((character) => `<article class="list-card compact-card">
    <div><h3>${escapeHtml(character.name)}</h3><p>${escapeHtml(getSystemName(character.system))}</p></div>
    ${routeLink(`#ficha/${character.id}?sessao=${session.id}`, character.system === "ordem" ? "Abrir ficha e atualizar recursos" : "Abrir ficha")}
  </article>`).join("");
  return pageLayout(`${pageHeader(`Sessão ${getCampaignSessionNumber(session)} · em andamento`, escapeHtml(campaign.name),
    `Iniciada em ${formatDateTime(session.startedAt)}.`, routeLink(`#campanha/${campaign.id}`, "Voltar à campanha"))}
    <p class="live-banner"><span class="status-dot"></span> Sessão ativa · altere PV, PE e Sanidade dentro da ficha do personagem; as mudanças serão registradas automaticamente.</p>
    <section class="content-panel"><div class="panel-heading"><h2>Fichas da campanha</h2></div>
      <div class="list-stack">${characterItems || `<p class="empty-panel">Ainda não há fichas vinculadas a esta campanha.</p>`}</div>
      <p class="form-hint">Jogadores podem atualizar as próprias fichas. O mestre pode atualizar os recursos de todas as fichas da campanha.</p>
    </section>
    <section class="content-panel"><div class="panel-heading"><h2>Linha do tempo</h2><span class="status-chip">Registro automático</span></div>
      ${events ? `<ol class="timeline">${events}</ol>` : `<p class="empty-panel">Ainda não há alterações registradas nesta sessão.</p>`}
    </section>
    ${isMaster ? `<p class="form-hint">Para encerrar esta sessão, volte à campanha e escolha “Encerrar sessão”. O resumo será obrigatório.</p>`
      : `<p class="form-hint">Somente o mestre pode encerrar a sessão. O resumo e a linha do tempo ficarão disponíveis a todos os participantes.</p>`}`);
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
  return pageLayout(`${pageHeader(`Sessão ${getCampaignSessionNumber(session)} · resumo`, escapeHtml(campaign.name),
    `Finalizada em ${formatDateTime(session.endedAt || session.startedAt)}.`,
    routeLink(`#campanha/${campaign.id}`, "Voltar à campanha"))}
    <div class="summary-grid">
      <section class="content-panel"><p class="eyebrow">Texto escrito pelo mestre</p><h2>Resumo do mestre</h2>
        <p>${escapeHtml(session.masterSummary || "O mestre não registrou um resumo.")}</p></section>
      <section class="content-panel"><p class="eyebrow">Derivado dos eventos</p><h2>Resumo automático</h2>
        <p>${escapeHtml(automaticSummary(session))}</p></section>
    </div>
    <section class="content-panel"><div class="panel-heading"><h2>Linha do tempo da sessão ${getCampaignSessionNumber(session)}</h2><span class="status-chip">Eventos registrados</span></div>
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
      <p>${escapeHtml(bootstrapError)}</p><p>Confira a configuração do Supabase, as migrações e se o servidor está em execução.</p>
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
  if (!currentUser() && ["painel", "campanha", "campanhas", "minhas-campanhas", "nova-campanha", "ficha", "sessao", "historico", "gestao-mesa"].includes(route.page)) {
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
    case "nova-campanha":
      appPage.innerHTML = renderCampaignCreationForm();
      break;
    case "campanha":
      appPage.innerHTML = renderCampaign(route.id, route.action === "encerrar");
      break;
    case "ficha":
      if (route.action === "editar") appPage.innerHTML = renderCharacterForm(route.id);
      else if (route.id === "nova") appPage.innerHTML = renderCharacterForm("nova", route.query.get("campanha"));
      else appPage.innerHTML = renderCharacter(route.id, route.query.get("sessao") || "");
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
  const orderCharacterForm = appPage.querySelector('form[data-form="character"][data-system="ordem"]');
  if (orderCharacterForm) updateOrderCharacterForm(orderCharacterForm);
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

function getOrderFormAttributes(form) {
  return Object.fromEntries(orderAttributes.map(({ key }) => [
    key,
    Number(form.elements.namedItem(`attribute${key}`)?.value || 0)
  ]));
}

function getOrderFormStats(form) {
  const classId = form.elements.namedItem("orderClass").value;
  const customStats = classId === "mundano" ? {
    pv: Number(form.elements.namedItem("mundanoPV").value || 0),
    pvPerNex: Number(form.elements.namedItem("mundanoPVPerNex").value || 0),
    pe: Number(form.elements.namedItem("mundanoPE").value || 0),
    pePerNex: Number(form.elements.namedItem("mundanoPEPerNex").value || 0),
    san: Number(form.elements.namedItem("mundanoSAN").value || 0),
    sanPerNex: Number(form.elements.namedItem("mundanoSANPerNex").value || 0)
  } : {};
  const nex = Number(form.elements.namedItem("nex").value || 5);
  return calculateOrderStats(classId, getOrderFormAttributes(form), nex, customStats);
}

function updateOrderCharacterForm(form) {
  const attributes = getOrderFormAttributes(form);
  const zeros = Object.values(attributes).filter((value) => value === 0).length;
  const pointsSpent = Object.values(attributes).reduce((total, value) => total + Math.max(0, value - 1), 0);
  const pointsRemaining = 4 + Math.min(zeros, 1) - pointsSpent;
  const remainingLabel = form.querySelector("[data-order-points-remaining]");
  if (remainingLabel) remainingLabel.textContent = String(pointsRemaining);

  const classId = form.elements.namedItem("orderClass").value;
  const requiredSkillCount = classId === "mundano"
    ? Number(form.elements.namedItem("mundanoSkillCount").value || 0)
    : Math.min(10, (orderClasses[classId]?.skillCount || 0) + attributes.INT);
  form.querySelectorAll("[data-order-skill-slot]").forEach((slot, index) => {
    const select = slot.querySelector("select");
    const enabled = index < requiredSkillCount;
    slot.hidden = !enabled;
    select.disabled = !enabled;
    select.required = enabled;
  });

  const isCombatant = classId === "combatente";
  form.querySelectorAll("[data-order-fixed-skills]").forEach((label) => {
    const select = label.querySelector("select");
    label.hidden = !isCombatant;
    select.disabled = !isCombatant;
    select.required = isCombatant;
  });
  form.querySelector("[data-order-occultist-skills]").hidden = classId !== "ocultista";
  const mundanoFields = form.querySelector("[data-order-mundano-fields]");
  mundanoFields.hidden = classId !== "mundano";
  mundanoFields.querySelectorAll("[data-mundano-stat]").forEach((input) => {
    input.disabled = classId !== "mundano";
    input.required = classId === "mundano";
  });

  const stats = getOrderFormStats(form);
  for (const [key, value] of Object.entries(stats)) {
    const output = form.querySelector(`[data-order-stat="${key}"]`);
    if (output) output.textContent = key === "carry" ? `${value} espaços` : String(value);
  }
  const trained = new Set([
    form.elements.namedItem("originSkill1").value,
    form.elements.namedItem("originSkill2").value,
    form.elements.namedItem("fixedSkill1").value,
    form.elements.namedItem("fixedSkill2").value,
    ...(classId === "ocultista" ? ["Ocultismo", "Vontade"] : []),
    ...[...form.querySelectorAll(".order-class-skill select:not(:disabled)")].map((select) => select.value)
  ].filter(Boolean));
  form.querySelector('[data-order-stat="block"]').textContent = trained.has("Fortitude") ? "5" : "0";
  form.querySelector('[data-order-stat="dodge"]').textContent = String(10 + attributes.AGI + (trained.has("Reflexos") ? 5 : 0));
  for (const [inputName, maximum] of [["currentPV", stats.hp], ["currentPE", stats.pe], ["currentSAN", stats.san]]) {
    const input = form.elements.namedItem(inputName);
    input.max = String(maximum);
    if (input.dataset.savedValue !== "true" && input.dataset.userEdited !== "true") input.value = String(maximum);
    input.setCustomValidity(input.value && Number(input.value) > maximum ? `O valor atual não pode ultrapassar ${maximum}.` : "");
  }
}

function setOrderCharacterStep(form, step) {
  form.dataset.currentStep = String(step);
  form.querySelectorAll("[data-order-step]").forEach((panel) => {
    panel.hidden = Number(panel.dataset.orderStep) !== step;
  });
  form.querySelectorAll(".order-step-button").forEach((button) => {
    const current = Number(button.dataset.step) === step;
    button.classList.toggle("is-current", current);
    button.setAttribute("aria-current", current ? "step" : "false");
  });
}

function validateOrderStep(form, step) {
  const panel = form.querySelector(`[data-order-step="${step}"]`);
  const fields = [...panel.querySelectorAll("input, select, textarea")].filter((input) =>
    !input.disabled && input.type !== "hidden" && !input.closest(".order-origin-builder")
      && !input.matches("[data-origin-search], [data-origin-choice]")
  );
  const invalid = fields.find((input) => !input.checkValidity());
  if (invalid) {
    setOrderCharacterStep(form, step);
    invalid.reportValidity();
    return false;
  }
  if (step === 0) {
    const attributes = getOrderFormAttributes(form);
    const zeros = Object.values(attributes).filter((value) => value === 0).length;
    const spent = Object.values(attributes).reduce((total, value) => total + Math.max(0, value - 1), 0);
    if (zeros > 1 || spent > 4 + Math.min(zeros, 1)) {
      showPageNotice("Revise a distribuição: no máximo um atributo pode ficar em 0 e os pontos disponíveis não podem ser excedidos.", true);
      return false;
    }
  }
  if (step === 1 && form.dataset.selectedOrigin !== "true") {
    showPageNotice("Cadastre ou escolha uma origem antes de continuar.", true);
    return false;
  }
  if (step === 1) {
    const selectedCard = form.querySelector(".order-origin-card.is-selected");
    const choices = [...(selectedCard?.querySelectorAll("[data-origin-choice]") || [])];
    if (choices.some((select) => !select.checkValidity())) {
      choices.find((select) => !select.checkValidity()).reportValidity();
      return false;
    }
    if (form.elements.namedItem("originSkill1").value === form.elements.namedItem("originSkill2").value) {
      showPageNotice("Escolha duas perícias diferentes para a origem.", true);
      return false;
    }
  }
  if (step === 2) {
    const classId = form.elements.namedItem("orderClass").value;
    const classSkills = [
      form.elements.namedItem("fixedSkill1").value,
      form.elements.namedItem("fixedSkill2").value,
      ...(classId === "ocultista" ? ["Ocultismo", "Vontade"] : []),
      ...[...form.querySelectorAll(".order-class-skill select:not(:disabled)")].map((select) => select.value)
    ].filter(Boolean);
    if (new Set(classSkills).size !== classSkills.length) {
      showPageNotice("Escolha perícias de classe diferentes para não duplicar treinamento.", true);
      return false;
    }
  }
  return true;
}

function buildOrderCharacterFields(form, values) {
  const attributes = getOrderFormAttributes(form);
  const classId = values.get("orderClass");
  const nex = Number(values.get("nex") || 5);
  const customStats = classId === "mundano" ? {
    pv: Number(values.get("mundanoPV")),
    pvPerNex: Number(values.get("mundanoPVPerNex")),
    pe: Number(values.get("mundanoPE")),
    pePerNex: Number(values.get("mundanoPEPerNex")),
    san: Number(values.get("mundanoSAN")),
    sanPerNex: Number(values.get("mundanoSANPerNex"))
  } : {};
  const stats = calculateOrderStats(classId, attributes, nex, customStats);
  const originSkills = [values.get("originSkill1"), values.get("originSkill2")];
  const classSkillChoices = [...form.querySelectorAll(".order-class-skill select:not(:disabled)")].map((select) => select.value);
  const classSkills = [
    values.get("fixedSkill1"),
    values.get("fixedSkill2"),
    ...(classId === "ocultista" ? ["Ocultismo", "Vontade"] : []),
    ...classSkillChoices
  ].filter(Boolean);
  const trainedSkills = [...new Set([...originSkills, ...classSkills])];
  const currentValue = (name, maximum) => {
    const value = values.get(name);
    return value === null || value === "" ? maximum : Math.min(Number(value), maximum);
  };
  const fields = {
    "Força": String(attributes.FOR),
    "Agilidade": String(attributes.AGI),
    "Intelecto": String(attributes.INT),
    "Vigor": String(attributes.VIG),
    "Presença": String(attributes.PRE),
    "Origem": values.get("originName").trim(),
    "Fonte da origem": values.get("originSource").trim(),
    "Descrição da origem": values.get("originDescription").trim(),
    "Perícia de origem 1": values.get("originSkill1"),
    "Perícia de origem 2": values.get("originSkill2"),
    "Perícias da origem": originSkills.join("; "),
    "Poder da origem": values.get("originPower").trim(),
    "Efeito do poder de origem": values.get("originPowerNotes").trim(),
    "Classe": orderClasses[classId]?.name || "Mundano",
    "Classe ID": classId,
    "Perícia fixa 1": values.get("fixedSkill1") || "",
    "Perícia fixa 2": values.get("fixedSkill2") || "",
    "Perícias de classe": classSkills.join("; "),
    "Perícias treinadas": trainedSkills.map((skill) => `${skill} (+5 base)`).join("\n"),
    "NEX": `${nex}%`,
    "PV máximo": String(stats.hp),
    "PV atual": String(currentValue("currentPV", stats.hp)),
    "PE máximo": String(stats.pe),
    "PE atual": String(currentValue("currentPE", stats.pe)),
    "SAN máxima": String(stats.san),
    "SAN atual": String(currentValue("currentSAN", stats.san)),
    "Defesa sem proteção": String(stats.defense),
    "DT de rituais": String(stats.ritualDifficulty),
    "Carga máxima": `${stats.carry} espaços`,
    "Bloqueio": String(trainedSkills.includes("Fortitude") ? 5 : 0),
    "Esquiva": String(10 + attributes.AGI + (trainedSkills.includes("Reflexos") ? 5 : 0)),
    "Jogador": values.get("playerName").trim(),
    "Aparência": values.get("appearance").trim(),
    "Personalidade": values.get("personality").trim(),
    "Histórico": values.get("background").trim(),
    "Objetivo": values.get("objective").trim(),
    "Ataques": JSON.parse(values.get("attacks") || "[]"),
    ...Object.fromEntries(classSkillChoices.map((skill, index) => [`Perícia de classe ${index + 1}`, skill]))
  };
  if (classId === "mundano") {
    fields["Mundano perícias de classe"] = String(values.get("mundanoSkillCount"));
    fields["Mundano PV inicial"] = String(customStats.pv);
    fields["Mundano PV por NEX"] = String(customStats.pvPerNex);
    fields["Mundano PE inicial"] = String(customStats.pe);
    fields["Mundano PE por NEX"] = String(customStats.pePerNex);
    fields["Mundano SAN inicial"] = String(customStats.san);
    fields["Mundano SAN por NEX"] = String(customStats.sanPerNex);
  }
  return fields;
}

async function handlePageSubmit(event) {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  const formType = form.dataset.form;
  const values = new FormData(form);
  try {
    if (formType === "character-attacks") {
      await saveCharacterAttack(form);
      return;
    }

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
      if (system === "ordem") {
        updateOrderCharacterForm(form);
        for (let step = 0; step < 4; step += 1) {
          if (!validateOrderStep(form, step)) return;
        }
        const payload = {
          name: values.get("name").trim(),
          system,
          campaignId: values.get("campaignId") || null,
          fields: buildOrderCharacterFields(form, values),
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

    if (formType === "character-resources") {
      await apiRequest(`/characters/${form.dataset.id}/resources`, {
        method: "PATCH",
        body: JSON.stringify({
          hp: Number(values.get("hp")),
          pe: Number(values.get("pe")),
          san: Number(values.get("san"))
        })
      });
      await renderRoute();
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

    if (formType === "finish-session") {
      const summary = values.get("summary").trim();
      if (!summary) throw new Error("Escreva um resumo antes de finalizar a sessão.");
      await apiRequest(`/sessions/${form.dataset.id}/finish`, {
        method: "POST",
        body: JSON.stringify({ summary })
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

  if (action === "character-tab") {
    setCharacterTab(actionButton.closest("[data-character-tabs]"), actionButton.dataset.tab);
    return;
  }

  if (action === "roll-dice") {
    const roller = actionButton.closest("[data-dice-roller]");
    const count = Number(roller.querySelector("[data-dice-count]").value);
    const sides = Number(roller.querySelector("[data-dice-sides]").value);
    if (!Number.isInteger(count) || count < 1 || count > 20 || ![4, 6, 8, 10, 12, 20, 100].includes(sides)) {
      showPageNotice("Escolha entre 1 e 20 dados e um tipo de dado disponível.", true);
      return;
    }
    const rolls = Array.from({ length: count }, () => rollDie(sides));
    roller.querySelector("[data-dice-result]").textContent =
      `d${sides}: ${rolls.join(", ")} · total: ${rolls.reduce((sum, roll) => sum + roll, 0)}`;
    return;
  }

  if (action === "roll-attack") {
    const natural = rollDie(20);
    const bonus = Number(actionButton.dataset.bonus);
    const total = natural + bonus;
    const bonusText = bonus >= 0 ? `+ ${bonus}` : `− ${Math.abs(bonus)}`;
    const criticalReached = natural >= Number(actionButton.dataset.critical);
    actionButton.closest(".attack-card").querySelector("[data-attack-result]").textContent =
      `d20 natural: ${natural} ${bonusText} = ${total}.${criticalReached ? " Faixa de crítico configurada atingida." : ""}`;
    return;
  }

  if (action === "add-extra-damage") {
    const form = actionButton.closest('form[data-system="ordem"]');
    const list = form.querySelector("[data-extra-damage-list]");
    if (list.children.length >= 10) {
      showPageNotice("Um ataque pode ter no máximo 10 danos extras.", true);
      return;
    }
    list.insertAdjacentHTML("beforeend", renderExtraDamageRow());
    list.lastElementChild.querySelector("input").focus();
    return;
  }

  if (action === "remove-extra-damage") {
    actionButton.closest("[data-extra-damage-row]").remove();
    return;
  }

  if (action === "select-gallery-image") {
    const form = actionButton.closest('form[data-system="ordem"]');
    setGalleryImage(form, actionButton.dataset.id);
    return;
  }

  if (action === "upload-gallery-image") {
    actionButton.disabled = true;
    actionButton.textContent = "Enviando...";
    try {
      await uploadGalleryImage(actionButton.closest('form[data-system="ordem"]'));
    } catch (error) {
      showPageNotice(error.message, true);
    } finally {
      actionButton.disabled = false;
      actionButton.textContent = "Enviar para a galeria";
    }
    return;
  }

  if (action === "format-attack-notes") {
    document.execCommand(actionButton.dataset.command, false);
    return;
  }

  if (action === "save-character-attack") {
    const form = actionButton.closest('form[data-system="ordem"]');
    try {
      await saveCharacterAttack(form);
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "cancel-character-attack") {
    resetCharacterAttackEditor(actionButton.closest('form[data-system="ordem"]'));
    return;
  }

  if (action === "edit-character-attack") {
    const form = actionButton.closest('form[data-system="ordem"]');
    try {
      const attack = characterAttacks(form).find((item) => item.id === actionButton.dataset.id);
      if (!attack) throw new Error("Este ataque não está mais disponível para edição.");
      editCharacterAttack(form, attack);
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "delete-character-attack") {
    const form = actionButton.closest('form[data-system="ordem"]');
    try {
      const attacks = characterAttacks(form).filter((item) => item.id !== actionButton.dataset.id);
      await persistCharacterAttacks(form, attacks);
      if (form.querySelector(".attack-builder").dataset.editingAttack === actionButton.dataset.id) {
        resetCharacterAttackEditor(form);
      }
      showPageNotice("Ataque removido da ficha.");
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "add-character-origin") {
    const form = actionButton.closest('form[data-system="ordem"]');
    const builder = actionButton.closest(".order-origin-builder");
    const inputs = [...builder.querySelectorAll("input, select, textarea")];
    const invalid = inputs.find((input) => !input.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      return;
    }
    const draftValue = (name) => builder.querySelector(`[name="${name}"]`).value;
    const origin = {
      name: draftValue("originDraftName").trim(),
      source: draftValue("originDraftSource"),
      description: draftValue("originDraftDescription").trim(),
      skills: [
        draftValue("originDraftSkill1"),
        draftValue("originDraftSkill2")
      ],
      power: draftValue("originDraftPower").trim(),
      powerNotes: draftValue("originDraftPowerNotes").trim()
    };
    if (origin.skills[0] === origin.skills[1]) {
      showPageNotice("Escolha duas perícias diferentes para a origem.", true);
      return;
    }
    const duplicate = [...form.querySelectorAll("[data-origin-card]")].some((card) =>
      card.dataset.originName.toLocaleLowerCase("pt-BR") === origin.name.toLocaleLowerCase("pt-BR")
        && card.dataset.originSource === origin.source
    );
    if (duplicate) {
      showPageNotice("Já existe uma origem com esse nome e fonte na lista.", true);
      return;
    }
    form.querySelector("[data-origin-list]").insertAdjacentHTML("beforeend", renderOrderOriginCard(origin));
    for (const input of inputs) input.value = "";
    builder.querySelector('[name="originDraftSource"]').value = "Livro básico";
    builder.open = false;
    filterOrderOriginCards(form);
    showPageNotice("Origem adicionada. Selecione-a na lista para continuar.");
    return;
  }

  if (action === "select-character-origin") {
    const form = actionButton.closest('form[data-system="ordem"]');
    selectOrderOrigin(form, actionButton.closest("[data-origin-card]"));
    return;
  }

  if (action === "character-step") {
    const form = actionButton.closest('form[data-system="ordem"]');
    const targetStep = Number(actionButton.dataset.step);
    const currentStep = Number(form.dataset.currentStep || 0);
    if (targetStep > currentStep) {
      for (let step = currentStep; step < targetStep; step += 1) {
        if (!validateOrderStep(form, step)) return;
      }
    }
    setOrderCharacterStep(form, targetStep);
    updateOrderCharacterForm(form);
    return;
  }

  if (action === "retry") {
    await renderRoute();
    return;
  }

  if (action === "toggle-agent-picker") {
    const picker = document.getElementById(actionButton.getAttribute("aria-controls"));
    if (!picker) return;
    const expanded = actionButton.getAttribute("aria-expanded") === "true";
    actionButton.setAttribute("aria-expanded", String(!expanded));
    picker.hidden = expanded;
    if (!expanded) picker.querySelector('button:not(:disabled)')?.focus();
    return;
  }

  if (action === "link-character") {
    const character = getCharacter(actionButton.dataset.id);
    const campaign = getCampaign(actionButton.dataset.campaign);
    if (!character || !campaign || !canAccessCampaign(campaign)
      || character.owner !== currentUser().id || character.campaignId
      || character.system !== campaign.system) {
      showPageNotice("Esta ficha não pode ser vinculada à campanha.", true);
      return;
    }
    try {
      await apiRequest(`/characters/${character.id}/campaign`, {
        method: "PATCH",
        body: JSON.stringify({ campaignId: campaign.id })
      });
      await renderRoute();
      showPageNotice(`${character.name} foi vinculado à campanha e está disponível em todas as sessões.`);
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "logout") {
    handleLogout();
    return;
  }

  if (action === "delete-campaign") {
    const campaign = getCampaign(actionButton.dataset.id);
    if (!canManageCampaign(campaign)) {
      showPageNotice("Somente o mestre pode excluir esta campanha.", true);
      return;
    }
    const confirmed = window.confirm(
      `Excluir a campanha "${campaign.name}"? As sessões, o histórico e os participantes serão removidos. As fichas serão mantidas, mas desvinculadas da campanha. Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    try {
      await apiRequest(`/campaigns/${campaign.id}`, { method: "DELETE" });
      await renderRoute();
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "toggle-character-selection") {
    const panel = actionButton.closest(".content-panel");
    const characterList = panel.querySelector("[data-character-list]");
    const selecting = !characterList.classList.contains("is-selecting");
    characterList.classList.toggle("is-selecting", selecting);
    panel.querySelector("[data-character-selection-tools]").hidden = !selecting;
    actionButton.setAttribute("aria-pressed", String(selecting));
    actionButton.setAttribute("aria-label", selecting ? "Cancelar seleção de agentes" : "Selecionar agentes para desvincular");
    actionButton.title = selecting ? "Cancelar seleção" : "Selecionar agentes para desvincular";
    if (!selecting) {
      characterList.querySelectorAll("[data-character-select]").forEach((checkbox) => { checkbox.checked = false; });
      panel.querySelector("[data-character-selection-count]").textContent = "0 selecionados";
      panel.querySelector('[data-action="unlink-selected-characters"]').disabled = true;
    }
    return;
  }

  if (action === "unlink-selected-characters") {
    const panel = actionButton.closest(".content-panel");
    const characterIds = [...panel.querySelectorAll("[data-character-select]:checked")].map((checkbox) => checkbox.value);
    const selectedCharacters = characterIds.map(getCharacter);
    const campaign = getCampaign(actionButton.dataset.campaign);
    if (!characterIds.length) {
      showPageNotice("Selecione ao menos um agente para desvincular.", true);
      return;
    }
    const isMaster = canManageCampaign(campaign);
    if (!campaign || (!isMaster && !canAccessCampaign(campaign))
      || selectedCharacters.some((character) => !character || character.campaignId !== campaign.id
        || (!isMaster && character.owner !== currentUser().id))) {
      showPageNotice(isMaster
        ? "O mestre só pode desvincular agentes desta campanha."
        : "Você só pode desvincular fichas próprias de campanhas das quais participa.", true);
      return;
    }
    const confirmed = window.confirm(
      `Desvincular ${characterIds.length} agente(s) da campanha "${campaign.name}"? As fichas continuarão no painel de seus proprietários como avulsas, e o histórico das sessões será preservado.`
    );
    if (!confirmed) return;
    try {
      await apiRequest(`/campaigns/${campaign.id}/characters`, {
        method: "DELETE",
        body: JSON.stringify({ characterIds })
      });
      await renderRoute();
      showPageNotice(`${characterIds.length} agente(s) desvinculado(s). As fichas e o histórico foram preservados.`);
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "toggle-session-selection") {
    const panel = actionButton.closest(".content-panel");
    const sessionList = panel.querySelector("[data-session-list]");
    const selecting = !sessionList.classList.contains("is-selecting");
    sessionList.classList.toggle("is-selecting", selecting);
    panel.querySelector("[data-session-selection-tools]").hidden = !selecting;
    actionButton.setAttribute("aria-pressed", String(selecting));
    actionButton.setAttribute("aria-label", selecting ? "Cancelar seleção de sessões" : "Selecionar sessões para excluir");
    actionButton.title = selecting ? "Cancelar seleção" : "Selecionar sessões para excluir";
    if (!selecting) {
      sessionList.querySelectorAll("[data-session-select]").forEach((checkbox) => { checkbox.checked = false; });
      panel.querySelector("[data-session-selection-count]").textContent = "0 selecionadas";
      panel.querySelector('[data-action="delete-selected-sessions"]').disabled = true;
    }
    return;
  }

  if (action === "delete-selected-sessions") {
    const panel = actionButton.closest(".content-panel");
    const sessionIds = [...panel.querySelectorAll("[data-session-select]:checked")].map((checkbox) => checkbox.value);
    const selectedSessions = sessionIds.map(getSession);
    const campaign = selectedSessions[0] && getCampaign(selectedSessions[0].campaignId);
    if (!sessionIds.length) {
      showPageNotice("Selecione ao menos uma sessão para excluir.", true);
      return;
    }
    if (!campaign || !canManageCampaign(campaign)
      || selectedSessions.some((session) => !session || session.status !== "finished" || session.campaignId !== campaign.id)) {
      showPageNotice("Somente o mestre pode excluir sessões finalizadas da mesma campanha.", true);
      return;
    }
    const confirmed = window.confirm(
      `Excluir ${sessionIds.length} sessão(ões) selecionada(s)? Os resumos e as linhas do tempo serão apagados permanentemente. Esta ação não pode ser desfeita.`
    );
    if (!confirmed) return;
    try {
      await apiRequest("/sessions", { method: "DELETE", body: JSON.stringify({ sessionIds }) });
      await renderRoute();
    } catch (error) {
      showPageNotice(error.message, true);
    }
    return;
  }

  if (action === "new-campaign") {
    location.hash = "nova-campanha";
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
authOpenButtons.forEach((button) => button.addEventListener("click", () => {
  if (currentUser()) {
    location.hash = "nova-campanha";
    return;
  }
  openAuthModal();
}));
authCloseButton.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});
authTabs.forEach((tab) => tab.addEventListener("click", () => setAuthView(tab.dataset.authView)));
forgotPasswordTrigger.addEventListener("click", () => {
  recoveryForm.elements.email.value = loginForm.elements.email.value.trim();
  setAuthView("recovery");
});
recoveryForm.querySelector("[data-auth-view='login']").addEventListener("click", () => setAuthView("login"));
loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);
recoveryForm.addEventListener("submit", handlePasswordRecovery);
resetPasswordForm.addEventListener("submit", handlePasswordReset);
appPage.addEventListener("submit", handlePageSubmit);
appPage.addEventListener("click", handlePageClick);
appPage.addEventListener("mousedown", (event) => {
  if (event.target.closest('[data-action="format-attack-notes"]')) event.preventDefault();
});
appPage.addEventListener("paste", (event) => {
  if (!event.target.closest("[data-attack-notes]")) return;
  event.preventDefault();
  const text = event.clipboardData?.getData("text/plain");
  if (typeof text !== "string") {
    showPageNotice("Não foi possível colar o conteúdo das anotações.", true);
    return;
  }
  document.execCommand("insertText", false, text);
});
appPage.addEventListener("drop", (event) => {
  if (!event.target.closest("[data-attack-notes]")) return;
  event.preventDefault();
  const text = event.dataTransfer?.getData("text/plain");
  if (typeof text !== "string") {
    showPageNotice("Não foi possível inserir o conteúdo nas anotações.", true);
    return;
  }
  document.execCommand("insertText", false, text);
});
appPage.addEventListener("keydown", (event) => {
  const activeTab = event.target.closest('[role="tab"]');
  if (!activeTab || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  const tabs = [...activeTab.closest('[role="tablist"]').querySelectorAll('[role="tab"]')];
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const nextTab = tabs[(tabs.indexOf(activeTab) + direction + tabs.length) % tabs.length];
  event.preventDefault();
  nextTab.focus();
  setCharacterTab(activeTab.closest("[data-character-tabs]"), nextTab.dataset.tab);
});
appPage.addEventListener("input", (event) => {
  const form = event.target.closest('form[data-form="character"][data-system="ordem"]');
  if (!form) return;
  if (event.target.matches("[data-origin-search]")) {
    filterOrderOriginCards(form);
    return;
  }
  const resourceInput = event.target.closest("[data-order-current]");
  if (resourceInput) resourceInput.dataset.userEdited = "true";
  updateOrderCharacterForm(form);
});
appPage.addEventListener("change", (event) => {
  const characterCheckbox = event.target.closest("[data-character-select]");
  if (characterCheckbox) {
    const panel = characterCheckbox.closest(".content-panel");
    const selectedCount = panel.querySelectorAll("[data-character-select]:checked").length;
    panel.querySelector("[data-character-selection-count]").textContent = `${selectedCount} selecionado(s)`;
    panel.querySelector('[data-action="unlink-selected-characters"]').disabled = selectedCount === 0;
    return;
  }
  const sessionCheckbox = event.target.closest("[data-session-select]");
  if (sessionCheckbox) {
    const panel = sessionCheckbox.closest(".content-panel");
    const selectedCount = panel.querySelectorAll("[data-session-select]:checked").length;
    panel.querySelector("[data-session-selection-count]").textContent = `${selectedCount} selecionada(s)`;
    panel.querySelector('[data-action="delete-selected-sessions"]').disabled = selectedCount === 0;
    return;
  }
  const systemSelect = event.target.closest('form[data-form="character"] select[name="system"]');
  if (systemSelect && systemSelect.value === "ordem") {
    const form = systemSelect.closest('form[data-form="character"]');
    const campaignId = form.elements.namedItem("campaignId").value;
    const character = form.dataset.id ? getCharacter(form.dataset.id) : null;
    appPage.innerHTML = renderOrderCharacterForm(character, campaignId, {
      name: form.elements.namedItem("name").value
    });
    updateOrderCharacterForm(appPage.querySelector('form[data-form="character"][data-system="ordem"]'));
    return;
  }
  const form = event.target.closest('form[data-form="character"][data-system="ordem"]');
  if (!form) return;
  if (event.target.matches("[data-origin-choice]")) {
    const selectedCard = event.target.closest(".order-origin-card");
    if (selectedCard.classList.contains("is-selected")) {
      const selectedSkills = [...selectedCard.querySelectorAll("[data-origin-choice]")].map((select) => select.value);
      form.elements.namedItem("originSkill1").value = selectedSkills[0];
      form.elements.namedItem("originSkill2").value = selectedSkills[1];
    }
    return;
  }
  updateOrderCharacterForm(form);
});
appPage.addEventListener("input", (event) => {
  if (event.target.matches("#public-search")) filterPublicTableCards();
});
appPage.addEventListener("change", (event) => {
  if (event.target.matches("#public-system-filter")) filterPublicTableCards();
});
window.addEventListener("hashchange", renderRoute);
supabaseClient?.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") {
    resetPasswordForm.querySelectorAll("input, button[type='submit']").forEach((element) => {
      element.disabled = false;
    });
    setAuthView("reset-password");
    openAuthModal();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !authModal.classList.contains("hidden")) closeAuthModal();
});
renderAuthState();
renderRoute();
