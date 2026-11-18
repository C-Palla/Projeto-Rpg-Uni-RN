// Compêndio Oficial de Ordem Paranormal
const orderAbilitiesCatalog = [
  {
    "id": "armamento-pesado",
    "name": "Armamento Pesado",
    "category": "Combatente",
    "description": "Você recebe proficiência com armas pesadas. Pré-requisito: For 2."
  },
  {
    "id": "artista-marcial",
    "name": "Artista Marcial",
    "category": "Combatente",
    "description": "Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10."
  },
  {
    "id": "ataque-de-oportunidade",
    "name": "Ataque de Oportunidade",
    "category": "Combatente",
    "description": "Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele."
  },
  {
    "id": "ataque-especial",
    "name": "Ataque Especial",
    "category": "Combatente",
    "description": "Quando faz um ataque, você pode gastar 2 PE para receber +5 no teste de ataque ou na rolagem de dano. Conforme avança de NEX, você pode gastar +1 PE para receber mais bônus de +5. Você pode aplicar cada bônus de +5 em ataque ou dano. Por exemplo, em NEX 55%, você pode gastar 4 PE para receber +5 no teste de ataque e +10 na rolagem de dano."
  },
  {
    "id": "combate-defensivo",
    "name": "Combate Defensivo",
    "category": "Combatente",
    "description": "Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –1d20 em todos os testes de ataque, mas recebe +5 na Defesa. Pré-requisito: Int 2."
  },
  {
    "id": "combater-com-duas-armas",
    "name": "Combater com Duas Armas",
    "category": "Combatente",
    "description": "Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –1d20 em todos os testes de ataque até o seu próximo turno. Pré-requisitos: Agi 3, treinado em Luta ou Pontaria."
  },
  {
    "id": "golpe-demolidor",
    "name": "Golpe Demolidor",
    "category": "Combatente",
    "description": "Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma. Pré-requisitos: For 2, treinado em Luta."
  },
  {
    "id": "golpe-pesado",
    "name": "Golpe Pesado",
    "category": "Combatente",
    "description": "O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo."
  },
  {
    "id": "incansavel",
    "name": "Incansável",
    "category": "Combatente",
    "description": "Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste."
  },
  {
    "id": "presteza-atletica",
    "name": "Presteza Atlética",
    "category": "Combatente",
    "description": "Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +1d20 no teste."
  },
  {
    "id": "protecao-pesada",
    "name": "Proteção Pesada",
    "category": "Combatente",
    "description": "Você recebe proficiência com Proteções Pesadas. Pré-requisito: NEX 30%."
  },
  {
    "id": "reflexos-defensivos",
    "name": "Reflexos Defensivos",
    "category": "Combatente",
    "description": "Você recebe +2 em Defesa e em testes de resistência. Pré-requisitos: Agi 2."
  },
  {
    "id": "saque-rapido",
    "name": "Saque Rápido",
    "category": "Combatente",
    "description": "Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre. Pré-requisito: treinado em Iniciativa."
  },
  {
    "id": "segurar-o-gatilho",
    "name": "Segurar o Gatilho",
    "category": "Combatente",
    "description": "Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Ou seja, pode fazer o primeiro ataque extra gastando 2 PE e, se acertar, pode fazer um segundo ataque extra gastando mais 4 PE e assim por diante, até errar um ataque ou atingir o limite de seus PE por rodada. Pré-requisito: NEX 60%."
  },
  {
    "id": "sentido-tatico",
    "name": "Sentido Tático",
    "category": "Combatente",
    "description": "Você pode gastar uma ação de movimento e 2 PE para analisar o ambiente. Se fizer isso, recebe um bônus em Defesa e em testes de resistência igual ao seu Intelecto até o final da cena. Pré-requisitos: treinado em Percepção e Tática."
  },
  {
    "id": "tanque-de-guerra",
    "name": "Tanque de Guerra",
    "category": "Combatente",
    "description": "Se estiver usando uma proteção pesada, a Defesa e a resistência a dano que ela fornece aumentam em +2. Pré-requisito: Proteção Pesada."
  },
  {
    "id": "tiro-certeiro",
    "name": "Tiro Certeiro",
    "category": "Combatente",
    "description": "Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). Pré-requisito: treinado em Pontaria."
  },
  {
    "id": "tiro-de-cobertura",
    "name": "Tiro de Cobertura",
    "category": "Combatente",
    "description": "Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um personagem no alcance da arma apenas para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque. A critério do mestre, o alvo recebe +5 no teste de Vontade se estiver em um lugar extremamente perigoso, como uma casa em chamas ou um barco afundando. Este é um efeito de medo."
  },
  {
    "id": "transcender",
    "name": "Transcender",
    "category": "Classe",
    "description": "Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes."
  },
  {
    "id": "treinamento-em-pericia",
    "name": "Treinamento em Perícia",
    "category": "Classe",
    "description": "Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes."
  },
  {
    "id": "aniquilador-a-favorita",
    "name": "Aniquilador · A Favorita (NEX 10%)",
    "category": "Trilha",
    "description": "Escolha uma arma para ser sua favorita, como katana ou fuzil de assalto. A categoria da arma escolhida é reduzida em I.",
    "subcategory": "Aniquilador",
    "classParent": "Combatente"
  },
  {
    "id": "aniquilador-tecnica-secreta",
    "name": "Aniquilador · Técnica Secreta (NEX 40%)",
    "category": "Trilha",
    "description": "A categoria da arma favorita passa a ser reduzida em II. Quando faz um ataque com ela, você pode gastar 2 PE para executar um dos efeitos abaixo como parte do ataque. Você pode adicionar mais efeitos gastando +2 PE por efeito adicional: Amplo (atinge alvo adicional em seu alcance e adjacente ao original) ou Destruidor (aumenta o multiplicador de crítico em +1).",
    "subcategory": "Aniquilador",
    "classParent": "Combatente"
  },
  {
    "id": "aniquilador-tecnica-sublime",
    "name": "Aniquilador · Técnica Sublime (NEX 65%)",
    "category": "Trilha",
    "description": "Você adiciona os seguintes efeitos à sua Técnica Secreta: Letal (+2 na margem de ameaça, ou +5 gastando duas vezes) e Perfurante (ignora até 5 pontos de resistência a dano de qualquer tipo do alvo).",
    "subcategory": "Aniquilador",
    "classParent": "Combatente"
  },
  {
    "id": "aniquilador-maquina-de-matar",
    "name": "Aniquilador · Máquina de Matar (NEX 99%)",
    "category": "Trilha",
    "description": "A categoria da arma favorita passa a ser reduzida em III, ela recebe +2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.",
    "subcategory": "Aniquilador",
    "classParent": "Combatente"
  },
  {
    "id": "comandante-inspirar-confianca",
    "name": "Comandante de Campo · Inspirar Confiança (NEX 10%)",
    "category": "Trilha",
    "description": "Sua liderança inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado em alcance curto rolar novamente um teste recém realizado.",
    "subcategory": "Comandante de Campo",
    "classParent": "Combatente"
  },
  {
    "id": "comandante-estrategista",
    "name": "Comandante de Campo · Estrategista (NEX 40%)",
    "category": "Trilha",
    "description": "Você pode direcionar aliados em alcance curto. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles ganham uma ação de movimento adicional.",
    "subcategory": "Comandante de Campo",
    "classParent": "Combatente"
  },
  {
    "id": "comandante-brecha-na-guarda",
    "name": "Comandante de Campo · Brecha na Guarda (NEX 65%)",
    "category": "Trilha",
    "description": "Uma vez por rodada, quando um aliado causar dano em um inimigo que esteja em seu alcance curto, você pode gastar uma reação e 2 PE para que você ou outro aliado em alcance curto faça um ataque adicional contra o mesmo inimigo. Além disso, o alcance de inspirar confiança e estrategista aumenta para médio.",
    "subcategory": "Comandante de Campo",
    "classParent": "Combatente"
  },
  {
    "id": "comandante-oficial-comandante",
    "name": "Comandante de Campo · Oficial Comandante (NEX 99%)",
    "category": "Trilha",
    "description": "Você pode gastar uma ação padrão e 5 PE para que cada aliado que você possa ver em alcance médio receba uma ação padrão adicional no próximo turno dele.",
    "subcategory": "Comandante de Campo",
    "classParent": "Combatente"
  },
  {
    "id": "guerreiro-tecnica-letal",
    "name": "Guerreiro · Técnica Letal (NEX 10%)",
    "category": "Trilha",
    "description": "Você recebe um aumento de +2 na margem de ameaça com todos os seus ataques corpo a corpo.",
    "subcategory": "Guerreiro",
    "classParent": "Combatente"
  },
  {
    "id": "guerreiro-revidar",
    "name": "Guerreiro · Revidar (NEX 40%)",
    "category": "Trilha",
    "description": "Sempre que bloquear um ataque, você pode gastar uma reação e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou.",
    "subcategory": "Guerreiro",
    "classParent": "Combatente"
  },
  {
    "id": "guerreiro-forca-opressora",
    "name": "Guerreiro · Força Opressora (NEX 65%)",
    "category": "Trilha",
    "description": "Quando acerta um ataque corpo a corpo, você pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como ação livre. Se escolher empurrar, recebe um bônus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, você pode gastar 1 PE para fazer um ataque adicional contra o alvo caído.",
    "subcategory": "Guerreiro",
    "classParent": "Combatente"
  },
  {
    "id": "guerreiro-potencia-maxima",
    "name": "Guerreiro · Potência Máxima (NEX 99%)",
    "category": "Trilha",
    "description": "Quando usa seu Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, você recebe +10 no ataque e +30 no dano.",
    "subcategory": "Guerreiro",
    "classParent": "Combatente"
  },
  {
    "id": "operacoes-iniciativa-aprimorada",
    "name": "Operações Especiais · Iniciativa Aprimorada (NEX 10%)",
    "category": "Trilha",
    "description": "Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada.",
    "subcategory": "Operações Especiais",
    "classParent": "Combatente"
  },
  {
    "id": "operacoes-ataque-extra",
    "name": "Operações Especiais · Ataque Extra (NEX 40%)",
    "category": "Trilha",
    "description": "Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional.",
    "subcategory": "Operações Especiais",
    "classParent": "Combatente"
  },
  {
    "id": "operacoes-surto-de-adrenalina",
    "name": "Operações Especiais · Surto de Adrenalina (NEX 65%)",
    "category": "Trilha",
    "description": "Uma vez por rodada, você pode gastar 5 PE para realizar uma ação padrão ou de movimento adicional.",
    "subcategory": "Operações Especiais",
    "classParent": "Combatente"
  },
  {
    "id": "operacoes-sempre-alerta",
    "name": "Operações Especiais · Sempre Alerta (NEX 99%)",
    "category": "Trilha",
    "description": "Você recebe uma ação padrão adicional no início de cada cena de combate.",
    "subcategory": "Operações Especiais",
    "classParent": "Combatente"
  },
  {
    "id": "tropa-casca-grossa",
    "name": "Tropa de Choque · Casca Grossa (NEX 10%)",
    "category": "Trilha",
    "description": "Você recebe +1 PV para cada 5% de NEX e, quando faz um bloqueio, soma seu Vigor na resistência a dano recebida.",
    "subcategory": "Tropa de Choque",
    "classParent": "Combatente"
  },
  {
    "id": "tropa-cai-dentro",
    "name": "Tropa de Choque · Cai Dentro (NEX 40%)",
    "category": "Trilha",
    "description": "Sempre que um oponente em alcance curto ataca um de seus aliados, você pode gastar uma reação e 1 PE para fazer com que esse oponente faça um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar você em vez de seu aliado.",
    "subcategory": "Tropa de Choque",
    "classParent": "Combatente"
  },
  {
    "id": "tropa-duro-de-matar",
    "name": "Tropa de Choque · Duro de Matar (NEX 65%)",
    "category": "Trilha",
    "description": "Ao sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade. Em NEX 85%, você pode usar esta habilidade para reduzir dano paranormal.",
    "subcategory": "Tropa de Choque",
    "classParent": "Combatente"
  },
  {
    "id": "tropa-inquebravel",
    "name": "Tropa de Choque · Inquebrável (NEX 99%)",
    "category": "Trilha",
    "description": "Enquanto estiver machucado, você recebe +5 na Defesa e resistência a dano 5. Enquanto estiver morrendo, em vez do normal, você não fica indefeso e ainda pode realizar ações. Você ainda segue as regras de morte normalmente.",
    "subcategory": "Tropa de Choque",
    "classParent": "Combatente"
  },
  {
    "id": "balistica-avancada",
    "name": "Balística Avançada",
    "category": "Especialista",
    "description": "Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com essas armas."
  },
  {
    "id": "conhecimento-aplicado",
    "name": "Conhecimento Aplicado",
    "category": "Especialista",
    "description": "Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int. Pré-requisito: Int 2."
  },
  {
    "id": "ecletico",
    "name": "Eclético",
    "category": "Especialista",
    "description": "Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia."
  },
  {
    "id": "engenhosidade",
    "name": "Engenhosidade",
    "category": "Especialista",
    "description": "Em NEX 40%, quando usa sua habilidade Eclético, você pode gastar 2 PE adicionais para receber os benefícios de ser veterano na perícia. Em NEX 75%, pode gastar 4 PE adicionais para receber os benefícios de ser expert na perícia."
  },
  {
    "id": "hacker",
    "name": "Hacker",
    "category": "Especialista",
    "description": "Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa. Pré-requisito: treinado em Tecnologia."
  },
  {
    "id": "maos-rapidas",
    "name": "Mãos Rápidas",
    "category": "Especialista",
    "description": "Ao fazer um teste de Crime, você pode pagar 1 PE para fazê-lo como uma ação livre. Pré-requisitos: Agi 3, treinado em Crime."
  },
  {
    "id": "mochila-de-utilidades",
    "name": "Mochila de Utilidades",
    "category": "Especialista",
    "description": "Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos."
  },
  {
    "id": "movimento-tatico",
    "name": "Movimento Tático",
    "category": "Especialista",
    "description": "Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno. Pré-requisito: treinado em Atletismo."
  },
  {
    "id": "na-trilha-certa",
    "name": "Na Trilha Certa",
    "category": "Especialista",
    "description": "Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +1d20 no próximo teste. Os custos e os bônus são cumulativos."
  },
  {
    "id": "nerd",
    "name": "Nerd",
    "category": "Especialista",
    "description": "Você é um repositório de conhecimento útil (e inútil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena (dica para pista ou fraqueza de inimigo)."
  },
  {
    "id": "ninja-urbano",
    "name": "Ninja Urbano",
    "category": "Especialista",
    "description": "Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com essas armas."
  },
  {
    "id": "pensamento-agil",
    "name": "Pensamento Ágil",
    "category": "Especialista",
    "description": "Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional."
  },
  {
    "id": "perito",
    "name": "Perito",
    "category": "Especialista",
    "description": "Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Quando faz um teste de uma dessas perícias, você pode gastar 2 PE para somar +1d6 no resultado do teste. Conforme avança de NEX, pode gastar +1 PE para aumentar o dado de bônus (+1d10 em NEX 55%)."
  },
  {
    "id": "perito-em-explosivos",
    "name": "Perito em Explosivos",
    "category": "Especialista",
    "description": "Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto."
  },
  {
    "id": "primeira-impressao",
    "name": "Primeira Impressão",
    "category": "Especialista",
    "description": "Você recebe +2d20 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena."
  },
  {
    "id": "atirador-mira-de-elite",
    "name": "Atirador de Elite · Mira de Elite (NEX 10%)",
    "category": "Trilha",
    "description": "Você recebe proficiência com armas de fogo que usam balas longas e soma seu Intelecto em rolagens de dano com essas armas.",
    "subcategory": "Atirador de Elite",
    "classParent": "Especialista"
  },
  {
    "id": "atirador-disparo-letal",
    "name": "Atirador de Elite · Disparo Letal (NEX 40%)",
    "category": "Trilha",
    "description": "Quando faz a ação mirar você pode gastar 1 PE para aumentar em +2 a margem de ameaça do próximo ataque que fizer até o final de seu próximo turno.",
    "subcategory": "Atirador de Elite",
    "classParent": "Especialista"
  },
  {
    "id": "atirador-disparo-impactante",
    "name": "Atirador de Elite · Disparo Impactante (NEX 65%)",
    "category": "Trilha",
    "description": "Se estiver usando uma arma de fogo com calibre grosso você pode gastar 2 PE para fazer as manobras derrubar, desarmar, empurrar e quebrar usando um ataque a distância.",
    "subcategory": "Atirador de Elite",
    "classParent": "Especialista"
  },
  {
    "id": "atirador-atirar-para-matar",
    "name": "Atirador de Elite · Atirar para Matar (NEX 99%)",
    "category": "Trilha",
    "description": "Quando faz um acerto crítico com uma arma de fogo, você causa dano máximo, sem precisar rolar dados.",
    "subcategory": "Atirador de Elite",
    "classParent": "Especialista"
  },
  {
    "id": "infiltrador-ataque-furtivo",
    "name": "Infiltrador · Ataque Furtivo (NEX 10%)",
    "category": "Trilha",
    "description": "Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou flanqueando, pode gastar 1 PE para causar +1d6 pontos de dano (+2d6 em NEX 40%, +3d6 em NEX 65%, +4d6 em NEX 99%).",
    "subcategory": "Infiltrador",
    "classParent": "Especialista"
  },
  {
    "id": "infiltrador-gatuno",
    "name": "Infiltrador · Gatuno (NEX 40%)",
    "category": "Trilha",
    "description": "Você recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade.",
    "subcategory": "Infiltrador",
    "classParent": "Especialista"
  },
  {
    "id": "infiltrador-assassinar",
    "name": "Infiltrador · Assassinar (NEX 65%)",
    "category": "Trilha",
    "description": "Você pode gastar uma ação de movimento e 3 PE para analisar um alvo em alcance curto. Até o fim de seu próximo turno, seu primeiro Ataque Furtivo tem o dano extra dobrado e o alvo fica inconsciente ou morrendo se sofrer dano (Fortitude DT Agi evita).",
    "subcategory": "Infiltrador",
    "classParent": "Especialista"
  },
  {
    "id": "infiltrador-sombra-fugaz",
    "name": "Infiltrador · Sombra Fugaz (NEX 99%)",
    "category": "Trilha",
    "description": "Quando faz um teste de Furtividade após atacar ou fazer outra ação chamativa, você pode gastar 3 PE para não sofrer a penalidade de –3d20 no teste.",
    "subcategory": "Infiltrador",
    "classParent": "Especialista"
  },
  {
    "id": "medico-paramedico",
    "name": "Médico de Campo · Paramédico (NEX 10%)",
    "category": "Trilha",
    "description": "Você pode usar uma ação padrão e 2 PE para curar 2d10 pontos de vida de si mesmo ou de um aliado adjacente (+1d10 PV por +1 PE em NEX 40%, 65% e 99%).",
    "subcategory": "Médico de Campo",
    "classParent": "Especialista"
  },
  {
    "id": "medico-equipe-de-trauma",
    "name": "Médico de Campo · Equipe de Trauma (NEX 40%)",
    "category": "Trilha",
    "description": "Você pode usar uma ação padrão e 2 PE para remover uma condição negativa (exceto morrendo) de um aliado adjacente.",
    "subcategory": "Médico de Campo",
    "classParent": "Especialista"
  },
  {
    "id": "medico-resgate",
    "name": "Médico de Campo · Resgate (NEX 65%)",
    "category": "Trilha",
    "description": "Uma vez por rodada, se estiver em alcance curto de um aliado machucado ou morrendo, você pode se aproximar do aliado com uma ação livre. Ao curar PV ou remover condições, você e o aliado recebem +5 na Defesa até o próximo turno. Carga por carregar aliados cai pela metade.",
    "subcategory": "Médico de Campo",
    "classParent": "Especialista"
  },
  {
    "id": "medico-reanimacao",
    "name": "Médico de Campo · Reanimação (NEX 99%)",
    "category": "Trilha",
    "description": "Uma vez por cena, você pode gastar uma ação completa e 10 PE para trazer de volta a vida um personagem que tenha morrido na mesma cena (exceto morte por dano massivo).",
    "subcategory": "Médico de Campo",
    "classParent": "Especialista"
  },
  {
    "id": "negociador-eloquencia",
    "name": "Negociador · Eloquência (NEX 10%)",
    "category": "Trilha",
    "description": "Você pode usar uma ação completa e 1 PE por alvo em alcance curto para afetar outros personagens com sua fala. Teste Diplomacia, Enganação ou Intimidação vs Vontade para deixá-los fascinados enquanto se concentrar.",
    "subcategory": "Negociador",
    "classParent": "Especialista"
  },
  {
    "id": "negociador-discurso-motivador",
    "name": "Negociador · Discurso Motivador (NEX 40%)",
    "category": "Trilha",
    "description": "Você pode gastar uma ação padrão e 4 PE para inspirar seus aliados com suas palavras. Você e todos os aliados em alcance curto ganham +1d20 em testes de perícia até o fim da cena (+2d20 por 8 PE a partir de NEX 65%).",
    "subcategory": "Negociador",
    "classParent": "Especialista"
  },
  {
    "id": "negociador-eu-conheco-um-cara",
    "name": "Negociador · Eu Conheço um Cara (NEX 65%)",
    "category": "Trilha",
    "description": "Uma vez por missão, ative sua rede de contatos para pedir um favor (trocar equipamento, local de descanso, resgate), a critério do mestre.",
    "subcategory": "Negociador",
    "classParent": "Especialista"
  },
  {
    "id": "negociador-truque-de-mestre",
    "name": "Negociador · Truque de Mestre (NEX 99%)",
    "category": "Trilha",
    "description": "Você pode gastar 5 PE para simular o efeito de qualquer habilidade usada por um aliado na cena, ignorando pré-requisitos mas pagando todos os custos normais.",
    "subcategory": "Negociador",
    "classParent": "Especialista"
  },
  {
    "id": "tecnico-inventario-otimizado",
    "name": "Técnico · Inventário Otimizado (NEX 10%)",
    "category": "Trilha",
    "description": "Você soma seu Intelecto à sua Força para calcular sua capacidade de carga.",
    "subcategory": "Técnico",
    "classParent": "Especialista"
  },
  {
    "id": "tecnico-remendao",
    "name": "Técnico · Remendão (NEX 40%)",
    "category": "Trilha",
    "description": "Você pode gastar uma ação completa e 1 PE para remover a condição quebrado de um equipamento adjacente até o final da cena. Equipamentos gerais têm categoria reduzida em I para você.",
    "subcategory": "Técnico",
    "classParent": "Especialista"
  },
  {
    "id": "tecnico-improvisar",
    "name": "Técnico · Improvisar (NEX 65%)",
    "category": "Trilha",
    "description": "Escolha um equipamento geral e gaste uma ação completa e 2 PE (+2 PE por categoria do item) para criar uma versão funcional funcional dele até o final da cena.",
    "subcategory": "Técnico",
    "classParent": "Especialista"
  },
  {
    "id": "tecnico-preparado-para-tudo",
    "name": "Técnico · Preparado para Tudo (NEX 99%)",
    "category": "Trilha",
    "description": "Sempre que precisar de um item qualquer (exceto armas), pode gastar uma ação de movimento e 3 PE por categoria do item para lembrar que colocou ele no fundo da bolsa!",
    "subcategory": "Técnico",
    "classParent": "Especialista"
  },
  {
    "id": "camuflar-ocultismo",
    "name": "Camuflar Ocultismo",
    "category": "Ocultista",
    "description": "Ação livre para esconder símbolos e sigilos em objetos ou pele. Pode gastar +2 PE para lançar ritual sem componentes e sem gesticular usando concentração (Ocultismo DT 25 para outros perceberem)."
  },
  {
    "id": "criar-selo",
    "name": "Criar Selo",
    "category": "Ocultista",
    "description": "Você sabe fabricar selos paranormais de rituais que conheça. Fabricar um selo gasta uma ação de interlúdio e PE iguais ao custo do ritual. Máximo de selos criados igual à sua Presença."
  },
  {
    "id": "envolto-em-misterio",
    "name": "Envolto em Mistério",
    "category": "Ocultista",
    "description": "Você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo."
  },
  {
    "id": "escolhido-pelo-outro-lado",
    "name": "Escolhido pelo Outro Lado",
    "category": "Ocultista",
    "description": "Você foi marcado pelo Outro Lado. Pode lançar rituais de 1º círculo (2º em 25%, 3º em 55%, 4º em 85%). Começa com 3 rituais de 1º círculo e aprende 1 a cada avanço de NEX."
  },
  {
    "id": "especialista-em-elemento",
    "name": "Especialista em Elemento",
    "category": "Ocultista",
    "description": "Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2."
  },
  {
    "id": "ferramentas-paranormais",
    "name": "Ferramentas Paranormais",
    "category": "Ocultista",
    "description": "Você reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE."
  },
  {
    "id": "fluxo-de-poder",
    "name": "Fluxo de Poder",
    "category": "Ocultista",
    "description": "Você pode manter dois efeitos sustentados de rituais ativos simultaneamente com apenas uma ação livre, pagando o custo separadamente. Pré-requisito: NEX 60%."
  },
  {
    "id": "guiado-pelo-paranormal",
    "name": "Guiado pelo Paranormal",
    "category": "Ocultista",
    "description": "Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional."
  },
  {
    "id": "identificacao-paranormal",
    "name": "Identificação Paranormal",
    "category": "Ocultista",
    "description": "Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais."
  },
  {
    "id": "improvisar-componentes",
    "name": "Improvisar Componentes",
    "category": "Ocultista",
    "description": "Uma vez por cena, ação completa para fazer teste de Investigação (DT 15) e encontrar objetos que servem como componentes ritualísticos de um elemento."
  },
  {
    "id": "intuicao-paranormal",
    "name": "Intuição Paranormal",
    "category": "Ocultista",
    "description": "Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste."
  },
  {
    "id": "mestre-em-elemento",
    "name": "Mestre em Elemento",
    "category": "Ocultista",
    "description": "Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE. Pré-requisitos: Especialista em Elemento no elemento escolhido, NEX 45%."
  },
  {
    "id": "ritual-potente",
    "name": "Ritual Potente",
    "category": "Ocultista",
    "description": "Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais. Pré-requisito: Int 2."
  },
  {
    "id": "ritual-predileto",
    "name": "Ritual Predileto",
    "category": "Ocultista",
    "description": "Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual (cumulativo com outras fontes)."
  },
  {
    "id": "tatuagem-ritualistica",
    "name": "Tatuagem Ritualística",
    "category": "Ocultista",
    "description": "Símbolos marcados em sua pele reduzem em –1 PE o custo de rituais de alcance pessoal que têm você como alvo."
  },
  {
    "id": "conduite-ampliar-ritual",
    "name": "Conduíte · Ampliar Ritual (NEX 10%)",
    "category": "Trilha",
    "description": "Ao lançar um ritual, você pode gastar +2 PE para aumentar seu alcance em um passo (curto para médio, médio para longo, longo para extremo) ou dobrar sua área de efeito.",
    "subcategory": "Conduíte",
    "classParent": "Ocultista"
  },
  {
    "id": "conduite-acelerar-ritual",
    "name": "Conduíte · Acelerar Ritual (NEX 40%)",
    "category": "Trilha",
    "description": "Uma vez por rodada, você pode aumentar o custo de um ritual em 4 PE para conjurá-lo como uma ação livre.",
    "subcategory": "Conduíte",
    "classParent": "Ocultista"
  },
  {
    "id": "conduite-anular-ritual",
    "name": "Conduíte · Anular Ritual (NEX 65%)",
    "category": "Trilha",
    "description": "Quando for alvo de um ritual, gaste PE igual ao custo do ritual e faça um teste oposto de Ocultismo para anular todos os seus efeitos.",
    "subcategory": "Conduíte",
    "classParent": "Ocultista"
  },
  {
    "id": "conduite-canalizar-o-medo",
    "name": "Conduíte · Canalizar o Medo (NEX 99%)",
    "category": "Trilha",
    "description": "Você aprende o ritual Canalizar o Medo.",
    "subcategory": "Conduíte",
    "classParent": "Ocultista"
  },
  {
    "id": "flagelador-poder-do-flagelo",
    "name": "Flagelador · Poder do Flagelo (NEX 10%)",
    "category": "Trilha",
    "description": "Ao conjurar um ritual, você pode gastar seus próprios pontos de vida para pagar o custo em pontos de esforço, à taxa de 2 PV por PE pago (recuperáveis apenas com descanso).",
    "subcategory": "Flagelador",
    "classParent": "Ocultista"
  },
  {
    "id": "flagelador-abracar-a-dor",
    "name": "Flagelador · Abraçar a Dor (NEX 40%)",
    "category": "Trilha",
    "description": "Sempre que sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade.",
    "subcategory": "Flagelador",
    "classParent": "Ocultista"
  },
  {
    "id": "flagelador-absorver-agonia",
    "name": "Flagelador · Absorver Agonia (NEX 65%)",
    "category": "Trilha",
    "description": "Sempre que reduz um ou mais inimigos a 0 PV com um ritual, você recebe PE temporários igual ao círculo do ritual utilizado.",
    "subcategory": "Flagelador",
    "classParent": "Ocultista"
  },
  {
    "id": "flagelador-medo-tangivel",
    "name": "Flagelador · Medo Tangível (NEX 99%)",
    "category": "Trilha",
    "description": "Você aprende o ritual Medo Tangível.",
    "subcategory": "Flagelador",
    "classParent": "Ocultista"
  },
  {
    "id": "graduado-saber-ampliado",
    "name": "Graduado · Saber Ampliado (NEX 10%)",
    "category": "Trilha",
    "description": "Você aprende um ritual de 1º círculo. Toda vez que ganha acesso a um novo círculo, aprende um ritual adicional daquele círculo fora do limite.",
    "subcategory": "Graduado",
    "classParent": "Ocultista"
  },
  {
    "id": "graduado-grimorio-ritualistico",
    "name": "Graduado · Grimório Ritualístico (NEX 40%)",
    "category": "Trilha",
    "description": "Cria um grimório que armazena rituais de 1º ou 2º círculos em quantidade igual ao seu Intelecto (+1 por novo círculo). Ação completa folheando antes de conjurar. Ocupa 1 espaço.",
    "subcategory": "Graduado",
    "classParent": "Ocultista"
  },
  {
    "id": "graduado-rituais-eficientes",
    "name": "Graduado · Rituais Eficientes (NEX 65%)",
    "category": "Trilha",
    "description": "A DT para resistir a todos os seus rituais aumenta em +5.",
    "subcategory": "Graduado",
    "classParent": "Ocultista"
  },
  {
    "id": "graduado-conhecendo-o-medo",
    "name": "Graduado · Conhecendo o Medo (NEX 99%)",
    "category": "Trilha",
    "description": "Você aprende o ritual Conhecendo o Medo.",
    "subcategory": "Graduado",
    "classParent": "Ocultista"
  },
  {
    "id": "intuitivo-mente-sa",
    "name": "Intuitivo · Mente Sã (NEX 10%)",
    "category": "Trilha",
    "description": "Você compreende melhor as entidades do Outro Lado, recebendo resistência paranormal +5 em testes de resistência contra efeitos paranormais.",
    "subcategory": "Intuitivo",
    "classParent": "Ocultista"
  },
  {
    "id": "intuitivo-presenca-poderosa",
    "name": "Intuitivo · Presença Poderosa (NEX 40%)",
    "category": "Trilha",
    "description": "Adiciona sua Presença ao seu limite de PE por turno para conjurar rituais (não para DT).",
    "subcategory": "Intuitivo",
    "classParent": "Ocultista"
  },
  {
    "id": "intuitivo-inabalavel",
    "name": "Intuitivo · Inabalável (NEX 65%)",
    "category": "Trilha",
    "description": "Você recebe resistência a dano mental e paranormal 10. Se passar em teste de Vontade que reduziria dano à metade, não sofre dano algum.",
    "subcategory": "Intuitivo",
    "classParent": "Ocultista"
  },
  {
    "id": "intuitivo-presenca-do-medo",
    "name": "Intuitivo · Presença do Medo (NEX 99%)",
    "category": "Trilha",
    "description": "Você aprende o ritual Presença do Medo.",
    "subcategory": "Intuitivo",
    "classParent": "Ocultista"
  },
  {
    "id": "lamina-lamina-maldita",
    "name": "Lâmina Paranormal · Lâmina Maldita (NEX 10%)",
    "category": "Trilha",
    "description": "Você aprende o ritual Amaldiçoar Arma (ou gasta +1 PE para ação de movimento). Permite usar Ocultismo em vez de Luta ou Pontaria para testes de ataque com a arma amaldiçoada.",
    "subcategory": "Lâmina Paranormal",
    "classParent": "Ocultista"
  },
  {
    "id": "lamina-gladiador-paranormal",
    "name": "Lâmina Paranormal · Gladiador Paranormal (NEX 40%)",
    "category": "Trilha",
    "description": "Sempre que acerta um ataque corpo a corpo em um inimigo, recebe 2 PE temporários (até o limite de PE por cena).",
    "subcategory": "Lâmina Paranormal",
    "classParent": "Ocultista"
  },
  {
    "id": "lamina-conjuracao-marcial",
    "name": "Lâmina Paranormal · Conjuração Marcial (NEX 65%)",
    "category": "Trilha",
    "description": "Uma vez por rodada, ao lançar ritual com execução de ação padrão, você pode gastar 2 PE para fazer um ataque corpo a corpo como ação livre.",
    "subcategory": "Lâmina Paranormal",
    "classParent": "Ocultista"
  },
  {
    "id": "lamina-lamina-do-medo",
    "name": "Lâmina Paranormal · Lâmina do Medo (NEX 99%)",
    "category": "Trilha",
    "description": "Você aprende o ritual Lâmina do Medo.",
    "subcategory": "Lâmina Paranormal",
    "classParent": "Ocultista"
  },
  {
    "id": "origem-110",
    "name": "110%",
    "category": "Origem",
    "description": "Quando faz um teste de perícia usando Força ou Agilidade (exceto Luta e Pontaria) você pode gastar 2 PE para receber +5 nesse teste."
  },
  {
    "id": "origem-acalentar",
    "name": "Acalentar",
    "category": "Origem",
    "description": "Você recebe +5 em testes de Religião para acalmar. Além disso, quando acalma uma pessoa, ela recebe um número de pontos de Sanidade igual a 1d6 + a sua Presença."
  },
  {
    "id": "origem-antes-so",
    "name": "Antes Só",
    "category": "Origem",
    "description": "Você recebe +1 na Defesa, em testes de perícias e em seu limite de PE por turno se estiver sem nenhum aliado em alcance curto."
  },
  {
    "id": "origem-aula-de-campo",
    "name": "Aula de Campo",
    "category": "Origem",
    "description": "Uma vez por cena, pode gastar uma ação padrão e 2 PE para fornecer +1 em um atributo de outro personagem em alcance curto até o fim da cena."
  },
  {
    "id": "origem-bagagem-de-leitura",
    "name": "Bagagem de Leitura",
    "category": "Origem",
    "description": "Uma vez por cena, pode gastar 2 PE para se tornar treinado em uma perícia qualquer até o fim da cena."
  },
  {
    "id": "origem-calejado",
    "name": "Calejado",
    "category": "Origem",
    "description": "Você recebe +1 PV para cada 5% de NEX."
  },
  {
    "id": "origem-cicatrizes-psicologicas",
    "name": "Cicatrizes Psicológicas",
    "category": "Origem",
    "description": "Você recebe +1 de Sanidade para cada 5% de NEX."
  },
  {
    "id": "origem-dedicacao",
    "name": "Dedicação",
    "category": "Origem",
    "description": "Você recebe +1 PE, e mais 1 PE adicional a cada NEX ímpar (15%, 25%...). Além disso, seu limite de PE por turno aumenta em 1."
  },
  {
    "id": "origem-desbravador",
    "name": "Desbravador",
    "category": "Origem",
    "description": "Quando faz um teste de Adestramento ou Sobrevivência, você pode gastar 2 PE para receber +5 nesse teste. Além disso, não sofre penalidade em deslocamento por terreno difícil."
  },
  {
    "id": "origem-destemido",
    "name": "Destemido",
    "category": "Origem",
    "description": "Quando faz um teste de perícia para o qual uma falha terá como consequência direta dano ou uma condição negativa, você recebe +5 nesse teste."
  },
  {
    "id": "origem-espirito-civico",
    "name": "Espírito Cívico",
    "category": "Origem",
    "description": "Sempre que faz um teste para ajudar, você pode gastar 1 PE para aumentar o bônus concedido em +2."
  },
  {
    "id": "origem-eu-ja-sabia",
    "name": "Eu Já Sabia",
    "category": "Origem",
    "description": "Você recebe resistência a dano mental igual ao seu Intelecto."
  },
  {
    "id": "origem-faro-para-pistas",
    "name": "Faro para Pistas",
    "category": "Origem",
    "description": "Uma vez por cena, quando fizer um teste para procurar pistas, você pode gastar 1 PE para receber +5 nesse teste."
  },
  {
    "id": "origem-ferramenta-de-trabalho",
    "name": "Ferramenta de Trabalho",
    "category": "Origem",
    "description": "Escolha uma arma simples ou tática que poderia ser usada como ferramenta em sua profissão. Você sabe usar a arma escolhida e recebe +1 em testes de ataque, rolagens de dano e margem de ameaça com ela."
  },
  {
    "id": "origem-ferramentas-favoritas",
    "name": "Ferramentas Favoritas",
    "category": "Origem",
    "description": "Um item a sua escolha (exceto armas) conta como uma categoria abaixo para você."
  },
  {
    "id": "origem-fontes-confiaveis",
    "name": "Fontes Confiáveis",
    "category": "Origem",
    "description": "Uma vez por sessão de jogo, você pode gastar 1 PE para contatar suas fontes, rolando novamente um teste já realizado para encontrar uma pista com +5 de bônus, ou recebendo outra informação relevante."
  },
  {
    "id": "origem-fraternidade-gauderia",
    "name": "Fraternidade Gaudéria",
    "category": "Origem",
    "description": "Uma vez por rodada, quando um aliado adjacente é alvo de um ataque ou efeito, você pode gastar 1 PE para trocar de lugar com ele e se tornar o alvo. Se fizer isso, no próximo turno recebe +2 em testes de ataque contra o agressor."
  },
  {
    "id": "origem-impostor",
    "name": "Impostor",
    "category": "Origem",
    "description": "Uma vez por cena, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Enganação."
  },
  {
    "id": "origem-ingrediente-secreto",
    "name": "Ingrediente Secreto",
    "category": "Origem",
    "description": "Em cenas de interlúdio, cozinhe prato especial na ação alimentar-se: você e seus aliados recebem o benefício de dois pratos (acumulativo se repetido)."
  },
  {
    "id": "origem-investigacao-cientifica",
    "name": "Investigação Científica",
    "category": "Origem",
    "description": "Uma vez por cena de investigação, ação livre para procurar pistas usando Ciências no lugar da perícia original."
  },
  {
    "id": "origem-magnum-opus",
    "name": "Magnum Opus",
    "category": "Origem",
    "description": "Uma vez por missão, faça um personagem em interação reconhecê-lo. Você recebe +5 em testes de Presença e perícias baseadas em Presença contra ele."
  },
  {
    "id": "origem-mao-pesada",
    "name": "Mão Pesada",
    "category": "Origem",
    "description": "Você recebe +2 em rolagens de dano com ataques corpo a corpo."
  },
  {
    "id": "origem-mobilidade-acrobatica",
    "name": "Mobilidade Acrobática",
    "category": "Origem",
    "description": "Você recebe +2 na Defesa e seu deslocamento aumenta em +3m."
  },
  {
    "id": "origem-motor-de-busca",
    "name": "Motor de Busca",
    "category": "Origem",
    "description": "Sempre que tiver acesso à internet, você pode gastar 2 PE para substituir um teste de perícia qualquer por um teste de Tecnologia."
  },
  {
    "id": "origem-o-crime-compensa",
    "name": "O Crime Compensa",
    "category": "Origem",
    "description": "No final de uma missão, escolha um item encontrado nela. Na próxima missão você pode incluí-lo em seu inventário sem que ele conte em seu limite por patente."
  },
  {
    "id": "origem-para-bellum",
    "name": "Para Bellum",
    "category": "Origem",
    "description": "Você recebe +2 em rolagens de dano com armas de fogo."
  },
  {
    "id": "origem-patrocinador-da-ordem",
    "name": "Patrocinador da Ordem",
    "category": "Origem",
    "description": "Seu limite de crédito é sempre considerado um acima do atual."
  },
  {
    "id": "origem-patrulha",
    "name": "Patrulha",
    "category": "Origem",
    "description": "Você recebe +2 em Defesa."
  },
  {
    "id": "origem-posicao-de-combate",
    "name": "Posição de Combate",
    "category": "Origem",
    "description": "No primeiro turno de cada cena de ação, você pode gastar 2 PE para receber uma ação de movimento adicional."
  },
  {
    "id": "origem-processo-otimizado",
    "name": "Processo Otimizado",
    "category": "Origem",
    "description": "Sempre que faz um teste de perícia durante um teste estendido ou revisão de documentos, pode pagar 2 PE para receber +5 nesse teste."
  },
  {
    "id": "origem-saber-e-poder",
    "name": "Saber é Poder",
    "category": "Origem",
    "description": "Quando faz um teste usando Intelecto, você pode gastar 2 PE para receber +5 nesse teste."
  },
  {
    "id": "origem-tecnica-medicinal",
    "name": "Técnica Medicinal",
    "category": "Origem",
    "description": "Sempre que cura um personagem, você adiciona seu Intelecto no total de PV curados."
  },
  {
    "id": "origem-tracos-do-outro-lado",
    "name": "Traços do Outro Lado",
    "category": "Origem",
    "description": "Você possui um poder paranormal à sua escolha. Porém, começa o jogo com metade da Sanidade normal para sua classe."
  },
  {
    "id": "origem-vislumbres-do-passado",
    "name": "Vislumbres do Passado",
    "category": "Origem",
    "description": "Uma vez por sessão, teste Intelecto (DT 10) para reconhecer pessoas ou lugares familiares. Se passar, recebe 1d4 PE temporários e uma informação útil a critério do mestre."
  },
  {
    "id": "paranormal-expansao-de-conhecimento",
    "name": "Expansão de Conhecimento (Conhecimento)",
    "category": "Poder paranormal",
    "description": "Você aprende um poder de classe que não pertença à sua classe. Pré-requisito: Conhecimento 1. Afinidade: aprende um segundo poder de classe que não pertença à sua classe."
  },
  {
    "id": "paranormal-percepcao-paranormal",
    "name": "Percepção Paranormal (Conhecimento)",
    "category": "Poder paranormal",
    "description": "Em investigação, ao procurar pistas, você pode rolar novamente um dado com resultado menor que 10. Afinidade: pode rolar novamente até dois dados com resultado menor que 10."
  },
  {
    "id": "paranormal-precognicao",
    "name": "Precognição (Conhecimento)",
    "category": "Poder paranormal",
    "description": "Você recebe +2 em Defesa e em testes de resistência. Pré-requisito: Conhecimento 1. Afinidade: fica imune à condição desprevenido."
  },
  {
    "id": "paranormal-sensitivo",
    "name": "Sensitivo (Conhecimento)",
    "category": "Poder paranormal",
    "description": "Você recebe +5 em testes de Diplomacia, Intimidação e Intuição. Afinidade: o oponente sofre –1d20 em testes opostos com essas perícias."
  },
  {
    "id": "paranormal-visao-do-oculto",
    "name": "Visão do Oculto (Conhecimento)",
    "category": "Poder paranormal",
    "description": "Você recebe +5 em testes de Percepção e enxerga no escuro. Afinidade: você ignora camuflagem."
  },
  {
    "id": "paranormal-afortunado",
    "name": "Afortunado (Energia)",
    "category": "Poder paranormal",
    "description": "Uma vez por rolagem, você pode rolar novamente um resultado 1 em qualquer dado que não seja d20. Afinidade: além disso, uma vez por teste, pode rolar novamente um resultado 1 em d20."
  },
  {
    "id": "paranormal-campo-protetor",
    "name": "Campo Protetor (Energia)",
    "category": "Poder paranormal",
    "description": "Quando usa esquiva, pode gastar 1 PE para receber +5 em Defesa. Pré-requisito: Energia 1. Afinidade: +5 em Reflexo e não sofre nenhum dano se passar em teste que reduziria o dano à metade."
  },
  {
    "id": "paranormal-causalidade-fortuita",
    "name": "Causalidade Fortuita (Energia)",
    "category": "Poder paranormal",
    "description": "Em investigação, a DT para procurar pistas diminui em -5 para você até encontrar uma pista. Afinidade: a DT para procurar pistas sempre diminui em –5."
  },
  {
    "id": "paranormal-golpe-de-sorte",
    "name": "Golpe de Sorte (Energia)",
    "category": "Poder paranormal",
    "description": "Seus ataques recebem +1 na margem de ameaça. Pré-requisito: Energia 1. Afinidade: +1 no multiplicador de crítico."
  },
  {
    "id": "paranormal-manipular-entropia",
    "name": "Manipular Entropia (Energia)",
    "category": "Poder paranormal",
    "description": "Gaste 2 PE para fazer um alvo em alcance curto rolar novamente um dos dados em um teste de perícia. Pré-requisito: Energia 1. Afinidade: o alvo rola novamente todos os dados que você escolher."
  },
  {
    "id": "paranormal-encarar-a-morte",
    "name": "Encarar a Morte (Morte)",
    "category": "Poder paranormal",
    "description": "Durante cenas de ação, seu limite de gasto de PE aumenta em +1. Afinidade: limite de gasto de PE aumenta em +2 (total de +3)."
  },
  {
    "id": "paranormal-escapar-da-morte",
    "name": "Escapar da Morte (Morte)",
    "category": "Poder paranormal",
    "description": "Uma vez por cena, ao receber dano que o deixaria com 0 PV, você fica com 1 PV (exceto dano massivo). Pré-requisito: Morte 1. Afinidade: evita completamente o dano (em caso de dano massivo, fica com 1 PV)."
  },
  {
    "id": "paranormal-potencial-aprimorado",
    "name": "Potencial Aprimorado (Morte)",
    "category": "Poder paranormal",
    "description": "Você recebe +1 ponto de esforço por NEX retroativo. Afinidade: recebe +1 PE adicional por NEX (total de +2 PE por NEX)."
  },
  {
    "id": "paranormal-potencial-reaproveitado",
    "name": "Potencial Reaproveitado (Morte)",
    "category": "Poder paranormal",
    "description": "Uma vez por rodada, ao passar em um teste de resistência, ganha 2 PE temporários cumulativos até o fim da cena. Afinidade: ganha 3 PE temporários."
  },
  {
    "id": "paranormal-surto-temporal",
    "name": "Surto Temporal (Morte)",
    "category": "Poder paranormal",
    "description": "Uma vez por cena, no seu turno, você pode gastar 3 PE para realizar uma ação padrão adicional. Pré-requisito: Morte 2. Afinidade: pode usar uma vez por turno."
  },
  {
    "id": "paranormal-anatomia-insana",
    "name": "Anatomia Insana (Sangue)",
    "category": "Poder paranormal",
    "description": "50% de chance (resultado par em 1d4) de ignorar dano adicional de acerto crítico ou ataque furtivo. Pré-requisito: Sangue 2. Afinidade: imune a acertos críticos e ataques furtivos."
  },
  {
    "id": "paranormal-arma-de-sangue",
    "name": "Arma de Sangue (Sangue)",
    "category": "Poder paranormal",
    "description": "Ação de movimento e 2 PE: produz garras, chifres ou lâmina de sangue (arma simples leve, 1d6 dano Sangue). Uma vez por turno, na ação agredir, gasta 1 PE para ataque adicional. Afinidade: permanente e 1d10 de Sangue."
  },
  {
    "id": "paranormal-sangue-de-ferro",
    "name": "Sangue de Ferro (Sangue)",
    "category": "Poder paranormal",
    "description": "Você recebe +2 PV por NEX retroativo. Afinidade: +5 em Fortitude e imune a venenos e doenças."
  },
  {
    "id": "paranormal-sangue-fervente",
    "name": "Sangue Fervente (Sangue)",
    "category": "Poder paranormal",
    "description": "Enquanto machucado, recebe +1 em Agilidade ou Força. Pré-requisito: Sangue 2. Afinidade: bônus aumenta para +2."
  },
  {
    "id": "paranormal-sangue-vivo",
    "name": "Sangue Vivo (Sangue)",
    "category": "Poder paranormal",
    "description": "Na primeira vez que ficar machucado na cena, recebe cura acelerada 2 (até metade dos PV máximos). Pré-requisito: Sangue 1. Afinidade: cura acelerada aumenta para 5."
  },
  {
    "id": "paranormal-aprender-ritual",
    "name": "Aprender Ritual (Varia)",
    "category": "Poder paranormal",
    "description": "Aprende e conjura um ritual de 1º círculo (2º em 45%, 3º em 75%). Sujeito ao limite de rituais conhecidos."
  },
  {
    "id": "paranormal-resistir-a-elemento",
    "name": "Resistir a Elemento (Varia)",
    "category": "Poder paranormal",
    "description": "Escolha Conhecimento, Energia, Morte ou Sangue: recebe resistência 10 contra o elemento escolhido. Afinidade: resistência aumenta para 20."
  }
];

const orderRitualsCatalog = [
  {
    "id": "ritual-alterar-destino",
    "name": "Alterar Destino",
    "element": "Energia",
    "circle": 4,
    "execution": "reação",
    "range": "pessoal",
    "target": "você",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Você vislumbra seu futuro próximo, analisando milhões de possibilidades e escolhendo a melhor. Você recebe +15 em um teste de resistência ou na Defesa contra um ataque. Verdadeiro (+5 PE): muda o alcance para “curto” e o alvo para “um aliado à sua escolha”."
  },
  {
    "id": "ritual-alterar-memoria",
    "name": "Alterar Memória",
    "element": "Conhecimento",
    "circle": 3,
    "execution": "padrão",
    "range": "toque",
    "target": "1 pessoa",
    "duration": "instantânea",
    "resistance": "Vontade anula",
    "description": "Você invade a mente do alvo e altera ou apaga suas memórias de até uma hora atrás. Se escolher alterar as memórias, você pode mudar detalhes de eventos recentes, como a identidade de alguém encontrado ou o endereço de um lugar visitado, mas não reescrever completamente esses eventos. O alvo recupera suas memórias após 1d4 dias. Verdadeiro (+4 PE): você pode alterar ou apagar memórias de até 24 horas atrás. Requer 4º círculo."
  },
  {
    "id": "ritual-amaldicoar-arma",
    "name": "Amaldiçoar Arma",
    "element": "Varia",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 arma corpo a corpo ou pacote de munição",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Quando aprender este ritual, escolha um elemento entre Conhecimento, Energia, Morte e Sangue. Este ritual passa a ser do elemento escolhido. Você imbui a arma ou munições com o elemento, fazendo com que causem +1d6 de dano do tipo do elemento. Discente (+2 PE): muda o bônus de dano para +2d6. Requer 2º círculo. Verdadeiro (+5 PE): muda o bônus de dano para +4d6. Requer 3º círculo e afinidade."
  },
  {
    "id": "ritual-amaldicoar-tecnologia",
    "name": "Amaldiçoar Tecnologia",
    "element": "Energia",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 acessório ou arma de fogo",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Você imbui o alvo com Energia, fazendo-o funcionar acima de sua capacidade. O item recebe uma modificação a sua escolha. Discente (+2 PE): muda para duas modificações. Requer 2º círculo. Verdadeiro (+5 PE): muda para três modificações. Requer 3º círculo e afinidade."
  },
  {
    "id": "ritual-ancora-temporal",
    "name": "Âncora Temporal",
    "element": "Morte",
    "circle": 3,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "Vontade parcial",
    "description": "Uma aura espiralada surge sobre o alvo. No início de cada turno dele, ele deve fazer um teste de Vontade. Se falhar, não poderá se deslocar naquele turno (ele ainda pode agir, só não pode se deslocar). Se o alvo passar nesse teste dois turnos seguidos o efeito termina. Verdadeiro (+4 PE): muda o alvo para “seres à sua escolha”. Requer 4º círculo."
  },
  {
    "id": "ritual-aprimorar-fisico",
    "name": "Aprimorar Físico",
    "element": "Sangue",
    "circle": 2,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "O alvo tem seus músculos tonificados e seus ligamentos reforçados, recebendo +1 em Agilidade ou Força, à escolha dele. Discente (+3 PE): muda o bônus para +2. Requer 3º círculo. Verdadeiro (+7 PE): muda o bônus para +3. Requer 4º círculo e afinidade."
  },
  {
    "id": "ritual-aprimorar-mente",
    "name": "Aprimorar Mente",
    "element": "Conhecimento",
    "circle": 2,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "O alvo tem sua mente energizada por fagulhos do Conhecimento. Ele recebe +1 em Intelecto ou Presença, à escolha dele (esse aumento não fornece PE ou perícias treinadas). Discente (+3 PE): muda o bônus para +2. Requer 3º círculo. Verdadeiro (+7 PE): muda o bônus para +3. Requer 4º círculo e afinidade."
  },
  {
    "id": "ritual-arma-atroz",
    "name": "Arma Atroz",
    "element": "Sangue",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 arma corpo a corpo",
    "duration": "sustentada",
    "resistance": "nenhuma",
    "description": "A arma é recoberta por veias carmesim e passa a exalar uma aura de violência. Ela fornece +2 em testes de ataque e +1 na margem de ameaça. Discente (+2 PE): muda o bônus para +5 em testes de ataque. Requer 2º círculo. Verdadeiro (+5 PE): muda o bônus para +5 em testes de ataque e +2 na margem de ameaça e no multiplicador de crítico. Requer 3º círculo e afinidade."
  },
  {
    "id": "ritual-armadura-de-sangue",
    "name": "Armadura de Sangue",
    "element": "Sangue",
    "circle": 1,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Seu sangue escorre para fora do corpo, cobrindo-o sob a forma de uma carapaça que fornece +5 em Defesa. Esse bônus é cumulativo com outros rituais, mas não com bônus fornecido por equipamento. Discente (+5 PE): muda o efeito para “fornece +10 na Defesa e resistência a balístico, corte, impacto e perfuração 5”. Requer 3º círculo. Verdadeiro (+9 PE): muda o efeito para “fornece +15 na Defesa e resistência a balístico, corte, impacto e perfuração 10”. Requer 4º círculo e afinidade."
  },
  {
    "id": "ritual-barganha-insana",
    "name": "Barganha Insana",
    "element": "Morte",
    "circle": 3,
    "execution": "completa",
    "range": "pessoal",
    "target": "você",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Você contata a entidade da Morte e entrega a ela parte de sua própria percepção temporal da Realidade, em troca da restauração plena de sua saúde. Você recupera todos os pontos de vida e pontos de energia, e elimina quaisquer condições negativas que o estejam afetando. Porém, no final da cena, perde 1d4 pontos de Sanidade permanentemente."
  },
  {
    "id": "ritual-canalizar-o-medo",
    "name": "Canalizar o Medo",
    "element": "Medo",
    "circle": 4,
    "execution": "padrão",
    "range": "toque",
    "target": "1 pessoa",
    "duration": "permanente até ser descarregada",
    "resistance": "nenhuma",
    "description": "Você transfere parte de seu poder para outra pessoa. Escolha um ritual de até 3º círculo que você conheça; o alvo pode conjurar este ritual em sua forma básica uma vez, sem pagar seu custo em PE (mas pode usar formas avançadas gastando seus próprios PE para isso). Até o ritual transferido ser conjurado, seus PE máximos diminuem em um valor igual ao custo dele."
  },
  {
    "id": "ritual-capturar-o-coracao",
    "name": "Capturar o Coração",
    "element": "Sangue",
    "circle": 4,
    "execution": "padrão",
    "range": "curto",
    "target": "1 pessoa",
    "duration": "cena",
    "resistance": "Vontade parcial",
    "description": "Você desperta uma paixão doentia e obcecada por você no alvo, que passa a querer agradá-lo a todo custo, mesmo que para isso precise ficar contra seus amigos. No início de cada turno do alvo ele deve fazer um teste de Vontade. Se falhar, age de forma a ajudá-lo na melhor de suas capacidades naquele turno. Se o alvo passar nesse teste dois turnos seguidos o efeito termina."
  },
  {
    "id": "ritual-chamas-do-caos",
    "name": "Chamas do Caos",
    "element": "Energia",
    "circle": 2,
    "execution": "padrão",
    "range": "curto",
    "target": "veja texto",
    "duration": "cena",
    "resistance": "veja texto",
    "description": "Você manipula o calor e o fogo: Chamejar (+1d6 dano de fogo na arma), Esquentar (1d6 de fogo/rodada no objeto), Extinguir (apaga chama até Grande, cria nuvem com camuflagem de 3m) ou Modelar (move chama 9m, causa 3d6 de fogo). Discente (+3 PE): sustentada, reflexos reduz à metade, labareda de 4d6 dano de Energia. Verdadeiro (+7 PE): muda o dano da labareda para 8d6."
  },
  {
    "id": "ritual-cicatrizacao",
    "name": "Cicatrização",
    "element": "Morte",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Você acelera o tempo ao redor das feridas do alvo, que cicatrizam instantaneamente. O alvo recupera 3d8+3 PV, mas envelhece 1 ano automaticamente. Discente (+2 PE): aumenta a cura para 5d8+5 PV. Requer 2º círculo. Verdadeiro (+9 PE): muda o alcance para “curto”, o alvo para “seres escolhidos” e aumenta a cura para 7d8+7 PV. Requer 4º círculo e afinidade com Morte."
  },
  {
    "id": "ritual-cineraria",
    "name": "Cinerária",
    "element": "Medo",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "nuvem de 6m de raio",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Você manifesta uma névoa carregada de essência paranormal. Rituais conjurados dentro da névoa têm sua DT aumentada em +5. Discente (+2 PE): rituais conjurados dentro da névoa custam –2 PE. Verdadeiro (+5 PE): rituais conjurados dentro da névoa causam dano maximizado."
  },
  {
    "id": "ritual-coincidencia-forcada",
    "name": "Coincidência Forçada",
    "element": "Energia",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Você manipula os caminhos do caos para que o alvo tenha mais sorte. O alvo recebe +2 em testes de perícias. Discente (+2 PE): muda o alvo para aliados à sua escolha. Requer 2º círculo. Verdadeiro (+5 PE): muda o alvo para aliados à sua escolha e o bônus para +5. Requer 3º círculo e afinidade."
  },
  {
    "id": "ritual-compreensao-paranormal",
    "name": "Compreensão Paranormal",
    "element": "Conhecimento",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser ou objeto",
    "duration": "cena",
    "resistance": "Vontade anula",
    "description": "O ritual confere compreensão sobrenatural da linguagem humana ou sentimentos básicos de animais. Discente (+2 PE): alcance curto, entende todos os alvos escolhidos. Verdadeiro (+5 PE): pessoal, pode falar, entender e escrever qualquer idioma humano."
  },
  {
    "id": "ritual-conhecendo-o-medo",
    "name": "Conhecendo o Medo",
    "element": "Medo",
    "circle": 4,
    "execution": "padrão",
    "range": "toque",
    "target": "1 pessoa",
    "duration": "cena",
    "resistance": "Vontade parcial",
    "description": "Você manifesta medo absoluto na mente do alvo. Se falhar, a Sanidade dele é reduzida a 0 e ele fica enlouquecendo (podendo virar criatura paranormal). Se passar, sofre 10d6 pontos de dano mental e fica apavorado por 1 rodada."
  },
  {
    "id": "ritual-consumir-manancial",
    "name": "Consumir Manancial",
    "element": "Morte",
    "circle": 1,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Você suga o tempo de vida ao redor, recebendo 3d6 PV temporários até o fim da cena. Discente (+2 PE): muda para 6d6 PV temporários. Verdadeiro (+5 PE): esfera de 6m centrada em você, causa 3d6 dano de Morte a todos (Fortitude reduz à metade) e recebe PV temporários iguais ao dano causado."
  },
  {
    "id": "ritual-contato-paranormal",
    "name": "Contato Paranormal",
    "element": "Conhecimento",
    "circle": 3,
    "execution": "completa",
    "range": "pessoal",
    "target": "você",
    "duration": "1 dia",
    "resistance": "nenhuma",
    "description": "Você recebe seis d6 de auxílio para somar em testes de perícia. Cada 6 rolado drena 2 de Sanidade. Discente (+4 PE): dados d8, 8 drena 3 de Sanidade. Verdadeiro (+9 PE): dados d12, 12 drena 5 de Sanidade."
  },
  {
    "id": "ritual-contencao-fantasmagorica",
    "name": "Contenção Fantasmagórica",
    "element": "Energia",
    "circle": 2,
    "execution": "padrão",
    "range": "médio",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "Reflexos anula",
    "description": "Três laços de Energia agarram o alvo (Defesa 10, 10 PV, RD 5, imunes a Energia). Afeta criaturas incorpóreas. Discente (+3 PE): 6 laços. Verdadeiro (+5 PE): cada laço destruído causa 2d6+2 de Energia no alvo agarrado."
  },
  {
    "id": "ritual-controle-mental",
    "name": "Controle Mental",
    "element": "Conhecimento",
    "circle": 4,
    "execution": "padrão",
    "range": "médio",
    "target": "1 pessoa ou animal",
    "duration": "sustentada",
    "resistance": "Vontade parcial",
    "description": "Você domina a mente do alvo, que obedece seus comandos exceto suicidas (teste de Vontade no final de cada turno). Discente (+5 PE): até 5 alvos. Verdadeiro (+10 PE): até 10 alvos."
  },
  {
    "id": "ritual-convocacao-instantanea",
    "name": "Convocação Instantânea",
    "element": "Energia",
    "circle": 3,
    "execution": "padrão",
    "range": "ilimitado",
    "target": "1 objeto de até 2 espaços",
    "duration": "instantânea",
    "resistance": "Vontade anula",
    "description": "Você invoca um objeto previamente preparado de qualquer lugar para a sua mão. Discente (+4 PE): objeto até 10 espaços. Verdadeiro (+9 PE): 1 recipiente Médio até 10 espaços no Outro Lado por duração permanente (custa 1 PE permanente)."
  },
  {
    "id": "ritual-convocar-o-algoz",
    "name": "Convocar o Algoz",
    "element": "Morte",
    "circle": 4,
    "execution": "padrão",
    "range": "1,5m",
    "target": "1 pessoa",
    "duration": "sustentada",
    "resistance": "Vontade/Fortitude parcial",
    "description": "Manifesta o maior medo da vítima. Flutua 12m por turno rumo ao alvo. Em alcance curto: Vontade ou abalado. Adjacente: Fortitude ou colapso para 0 PV (se passar, 6d6 dano de Morte sem reduzir a menos de 1 PV)."
  },
  {
    "id": "ritual-corpo-adaptado",
    "name": "Corpo Adaptado",
    "element": "Sangue",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 pessoa ou animal",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "O alvo fica imune a calor e frio extremos, respira na água se respirar ar e não sufoca em fumaça densa. Discente (+2 PE): duração 1 dia. Verdadeiro (+5 PE): alcance curto e alvos escolhidos."
  },
  {
    "id": "ritual-decadencia",
    "name": "Decadência",
    "element": "Morte",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "instantânea",
    "resistance": "Fortitude reduz à metade",
    "description": "Espirais de trevas causam 2d8+2 pontos de dano de Morte. Discente (+2 PE): transfere para arma e desfere ataque corpo a corpo somando dano da arma e 3d8+3 de Morte sem resistência. Verdadeiro (+5 PE): explosão de 6m pessoal, 8d8+8 dano de Morte a todos na área."
  },
  {
    "id": "ritual-definhar",
    "name": "Definhar",
    "element": "Morte",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "Fortitude parcial",
    "description": "O alvo fica fatigado (ou vulnerável se passar). Discente (+2 PE): alvo fica exausto (ou fatigado se passar). Verdadeiro (+5 PE): até 5 seres como discente."
  },
  {
    "id": "ritual-deflagracao-de-energia",
    "name": "Deflagração de Energia",
    "element": "Energia",
    "circle": 4,
    "execution": "completa",
    "range": "pessoal",
    "target": "explosão de 15m de raio",
    "duration": "instantânea",
    "resistance": "Fortitude parcial",
    "description": "Todos na área (exceto você) sofrem 3d10 x 10 pontos de dano de Energia e itens tecnológicos quebram temporariamente. Sucesso reduz dano à metade. Verdadeiro (+5 PE): afeta apenas alvos à sua escolha."
  },
  {
    "id": "ritual-desacelerar-impacto",
    "name": "Desacelerar Impacto",
    "element": "Morte",
    "circle": 2,
    "execution": "reação",
    "range": "curto",
    "target": "1 ser ou objetos até 10 espaços",
    "duration": "até chegar ao solo ou cena",
    "resistance": "nenhuma",
    "description": "Queda reduzida para 18m/rodada sem dano. Projéteis em queda causam metade do dano normal. Discente (+3 PE): até 100 espaços."
  },
  {
    "id": "ritual-descarnar",
    "name": "Descarnar",
    "element": "Sangue",
    "circle": 2,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "instantânea",
    "resistance": "Fortitude parcial",
    "description": "Causa 6d8 pontos de dano (metade corte, metade Sangue) e causa hemorragia severa de 2d8/turno (Fortitude reduz e evita hemorragia). Discente (+3 PE): 10d8 direto e 4d8 hemorragia. Verdadeiro (+7 PE): você ganha +4d8 Sangue e hemorragia nos ataques corpo a corpo sustentados."
  },
  {
    "id": "ritual-deteccao-de-ameacas",
    "name": "Detecção de Ameaças",
    "element": "Conhecimento",
    "circle": 2,
    "execution": "padrão",
    "range": "pessoal",
    "target": "esfera de 18m de raio",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Sensação de perigo quando ser hostil ou armadilha entra na área; Percepção DT 20 revela direção e distância. Discente (+3 PE): não fica desprevenido e +5 em testes contra armadilhas. Verdadeiro (+5 PE): duração 1 dia."
  },
  {
    "id": "ritual-dissipar-ritual",
    "name": "Dissipar Ritual",
    "element": "Medo",
    "circle": 3,
    "execution": "padrão",
    "range": "médio",
    "target": "1 ser/objeto ou esfera de 3m",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Teste de Ocultismo dissipa rituais ativos com DT igual ou menor. Pode anular poderes de item amaldiçoado por 1 dia (Vontade nega se portado)."
  },
  {
    "id": "ritual-dissonancia-acustica",
    "name": "Dissonância Acústica",
    "element": "Energia",
    "circle": 2,
    "execution": "padrão",
    "range": "médio",
    "target": "esfera com 6m de raio",
    "duration": "sustentada",
    "resistance": "nenhuma",
    "description": "Cria área de dissonância sonora: todos ficam surdos e impede conjuração de rituais. Discente (+1 PE): objeto emana silêncio de 3m. Verdadeiro (+3 PE): nenhum som sai da área, mas dentro funciona normalmente."
  },
  {
    "id": "ritual-distorcao-temporal",
    "name": "Distorção Temporal",
    "element": "Morte",
    "circle": 4,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "3 rodadas",
    "resistance": "nenhuma",
    "description": "Cria bolsão temporal por 3 rodadas onde você age livremente, sem se deslocar nem interagir com seres/objetos e imune a efeitos contínuos externos."
  },
  {
    "id": "ritual-distorcer-aparencia",
    "name": "Distorcer Aparência",
    "element": "Sangue",
    "circle": 1,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "Vontade desacredita",
    "description": "Modifica completamente a aparência física (altura, peso, voz, digitais, córnea), concedendo +10 em Enganação para disfarce. Discente (+2 PE): alcance curto, 1 ser. Verdadeiro (+5 PE): alvos escolhidos."
  },
  {
    "id": "ritual-eco-espiral",
    "name": "Eco Espiral",
    "element": "Morte",
    "circle": 2,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "2 rodadas",
    "resistance": "Fortitude reduz à metade",
    "description": "Manifesta cópia de cinzas. Concentre-se no próximo turno e descarregue no segundo: o alvo sofre dano de Morte igual ao dano que sofreu na rodada de concentração. Discente (+3 PE): até 5 seres. Verdadeiro (+7 PE): até 3 rodadas."
  },
  {
    "id": "ritual-eletrocussao",
    "name": "Eletrocussão",
    "element": "Energia",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser ou objeto",
    "duration": "instantânea",
    "resistance": "Fortitude parcial",
    "description": "Dispara corrente que causa 3d6 de eletricidade e deixa o alvo vulnerável por 1 rodada (metade e evita condição se passar). Dobro de dano contra eletrônicos. Discente (+2 PE): linha de 30m, 6d6 Energia. Verdadeiro (+5 PE): alvos escolhidos sofrem 8d6 de Energia cada."
  },
  {
    "id": "ritual-embaralhar",
    "name": "Embaralhar",
    "element": "Energia",
    "circle": 1,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Cria 3 cópias holográficas ilusórias (+6 na Defesa; cada ataque errado elimina uma cópia e diminui o bônus em 2). Discente (+2 PE): 5 cópias (+10 na Defesa). Verdadeiro (+5 PE): 8 cópias (+16 na Defesa e clarão ofuscante ao destruir cópia)."
  },
  {
    "id": "ritual-enfeiticar",
    "name": "Enfeitiçar",
    "element": "Conhecimento",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "1 pessoa",
    "duration": "cena",
    "resistance": "Vontade anula",
    "description": "Alvo se torna prestativo e você recebe +10 em Diplomacia com ele. Discente (+2 PE): sugere uma ação aceitável e o alvo obedece. Verdadeiro (+5 PE): afeta todos os alvos dentro do alcance."
  },
  {
    "id": "ritual-esconder-dos-olhos",
    "name": "Esconder dos Olhos",
    "element": "Conhecimento",
    "circle": 2,
    "execution": "livre",
    "range": "pessoal",
    "target": "você",
    "duration": "1 rodada",
    "resistance": "nenhuma",
    "description": "Invisibilidade completa: camuflagem total e +15 em Furtividade até atacar ou usar ação hostil. Discente (+3 PE): esfera de invisibilidade de 3m sustentada para você e aliados. Verdadeiro (+7 PE): ação padrão, toque, sustentada, não quebra com ataque hostil."
  },
  {
    "id": "ritual-espirais-da-perdicao",
    "name": "Espirais da Perdição",
    "element": "Morte",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Espirais tornam os movimentos lentos: o alvo sofre –1d20 em testes de ataque. Discente (+2 PE): penalidade aumenta para –2d20. Verdadeiro (+8 PE): –2d20 em seres escolhidos."
  },
  {
    "id": "ritual-ferver-sangue",
    "name": "Ferver Sangue",
    "element": "Sangue",
    "circle": 3,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "sustentada",
    "resistance": "Fortitude parcial",
    "description": "O sangue ferve: 4d8 dano de Sangue e condição fraco no início de cada turno (Fortitude reduz e evita fraco; 2 sucessos encerram). Verdadeiro (+4 PE): seres escolhidos."
  },
  {
    "id": "ritual-fim-inevitavel",
    "name": "Fim Inevitável",
    "element": "Morte",
    "circle": 4,
    "execution": "completa",
    "range": "extremo",
    "target": "buraco negro de 1,5m",
    "duration": "4 rodadas",
    "resistance": "Fortitude parcial",
    "description": "Vácuo puxa seres até 90m (30m por rodada se falhar em Fortitude). Quem iniciar tocando o vácuo sofre 100 pontos de dano de Morte por rodada. Discente (+5 PE): 5 rodadas e você não é afetado. Verdadeiro (+10 PE): 6 rodadas e protege aliados."
  },
  {
    "id": "ritual-flagelo-de-sangue",
    "name": "Flagelo de Sangue",
    "element": "Sangue",
    "circle": 2,
    "execution": "padrão",
    "range": "toque",
    "target": "1 pessoa",
    "duration": "cena",
    "resistance": "Fortitude parcial",
    "description": "Grava marca escarificada com ordem verbal. A cada rodada desobedecida, causa 10d6 de Sangue e enjoo (Fortitude reduz à metade e evita condição). Discente (+3 PE): qualquer ser exceto criaturas de Sangue. Verdadeiro (+7 PE): duração 1 dia."
  },
  {
    "id": "ritual-forma-monstruosa",
    "name": "Forma Monstruosa",
    "element": "Sangue",
    "circle": 3,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Assume forma de criatura de Sangue: tamanho Grande, +5 em ataque e dano corpo a corpo, 30 PV temporários. Ataca o ser mais próximo em fúria. Discente (+3 PE): imunidade a atordoamento, fadiga, sangramento, sono e veneno. Verdadeiro (+9 PE): +10 em ataque/dano e 50 PV temporários."
  },
  {
    "id": "ritual-fortalecimento-sensorial",
    "name": "Fortalecimento Sensorial",
    "element": "Sangue",
    "circle": 1,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Recebe +1d20 em Investigação, Luta, Percepção e Pontaria. Discente (+2 PE): inimigos sofrem –1d20 em ataques contra você. Verdadeiro (+5 PE): imune a surpreendido e desprevenido, +10 em Defesa e Reflexos."
  },
  {
    "id": "ritual-hemofagia",
    "name": "Hemofagia",
    "element": "Sangue",
    "circle": 2,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "instantânea",
    "resistance": "Fortitude reduz à metade",
    "description": "Arranca sangue causando 6d6 de Sangue e cura metade do dano causado. Discente (+3 PE): golpe com arma somando dano e ritual sem resistência. Verdadeiro (+7 PE): sustentada por cena, ação padrão para tocar e causar 4d6 recuperando metade em PV."
  },
  {
    "id": "ritual-inexistir",
    "name": "Inexistir",
    "element": "Conhecimento",
    "circle": 4,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "instantânea",
    "resistance": "Vontade parcial",
    "description": "Desmantela a existência do alvo: 10d12+10 de Conhecimento (2d12 e debilitado se passar). Se reduzido a 0 PV, é completamente apagado da realidade sem deixar vestígios. Discente (+5 PE): 15d12+15 (3d12 se passar). Verdadeiro (+10 PE): 20d12+20 (4d12 se passar)."
  },
  {
    "id": "ritual-invadir-mente",
    "name": "Invadir Mente",
    "element": "Conhecimento",
    "circle": 2,
    "execution": "padrão",
    "range": "médio ou toque",
    "target": "1 ser ou 2 pessoas",
    "duration": "instantânea ou 1 dia",
    "resistance": "Vontade parcial ou nenhuma",
    "description": "Rajada Mental: 6d6 de Conhecimento e atordoado por 1 rodada (metade e evita atordoado se passar). Ligação Telepática: comunicação mental entre duas pessoas por 1 dia. Discente (+3 PE): 10d6 de dano ou ver/ouvir pelos sentidos do alvo. Verdadeiro (+7 PE): 10d6 em área ou elo mental entre 5 pessoas."
  },
  {
    "id": "ritual-involucro-de-carne",
    "name": "Invólucro de Carne",
    "element": "Sangue",
    "circle": 4,
    "execution": "padrão",
    "range": "curto",
    "target": "1 clone seu",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Cria cópia física sua com seu equipamento mundano. Comande por ação de movimento ou assuma controle sensorial total entrando em transe."
  },
  {
    "id": "ritual-lamina-do-medo",
    "name": "Lâmina do Medo",
    "element": "Medo",
    "circle": 4,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "instantânea",
    "resistance": "Fortitude parcial",
    "description": "Golpeia com fenda na Realidade: se falhar em Fortitude, PV cai a 0 e fica morrendo; se passar, 10d8 de Medo (ignora resistências) e apavorado por 1 rodada."
  },
  {
    "id": "ritual-localizacao",
    "name": "Localização",
    "element": "Conhecimento",
    "circle": 2,
    "execution": "padrão",
    "range": "pessoal",
    "target": "círculo de 90m de raio",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Indica direção e distância da pessoa ou objeto mais próximo desse tipo ao alcance. Discente (+3 PE): descobre rota mais direta de entrada/saída de local por 1 hora. Verdadeiro (+7 PE): raio de 1km."
  },
  {
    "id": "ritual-luz",
    "name": "Luz",
    "element": "Energia",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "1 objeto",
    "duration": "cena",
    "resistance": "Vontade anula",
    "description": "Objeto emite luz brilhante em área de 9m de raio. Discente (+2 PE): cria 4 esferas de luz móveis que ofuscam inimigos. Verdadeiro (+5 PE): aliados na luz recebem +1d20 em Vontade e inimigos ficam ofuscados."
  },
  {
    "id": "ritual-medo-tangivel",
    "name": "Medo Tangível",
    "element": "Medo",
    "circle": 4,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Corpo torna-se manifestação do Medo: imune a condições mundanas, críticos e furtivos, e dano mundano (balístico, corte, impacto, perfuração) não pode reduzir seus PV abaixo de 1."
  },
  {
    "id": "ritual-mergulho-mental",
    "name": "Mergulho Mental",
    "element": "Conhecimento",
    "circle": 3,
    "execution": "padrão",
    "range": "toque",
    "target": "1 pessoa",
    "duration": "sustentada",
    "resistance": "Vontade parcial",
    "description": "Mergulha na mente do alvo tocado para fazer perguntas de sim/não impossíveis de mentir. Verdadeiro (+4 PE): execução 1 dia, alcance ilimitado com cuba de ouro cheia d'água e máscara."
  },
  {
    "id": "ritual-miasma-entropico",
    "name": "Miasma Entrópico",
    "element": "Morte",
    "circle": 2,
    "execution": "padrão",
    "range": "médio",
    "target": "nuvem com 6m de raio",
    "duration": "instantânea",
    "resistance": "Fortitude parcial",
    "description": "Explosão de emanações tóxicas causa 4d8 de dano químico e enjoo por 1 rodada. Discente (+3 PE): muda dano para 6d8 de Morte. Verdadeiro (+7 PE): duração 3 rodadas."
  },
  {
    "id": "ritual-nuvem-de-cinzas",
    "name": "Nuvem de Cinzas",
    "element": "Morte",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "nuvem de 6m de raio",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Fuligem obscurece a visão concedendo camuflagem a até 1,5m e total a partir de 3m. Discente (+2 PE): aliados escolhidos enxergam através do efeito. Verdadeiro (+5 PE): deslocamento vira 3m e –2 em testes de ataque."
  },
  {
    "id": "ritual-odio-incontrolavel",
    "name": "Ódio Incontrolável",
    "element": "Sangue",
    "circle": 1,
    "execution": "padrão",
    "range": "toque",
    "target": "1 pessoa",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Frenesi: +2 em ataque e dano corpo a corpo e RD 5 contra dano mundano (deve sempre atacar). Discente (+2 PE): ataque corpo a corpo adicional na ação agredir. Verdadeiro (+5 PE): +5 em ataque/dano e sofre metade do dano mundano."
  },
  {
    "id": "ritual-ouvir-os-sussurros",
    "name": "Ouvir os Sussurros",
    "element": "Conhecimento",
    "circle": 1,
    "execution": "completa",
    "range": "pessoal",
    "target": "você",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Pergunta sim/não sobre ação iminente consultando ecos do Outro Lado. Discente (+2 PE): 1 minuto, pergunta sobre evento até 1 dia no futuro. Verdadeiro (+5 PE): 10 minutos, pergunta por rodada durante 5 rodadas."
  },
  {
    "id": "ritual-paradoxo",
    "name": "Paradoxo",
    "element": "Morte",
    "circle": 2,
    "execution": "padrão",
    "range": "médio",
    "target": "esfera de 6m de raio",
    "duration": "instantânea",
    "resistance": "Fortitude reduz à metade",
    "description": "Implosão de distorção temporal causa 6d6 de dano de Morte na área. Discente (+3 PE): esfera móvel de 1,5m por cena causando 4d6 de Morte. Verdadeiro (+7 PE): dano 13d6; se chegar a 0 PV deve passar em Fortitude ou vira cinzas."
  },
  {
    "id": "ritual-perturbacao",
    "name": "Perturbação",
    "element": "Conhecimento",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "1 pessoa",
    "duration": "1 rodada",
    "resistance": "Vontade anula",
    "description": "Dá ordem verbal irresistível: Fuja, Largue, Pare (pasmo), Sente-se ou Venha. Discente (+2 PE): comando 'Sofra' causa 3d8 de Conhecimento e abalado. Verdadeiro (+5 PE): até 5 seres ou comando 'Ataque'."
  },
  {
    "id": "ritual-poeira-da-podridao",
    "name": "Poeira da Podridão",
    "element": "Morte",
    "circle": 3,
    "execution": "padrão",
    "range": "médio",
    "target": "nuvem com 6m de raio",
    "duration": "sustentada",
    "resistance": "Fortitude",
    "description": "Causa 4d8 de dano de Morte a cada rodada e alvos que falharem não recuperam PV por 1 rodada. Verdadeiro (+4 PE): dano aumenta para 4d8+16."
  },
  {
    "id": "ritual-polarizacao-caotica",
    "name": "Polarização Caótica",
    "element": "Energia",
    "circle": 1,
    "execution": "padrão",
    "range": "curto",
    "target": "você",
    "duration": "sustentada",
    "resistance": "Vontade anula",
    "description": "Aura magnética: Atrair objeto metálico até 2 espaços ou Repelir objetos recebendo RD 5 contra dano físico. Discente (+2 PE): arremessa até 10 objetos causando dano de impacto. Verdadeiro (+5 PE): levita e move ser ou objeto até 10 espaços."
  },
  {
    "id": "ritual-possessao",
    "name": "Possessão",
    "element": "Conhecimento",
    "circle": 4,
    "execution": "padrão",
    "range": "longo",
    "target": "1 pessoa viva ou morta",
    "duration": "1 dia",
    "resistance": "Vontade anula",
    "description": "Projeta consciência no corpo do alvo assumindo controle total com os atributos físicos e deslocamento dele."
  },
  {
    "id": "ritual-presenca-do-medo",
    "name": "Presença do Medo",
    "element": "Medo",
    "circle": 4,
    "execution": "padrão",
    "range": "pessoal",
    "target": "emanação de 9m de raio",
    "duration": "sustentada",
    "resistance": "Vontade reduz à metade",
    "description": "Emana ondas de sofrimento: 5d8 mental e 5d8 de Medo no turno (alvos que falham ficam atordoados por 1 rodada)."
  },
  {
    "id": "ritual-protecao-contra-rituais",
    "name": "Proteção contra Rituais",
    "element": "Medo",
    "circle": 2,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "O alvo recebe resistência a paranormal 5 e +5 em testes contra efeitos paranormais. Discente (+3 PE): até 5 seres tocados. Verdadeiro (+6 PE): até 5 seres, RD paranormal 10 e +10 em resistência."
  },
  {
    "id": "ritual-purgatorio",
    "name": "Purgatório",
    "element": "Sangue",
    "circle": 3,
    "execution": "padrão",
    "range": "curto",
    "target": "área de 6m de raio",
    "duration": "sustentada",
    "resistance": "Fortitude parcial",
    "description": "Poça pegajosa deixa inimigos vulneráveis a dano físico. Sair da área causa 6d6 de Sangue e exige teste de Fortitude para não perder o movimento."
  },
  {
    "id": "ritual-rejeitar-nevoa",
    "name": "Rejeitar Névoa",
    "element": "Medo",
    "circle": 2,
    "execution": "padrão",
    "range": "curto",
    "target": "nuvem de 6m de raio",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Rituais na área custam +2 PE por círculo e execução sobe um passo. Anula Cinerária. Discente (+2 PE): DT de testes na área cai –5. Verdadeiro (+5 PE): dano de rituais na área é sempre mínimo."
  },
  {
    "id": "ritual-salto-fantasma",
    "name": "Salto Fantasma",
    "element": "Energia",
    "circle": 3,
    "execution": "padrão",
    "range": "médio",
    "target": "você",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Transforma corpo em energia e viaja até outro ponto imaginado/visto. Discente (+2 PE): reação, salta 1,5m recebendo +10 em Defesa e Reflexos. Verdadeiro (+4 PE): alcance longo para você e até 2 aliados tocados."
  },
  {
    "id": "ritual-sopro-do-caos",
    "name": "Sopro do Caos",
    "element": "Energia",
    "circle": 2,
    "execution": "padrão",
    "range": "médio",
    "target": "varia",
    "duration": "sustentada",
    "resistance": "veja texto",
    "description": "Ascender (faz alvo Médio flutuar 6m/rodada), Sopro (empurra alvos em cone de 4,5m usando Ocultismo) ou Vento (cria vento forte na área). Discente (+3 PE): afeta alvos Grandes. Verdadeiro (+9 PE): afeta alvos Enormes."
  },
  {
    "id": "ritual-tecer-ilusao",
    "name": "Tecer Ilusão",
    "element": "Conhecimento",
    "circle": 1,
    "execution": "padrão",
    "range": "médio",
    "target": "até 4 cubos de 1,5m",
    "duration": "cena",
    "resistance": "Vontade desacredita",
    "description": "Cria ilusão visual ou sonora simples. Discente (+2 PE): até 8 cubos sustentados com som, cheiro, temperatura e sensações táteis. Verdadeiro (+5 PE): ilusão letal causando 6d6 de dano de Conhecimento."
  },
  {
    "id": "ritual-tela-de-ruido",
    "name": "Tela de Ruído",
    "element": "Energia",
    "circle": 2,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Película absorve energia: 30 PV temporários contra dano físico (ou reação com resistência 15 contra o dano). Discente (+3 PE): 60 PV temporários e resistência 30. Verdadeiro (+7 PE): cria esfera intransponível ao redor de alvo até Enorme."
  },
  {
    "id": "ritual-teletransporte",
    "name": "Teletransporte",
    "element": "Energia",
    "circle": 4,
    "execution": "padrão",
    "range": "toque",
    "target": "até 5 seres voluntários",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Teletransporta o grupo para destino conhecido a até 1.000km com teste de Ocultismo (DT 25 a 35). Verdadeiro (+5 PE): qualquer local da Terra."
  },
  {
    "id": "ritual-tentaculos-de-lodo",
    "name": "Tentáculos de Lodo",
    "element": "Morte",
    "circle": 3,
    "execution": "padrão",
    "range": "médio",
    "target": "círculo com 6m de raio",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Tentáculos imunes a dano agarram usando Ocultismo e esmagam causando 4d6 (metade impacto, metade Morte). Terreno difícil. Verdadeiro (+5 PE): raio de 9m e dano 6d6."
  },
  {
    "id": "ritual-terceiro-olho",
    "name": "Terceiro Olho",
    "element": "Conhecimento",
    "circle": 1,
    "execution": "padrão",
    "range": "pessoal",
    "target": "você",
    "duration": "cena",
    "resistance": "nenhuma",
    "description": "Enxerga auras paranormais em alcance longo, identificando elementos e intensidades. Discente (+2 PE): duração 1 dia. Verdadeiro (+5 PE): enxerga seres e objetos invisíveis."
  },
  {
    "id": "ritual-transfigurar-agua",
    "name": "Transfigurar Água",
    "element": "Energia",
    "circle": 3,
    "execution": "padrão",
    "range": "longo",
    "target": "esfera de 30m de raio",
    "duration": "cena",
    "resistance": "veja texto",
    "description": "Manipula corpos d'água: Congelar (imobiliza nadadores), Derreter, Enchente (+6m de deslocamento para barco), Evaporar (5d8 de Energia na área, dobro em Morte) ou Partir (abre caminho seco). Verdadeiro (+5 PE): +12m em enchente e 10d8 de dano em evaporar."
  },
  {
    "id": "ritual-transfigurar-terra",
    "name": "Transfigurar Terra",
    "element": "Energia",
    "circle": 3,
    "execution": "padrão",
    "range": "longo",
    "target": "9 cubos de 1,5m",
    "duration": "instantânea",
    "resistance": "veja texto",
    "description": "Amolecer (provoca desabamento de 10d6 de impacto ou areia fofa), Modelar (cria objetos simples ou paredes com RD 8 e 50 PV) ou Solidificar (prende quem estiver na superfície). Discente (+3 PE): 15 cubos. Verdadeiro (+7 PE): afeta todos os tipos de minerais e metais."
  },
  {
    "id": "ritual-transfusao-vital",
    "name": "Transfusão Vital",
    "element": "Sangue",
    "circle": 2,
    "execution": "padrão",
    "range": "toque",
    "target": "1 ser",
    "duration": "instantânea",
    "resistance": "nenhuma",
    "description": "Sofre até 30 pontos de dano de Sangue para curar a mesma quantidade em PV no alvo. Discente (+3 PE): transfere até 50 PV. Verdadeiro (+7 PE): transfere até 100 PV."
  },
  {
    "id": "ritual-velocidade-mortal",
    "name": "Velocidade Mortal",
    "element": "Morte",
    "circle": 2,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "sustentada",
    "resistance": "nenhuma",
    "description": "Alvo recebe uma ação de movimento adicional por turno. Discente (+3 PE): recebe uma ação padrão adicional por turno em vez de movimento. Verdadeiro (+7 PE): alvos escolhidos."
  },
  {
    "id": "ritual-videncia",
    "name": "Vidência",
    "element": "Conhecimento",
    "circle": 3,
    "execution": "completa",
    "range": "ilimitado",
    "target": "1 ser",
    "duration": "5 rodadas",
    "resistance": "Vontade anula",
    "description": "Permite ver e ouvir o alvo e arredores por superfícies reflexivas através de conexões de conhecimento (pertences ou dados pessoais afetam a DT)."
  },
  {
    "id": "ritual-vinculo-de-sangue",
    "name": "Vínculo de Sangue",
    "element": "Sangue",
    "circle": 4,
    "execution": "padrão",
    "range": "curto",
    "target": "1 ser",
    "duration": "cena",
    "resistance": "Fortitude anula",
    "description": "Ao sofrer dano, o alvo divide metade do dano com você se falhar em Fortitude (ou efeito inverso)."
  },
  {
    "id": "ritual-vomitar-pestes",
    "name": "Vomitar Pestes",
    "element": "Sangue",
    "circle": 3,
    "execution": "padrão",
    "range": "médio",
    "target": "enxame Grande (3m)",
    "duration": "sustentada",
    "resistance": "Reflexos reduz à metade",
    "description": "Vomita enxame que causa 5d12 de Sangue em quem ocupar o espaço. Ação de movimento para mover 12m. Discente (+2 PE): agarra alvos que falharem. Verdadeiro (+5 PE): enxame Enorme (6m) com voo 18m."
  },
  {
    "id": "ritual-zerar-entropia",
    "name": "Zerar Entropia",
    "element": "Morte",
    "circle": 3,
    "execution": "padrão",
    "range": "curto",
    "target": "1 pessoa",
    "duration": "cena",
    "resistance": "Vontade parcial",
    "description": "Zera a entropia deixando o alvo paralisado (ou lento se passar). Teste de Vontade a cada turno para tentar encerrar o efeito. Discente (+4 PE): 1 ser. Verdadeiro (+11 PE): seres escolhidos."
  }
];

const orderInventoryCatalog = [
  {
    "id": "item-acha",
    "name": "Acha",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "1d12",
    "critical": "x3",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Duas Mãos. Um machado grande e pesado, usado no corte de árvores largas."
  },
  {
    "id": "item-arco",
    "name": "Arco",
    "type": "arma",
    "category": "0",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "1d6",
    "critical": "x3",
    "range": "Médio",
    "damageType": "Perfuração",
    "ammunition": "Flechas",
    "description": "Armas Simples - Arma de Disparo - Duas Mãos. Um arco e flecha comum, próprio para tiro ao alvo."
  },
  {
    "id": "item-arco-composto",
    "name": "Arco Composto",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "1d10",
    "critical": "x3",
    "range": "Médio",
    "damageType": "Perfuração",
    "ammunition": "Flechas",
    "description": "Armas Táticas - Arma de Disparo - Duas Mãos. Permite somar o valor de Força às rolagens de dano."
  },
  {
    "id": "item-balestra",
    "name": "Balestra",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "1d12",
    "critical": "19",
    "range": "Médio",
    "damageType": "Perfuração",
    "ammunition": "Flechas",
    "description": "Armas Táticas - Arma de Disparo - Duas Mãos. Exige uma ação de movimento para ser recarregada a cada disparo."
  },
  {
    "id": "item-bastao",
    "name": "Bastão",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d6/1d8",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Uma Mão. Taco, cacetete ou clava. Uma mão (1d6) ou duas mãos (1d8)."
  },
  {
    "id": "item-bazuca",
    "name": "Bazuca",
    "type": "arma",
    "category": "III",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "10d8",
    "critical": "x2",
    "range": "Médio",
    "damageType": "Impacto",
    "ammunition": "Foguete",
    "description": "Armas Pesadas - Arma de Fogo - Duas Mãos. Causa dano no alvo e em todos no raio de 3m (Reflexos DT Agi reduz à metade para os demais). Ação de movimento para recarregar."
  },
  {
    "id": "item-besta",
    "name": "Besta",
    "type": "arma",
    "category": "0",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "1d8",
    "critical": "19",
    "range": "Médio",
    "damageType": "Perfuração",
    "ammunition": "Flechas",
    "description": "Armas Simples - Arma de Disparo - Duas Mãos. Exige ação de movimento para recarregar a cada disparo."
  },
  {
    "id": "item-cajado",
    "name": "Cajado",
    "type": "arma",
    "category": "0",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "1d6/1d6",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Duas Mãos. Ágil e pode ser usado com Combater com Duas Armas."
  },
  {
    "id": "item-coronhada",
    "name": "Coronhada",
    "type": "arma",
    "category": "",
    "spaces": 0,
    "capacityBonus": 0,
    "damage": "1d4/1d6",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Leve. Golpe com arma de fogo (1d4 leve/uma mão, 1d6 duas mãos)."
  },
  {
    "id": "item-corrente",
    "name": "Corrente",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d8",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Uma Mão. Fornece +2 em testes para desarmar e derrubar."
  },
  {
    "id": "item-espada",
    "name": "Espada",
    "type": "arma",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d8/1d10",
    "critical": "19",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Uma Mão. Uma mão (1d8) ou duas mãos (1d10)."
  },
  {
    "id": "item-espingarda",
    "name": "Espingarda",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "4d6",
    "critical": "x3",
    "range": "Curto",
    "damageType": "Balístico",
    "ammunition": "Cartuchos",
    "description": "Armas Táticas - Arma de Fogo - Duas Mãos. Causa metade do dano em alcance médio ou maior."
  },
  {
    "id": "item-faca",
    "name": "Faca",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d4",
    "critical": "19",
    "range": "Curto",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Leve. Ágil e arremessável."
  },
  {
    "id": "item-florete",
    "name": "Florete",
    "type": "arma",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d6",
    "critical": "18",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Uma Mão. Arma ágil com excelente margem de ameaça."
  },
  {
    "id": "item-fuzil-de-assalto",
    "name": "Fuzil de Assalto",
    "type": "arma",
    "category": "II",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "2d10",
    "critical": "19/x3",
    "range": "Médio",
    "damageType": "Balístico",
    "ammunition": "Balas Longas",
    "description": "Armas Táticas - Arma de Fogo - Duas Mãos. Arma automática militar."
  },
  {
    "id": "item-fuzil-de-caca",
    "name": "Fuzil de Caça",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "2d8",
    "critical": "19/x3",
    "range": "Médio",
    "damageType": "Balístico",
    "ammunition": "Balas Longas",
    "description": "Armas Simples - Arma de Fogo - Duas Mãos. Popular entre atiradores esportivos e caçadores."
  },
  {
    "id": "item-fuzil-de-precisao",
    "name": "Fuzil de Precisão",
    "type": "arma",
    "category": "III",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "2d10",
    "critical": "19/x3",
    "range": "Longo",
    "damageType": "Balístico",
    "ammunition": "Balas Longas",
    "description": "Armas Táticas - Arma de Fogo - Duas Mãos. Veterano em Pontaria mirando recebe +5 na margem de ameaça."
  },
  {
    "id": "item-gadanho",
    "name": "Gadanho",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "2d4",
    "critical": "x4",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Duas Mãos. Foice de grande porte com multiplicador x4."
  },
  {
    "id": "item-katana",
    "name": "Katana",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "1d10",
    "critical": "19",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Duas Mãos. Ágil; se for veterano em Luta pode usá-la com uma mão."
  },
  {
    "id": "item-lanca",
    "name": "Lança",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d6",
    "critical": "x2",
    "range": "Curto",
    "damageType": "Perfuração",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Uma Mão. Pode ser arremessada."
  },
  {
    "id": "item-lanca-chamas",
    "name": "Lança-chamas",
    "type": "arma",
    "category": "III",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "6d6",
    "critical": "x2",
    "range": "Curto",
    "damageType": "Fogo",
    "ammunition": "Combustível",
    "description": "Armas Pesadas - Arma de Fogo - Duas Mãos. Atinge linha de 1,5m em alcance curto contra a Defesa de todos e deixa em chamas."
  },
  {
    "id": "item-maca",
    "name": "Maça",
    "type": "arma",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "2d4",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Uma Mão. Bastão com cabeça metálica pesada."
  },
  {
    "id": "item-machadinha",
    "name": "Machadinha",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d6",
    "critical": "x3",
    "range": "Curto",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Leve. Pode ser arremessada."
  },
  {
    "id": "item-machado",
    "name": "Machado",
    "type": "arma",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d8",
    "critical": "x3",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Uma Mão. Ferramenta de corte pesado."
  },
  {
    "id": "item-machete",
    "name": "Machete",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d6",
    "critical": "19",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Uma Mão. Lâmina longa tradicional."
  },
  {
    "id": "item-marreta",
    "name": "Marreta",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "3d4",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Duas Mãos. Impacto maciço para demolição."
  },
  {
    "id": "item-martelo",
    "name": "Martelo",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d6",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Leve. Ferramenta comum de impacto."
  },
  {
    "id": "item-metralhadora",
    "name": "Metralhadora",
    "type": "arma",
    "category": "II",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "2d12",
    "critical": "19/x3",
    "range": "Médio",
    "damageType": "Balístico",
    "ammunition": "Balas Longas",
    "description": "Armas Pesadas - Arma de Fogo - Duas Mãos. Exige Força 4 ou apoiar no tripé com ação de movimento (senão –5 no ataque). Automática."
  },
  {
    "id": "item-montante",
    "name": "Montante",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "2d6",
    "critical": "19",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Duas Mãos. Espada medieval de 1,5m de comprimento."
  },
  {
    "id": "item-motosserra",
    "name": "Motosserra",
    "type": "arma",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "damage": "3d6",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Corte",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Duas Mãos. Resultado 6 no dado de dano rola mais um dado. Desajeitada (–1d20 no ataque). Ligar gasta ação de movimento."
  },
  {
    "id": "item-nunchaku",
    "name": "Nunchaku",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d8",
    "critical": "x2",
    "range": "Corpo a corpo",
    "damageType": "Impacto",
    "ammunition": "",
    "description": "Armas Táticas - Corpo a Corpo - Leve. Ágil."
  },
  {
    "id": "item-pistola",
    "name": "Pistola",
    "type": "arma",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d12",
    "critical": "18",
    "range": "Curto",
    "damageType": "Balístico",
    "ammunition": "Balas Curtas",
    "description": "Armas Simples - Arma de Fogo - Leve. Arma padrão de saque rápido e fácil recarga."
  },
  {
    "id": "item-punhal",
    "name": "Punhal",
    "type": "arma",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d4",
    "critical": "x3",
    "range": "Corpo a corpo",
    "damageType": "Perfuração",
    "ammunition": "",
    "description": "Armas Simples - Corpo a Corpo - Leve. Lâmina pontiaguda ágil com crítico x3."
  },
  {
    "id": "item-revolver",
    "name": "Revólver",
    "type": "arma",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "2d6",
    "critical": "19/x3",
    "range": "Curto",
    "damageType": "Balístico",
    "ammunition": "Balas Curtas",
    "description": "Armas Simples - Arma de Fogo - Leve. Confiável e letal."
  },
  {
    "id": "item-submetralhadora",
    "name": "Submetralhadora",
    "type": "arma",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "2d6",
    "critical": "19/x3",
    "range": "Curto",
    "damageType": "Balístico",
    "ammunition": "Balas Curtas",
    "description": "Armas Táticas - Arma de Fogo - Uma Mão. Automática de uma mão."
  },
  {
    "id": "item-balas-curtas",
    "name": "Balas Curtas",
    "type": "municao",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "compatibleWeapon": "Pistola, Revólver, Submetralhadora",
    "description": "Munição básica para pistolas e revólveres. Dura duas cenas."
  },
  {
    "id": "item-balas-longas",
    "name": "Balas Longas",
    "type": "municao",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "compatibleWeapon": "Fuzis e Metralhadoras",
    "description": "Munição potente para fuzis e metralhadoras. Dura uma cena."
  },
  {
    "id": "item-cartuchos",
    "name": "Cartuchos",
    "type": "municao",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "compatibleWeapon": "Espingardas",
    "description": "Cartuchos carregados com esferas de chumbo. Dura uma cena."
  },
  {
    "id": "item-combustivel",
    "name": "Combustível",
    "type": "municao",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "compatibleWeapon": "Lança-chamas",
    "description": "Tanque de combustível para lança-chamas. Dura uma cena."
  },
  {
    "id": "item-flechas",
    "name": "Flechas",
    "type": "municao",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "compatibleWeapon": "Arcos e Bestas",
    "description": "Reaproveitáveis após combate. Dura uma missão inteira."
  },
  {
    "id": "item-foguete",
    "name": "Foguete",
    "type": "municao",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "compatibleWeapon": "Bazuca",
    "description": "Cada foguete dura um único disparo."
  },
  {
    "id": "item-escudo",
    "name": "Escudo",
    "type": "protecao",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "defense": "+2",
    "resistance": "",
    "description": "Empunhado em uma mão. Conta como proteção pesada para efeitos de proficiência."
  },
  {
    "id": "item-protecao-leve",
    "name": "Proteção Leve",
    "type": "protecao",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "defense": "+5",
    "resistance": "",
    "description": "Jaqueta de couro pesada ou colete de kevlar leve."
  },
  {
    "id": "item-protecao-pesada",
    "name": "Proteção Pesada",
    "type": "protecao",
    "category": "II",
    "spaces": 5,
    "capacityBonus": 0,
    "defense": "+10",
    "resistance": "RD balístico, corte, impacto e perfuração 2",
    "description": "Equipamento militar completo. Impõe –5 em testes com penalidade de carga."
  },
  {
    "id": "item-algemas",
    "name": "Algemas",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Algemas de aço (Acrobacia DT 30 para escapar)."
  },
  {
    "id": "item-amarras-de-elemento-",
    "name": "Amarras de (Elemento)",
    "type": "geral",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Cordas de elemento paranormal para imobilizar criaturas vulneráveis (Armadilha ou Laçar)."
  },
  {
    "id": "item-arpeu",
    "name": "Arpéu",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Gancho de aço amarrado em corda (+5 em Atletismo para subir)."
  },
  {
    "id": "item-bandoleira",
    "name": "Bandoleira",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Uma vez por rodada, saca ou guarda um item do inventário como ação livre."
  },
  {
    "id": "item-binoculos",
    "name": "Binóculos",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "+5 em testes de Percepção para observar coisas distantes."
  },
  {
    "id": "item-bloqueador-de-sinal",
    "name": "Bloqueador de Sinal",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Impede conexão de celulares e rádios em alcance médio."
  },
  {
    "id": "item-camera-de-aura-paranormal",
    "name": "Câmera de Aura Paranormal",
    "type": "geral",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Ação padrão e 1 PE: foto instantânea revela auras paranormais e seus elementos."
  },
  {
    "id": "item-cicatrizante",
    "name": "Cicatrizante",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Spray curativo: ação padrão cura 2d8+2 PV em você ou ser adjacente."
  },
  {
    "id": "item-componentes-ritualisticos-de-elemento-",
    "name": "Componentes Ritualísticos de (Elemento)",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Conjunto de objetos ritualísticos necessários para conjurar rituais de Sangue, Morte, Conhecimento ou Energia."
  },
  {
    "id": "item-corda",
    "name": "Corda",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "10 metros de corda resistente (+5 em Atletismo para escaladas e rapel)."
  },
  {
    "id": "item-emissor-de-pulsos-paranormais",
    "name": "Emissor de Pulsos Paranormais",
    "type": "geral",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Ação completa e 1 PE: atrai criaturas do mesmo elemento e afasta opostas (Vontade DT Pre evita)."
  },
  {
    "id": "item-equipamento-de-sobrevivencia",
    "name": "Equipamento de Sobrevivência",
    "type": "geral",
    "category": "0",
    "spaces": 2,
    "capacityBonus": 0,
    "description": "+5 em Sobrevivência para acampar e orientar-se e permite testes sem treinamento."
  },
  {
    "id": "item-escuta-de-ruidos-paranormais",
    "name": "Escuta de Ruídos Paranormais",
    "type": "geral",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Ação completa e 2 PE: grava ruídos por até 24h (+5 em Ocultismo para identificar criatura)."
  },
  {
    "id": "item-granada-de-atordoamento",
    "name": "Granada de Atordoamento",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Explosivo em raio de 6m: atordoa por 1 rodada (Fortitude DT Agi reduz para ofuscado e surdo)."
  },
  {
    "id": "item-granada-de-fragmentacao",
    "name": "Granada de Fragmentação",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Explosivo em raio de 6m: 8d6 perfuração (Reflexos DT Agi reduz à metade)."
  },
  {
    "id": "item-granada-de-fumaca",
    "name": "Granada de Fumaça",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Produz fumaça espessa por 2 rodadas em raio de 6m: cegos e sob camuflagem total."
  },
  {
    "id": "item-granada-incendiaria",
    "name": "Granada Incendiária",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Explosivo em raio de 6m: 6d6 fogo e ficam em chamas (Reflexos DT Agi reduz à metade e evita chamas)."
  },
  {
    "id": "item-kit-de-pericia",
    "name": "Kit de Perícia",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Ferramentas essenciais para uso de perícias específicas. Sem ele, impõe –5 no teste."
  },
  {
    "id": "item-lanterna-tatica",
    "name": "Lanterna Tática",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Ilumina e pode usar ação de movimento para ofuscar um alvo em alcance curto por 1 rodada."
  },
  {
    "id": "item-mascara-de-gas",
    "name": "Máscara de Gás",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "+10 em testes de Fortitude contra efeitos que dependam de respiração."
  },
  {
    "id": "item-medidor-de-estabilidade-da-membrana",
    "name": "Medidor de Estabilidade da Membrana",
    "type": "geral",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Dispositivo que indica a estabilidade da Membrana e risco de manifestações paranormais."
  },
  {
    "id": "item-mina-antipessoal",
    "name": "Mina Antipessoal",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Detonada por controle: cone de 6m causa 12d6 perfuração (Reflexos DT Int reduz à metade)."
  },
  {
    "id": "item-mochila-militar",
    "name": "Mochila Militar",
    "type": "geral",
    "category": "I",
    "spaces": -2,
    "capacityBonus": 2,
    "description": "Mochila ergonômica leve. Não ocupa espaço e amplia a capacidade de carga em +2 espaços."
  },
  {
    "id": "item-oculos-de-visao-termica",
    "name": "Óculos de Visão Térmica",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elimina a penalidade em testes por camuflagem."
  },
  {
    "id": "item-pe-de-cabra",
    "name": "Pé de Cabra",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "+5 em testes de Força para arrombar portas. Pode ser empunhado como um bastão."
  },
  {
    "id": "item-pistola-de-dardos",
    "name": "Pistola de Dardos",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Dispara dardos soníferos: se acertar, alvo fica inconsciente até o fim da cena (Fortitude DT Agi reduz)."
  },
  {
    "id": "item-pistola-sinalizadora",
    "name": "Pistola Sinalizadora",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Dispara sinalizador luminoso. Pode causar 2d6 de fogo em alcance curto."
  },
  {
    "id": "item-scanner-de-manifestacao-paranormal-de-elemento-",
    "name": "Scanner de Manifestação Paranormal de (Elemento)",
    "type": "geral",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Consome 1 PE/rodada: aponta direção de manifestações ativas do elemento em alcance longo."
  },
  {
    "id": "item-soqueira",
    "name": "Soqueira",
    "type": "geral",
    "category": "0",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "+1 nas rolagens de dano desarmado. Pode receber modificações e maldições de armas corpo a corpo."
  },
  {
    "id": "item-spray-de-pimenta",
    "name": "Spray de Pimenta",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Ação padrão: alvo adjacente fica cego por 1d4 rodadas (Fortitude DT Agi evita). 2 usos."
  },
  {
    "id": "item-taser",
    "name": "Taser",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Ação padrão: 1d6 eletricidade e atordoado por 1 rodada (Fortitude DT Agi evita). 2 usos."
  },
  {
    "id": "item-traje-hazmat",
    "name": "Traje Hazmat",
    "type": "geral",
    "category": "I",
    "spaces": 2,
    "capacityBonus": 0,
    "description": "+5 em testes de resistência contra efeitos ambientais e resistência a químico 10."
  },
  {
    "id": "item-utensilio",
    "name": "Utensílio",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Concede +2 em uma perícia à sua escolha (exceto Luta e Pontaria) quando empunhado."
  },
  {
    "id": "item-vestimenta",
    "name": "Vestimenta",
    "type": "geral",
    "category": "I",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Peça de vestuário que concede +2 em uma perícia (exceto Luta/Pontaria). Máximo de duas vestimentas."
  },
  {
    "id": "item-amarras-mortais",
    "name": "Amarras Mortais",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Morte. Ação padrão e 2 PE: manobra agarrar até alvo Grande em alcance curto com +10 no teste."
  },
  {
    "id": "item-aneis-do-elo-mental",
    "name": "Anéis do Elo Mental",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Conhecimento. Par de anéis vincula 2 pessoas com Ligação Telepática permanente; usam melhor teste de Vontade mas compartilham dano mental."
  },
  {
    "id": "item-arcabuz-dos-moretti",
    "name": "Arcabuz dos Moretti",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d6 rolado: 2d4 a 2d20",
    "critical": "x3",
    "range": "Curto",
    "damageType": "Balístico/Energia",
    "description": "Elemento Energia. Arma de fogo simples de 1 mão (+2 no ataque, não precisa de munição). Dano definido por 1d6: 1=2d4, 2=2d6, 3=2d8, 4=2d10, 5=2d12, 6=2d20."
  },
  {
    "id": "item-bateria-reversa",
    "name": "Bateria Reversa",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Energia. Absorve ou descarrega energia de aparelhos eletrônicos em alcance curto. Falha em Ocultismo explode causando 12d6 de Energia em 3m."
  },
  {
    "id": "item-casaco-de-lodo",
    "name": "Casaco de Lodo",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "resistance": "RD corte, impacto, Morte e perfuração 5",
    "description": "Elemento Morte. RD 5 contra corte, impacto, Morte e perfuração, mas torna-se vulnerável a dano balístico e de Energia."
  },
  {
    "id": "item-coletora",
    "name": "Coletora",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d4",
    "critical": "19",
    "description": "Elemento Morte. Apunhala alvo morrendo para armazenar 1d8 PE (até 20 PE). Impõe condições de descanso ruins."
  },
  {
    "id": "item-coracao-pulsante",
    "name": "Coração Pulsante",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Sangue. Ao sofrer dano, gasta reação para espremer o coração e reduzir o dano pela metade (Fortitude DT 15+ evita destruição)."
  },
  {
    "id": "item-coroa-de-espinhos",
    "name": "Coroa de Espinhos",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Sangue. Reação transforma dano mental em dano de Sangue, mas impede recuperação de sanidade por descanso."
  },
  {
    "id": "item-cranio-espiral",
    "name": "Crânio Espiral",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Morte. Ação livre concede uma ação padrão adicional na rodada. Falha em Vontade DT 15 envelhece 1d4 anos."
  },
  {
    "id": "item-dedo-decepado",
    "name": "Dedo Decepado",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Varia. Concede um poder paranormal à escolha. –10 em Diplomacia e risco de pesadelos ao descansar."
  },
  {
    "id": "item-faixas-da-videncia",
    "name": "Faixas da Vidência",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "defense": "+10 na esquiva",
    "description": "Elemento Morte. Cego além de alcance médio, mas dentro dele nunca fica desprevenido, +10 em testes de resistência e +10 na Defesa ao esquivar."
  },
  {
    "id": "item-frasco-de-lodo",
    "name": "Frasco de Lodo",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Morte. Em ferimento recente cura 6d8+20 PV. Em ferimento antigo rola dado: par cura 3d8+10 PV, ímpar causa 3d8+10 dano de Morte."
  },
  {
    "id": "item-frasco-de-vitalidade",
    "name": "Frasco de Vitalidade",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Sangue. Armazena até 20 pontos de vida do seu próprio sangue para beber e curar mais tarde com ação padrão."
  },
  {
    "id": "item-jaqueta-de-verissimo",
    "name": "Jaqueta de Veríssimo",
    "type": "amaldiçoado",
    "category": "IV",
    "spaces": 1,
    "capacityBonus": 0,
    "resistance": "RD dano paranormal 15",
    "description": "Elemento Medo. Resistência a dano paranormal 15. Reação e 2 PE para assumir o dano de aliado adjacente. Item único de Categoria IV."
  },
  {
    "id": "item-lanterna-reveladora",
    "name": "Lanterna Reveladora",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Conhecimento. Ativação (1 PE): luz com propriedades de Terceiro Olho por 1 cena. Criaturas de Sangue priorizam atacá-lo."
  },
  {
    "id": "item-mascara-das-pessoas-nas-sombras",
    "name": "Máscara das Pessoas nas Sombras",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "resistance": "RD Conhecimento 10",
    "description": "Elemento Conhecimento. Resistência a Conhecimento 10. Ação de movimento e 2 PE para transportar de uma sombra para outra em alcance médio."
  },
  {
    "id": "item-municao-jurada",
    "name": "Munição Jurada",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Conhecimento. Vinculada a um ser específico: +10 no ataque, dobra margem de ameaça e +6d12 dano de Conhecimento."
  },
  {
    "id": "item-peitoral-da-segunda-chance",
    "name": "Peitoral da Segunda Chance",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Energia. Ao chegar a 0 PV gasta automaticamente 5 PE para reanimar com 4d10 PV (1 em 1d10 de falha catastrófica)."
  },
  {
    "id": "item-pergaminho-da-pertinacia",
    "name": "Pergaminho da Pertinácia",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Conhecimento. Ação padrão concede 5 PE temporários até o fim da cena (falha em Ocultismo DT 15 destrói o pergaminho)."
  },
  {
    "id": "item-perola-de-sangue",
    "name": "Pérola de Sangue",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Sangue. Absorção com ação de movimento dá +5 em testes de Agi, For e Vig até o fim da cena (exige Fortitude DT 20 ao fim)."
  },
  {
    "id": "item-punhos-enraivecidos",
    "name": "Punhos Enraivecidos",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "damage": "1d8 Sangue",
    "description": "Elemento Sangue. Ataques desarmados causam 1d8 dano de Sangue. Permite ataques desarmados extras sucessivos pagando 2, 4, 6... PE."
  },
  {
    "id": "item-relogio-de-arnaldo",
    "name": "Relógio de Arnaldo",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Energia. Uma vez por rodada, gaste 1 PE para rolar novamente qualquer dado com resultado 1 (custo sobe +1 por uso no dia)."
  },
  {
    "id": "item-selos-paranormais",
    "name": "Selos Paranormais",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Varia. Sigilos gravados contendo um ritual específico. Ativação conjura sem gastar componentes. Categoria igual ao círculo do ritual."
  },
  {
    "id": "item-seringa-de-transfiguracao",
    "name": "Seringa de Transfiguração",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Sangue. Suga sangue de um alvo e injeta em outro para alterar aparência pelo ritual Distorcer Aparência por 1 dia."
  },
  {
    "id": "item-talisma-da-sorte",
    "name": "Talismã da Sorte",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Energia. Ao sofrer dano, gaste 3 PE e role 1d4: 2 ou 3 evita o dano; 4 evita mas queima; 1 sofre o dobro e queima."
  },
  {
    "id": "item-teclado-de-conexao-neural",
    "name": "Teclado de Conexão Neural",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Energia. Conexão direta neural com computadores: +10 em hackear e metade do tempo (sofre 1d6 dano mental/rodada de uso)."
  },
  {
    "id": "item-tela-do-pesadelo",
    "name": "Tela do Pesadelo",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Energia. Ativação (2 PE): próxima pessoa que tocar sofre 4d6 de dano mental e atordoamento (Vontade DT+5 evita)."
  },
  {
    "id": "item-veiculo-energizado",
    "name": "Veículo Energizado",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Energia. Não precisa de combustível. Reação e Pilotagem DT 25 permite atravessar obstáculos como energia pura por um instante."
  },
  {
    "id": "item-vislumbre-do-fim",
    "name": "Vislumbre do Fim",
    "type": "amaldiçoado",
    "category": "II",
    "spaces": 1,
    "capacityBonus": 0,
    "description": "Elemento Morte. Óculos escuros: ação de movimento revela pior resistência (Fortitude, Reflexos ou Vontade) e vulnerabilidades do alvo."
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { orderAbilitiesCatalog, orderRitualsCatalog, orderInventoryCatalog };
}
