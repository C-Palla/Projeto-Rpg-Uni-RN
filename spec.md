# Especificação do produto — Mesa RPG

## 1. Visão geral

**Mesa RPG** é um site para fãs de RPG de mesa organizarem campanhas, criarem fichas, registrarem sessões e encontrarem outras pessoas para jogar. O produto atende tanto grupos privados que já se conhecem quanto mestres que queiram publicar mesas abertas a novos jogadores.

O MVP terá suporte inicial a **D&D, Tormenta e Ordem Paranormal**. A interface será feita com HTML, CSS e JavaScript. Como várias pessoas precisam acessar os mesmos grupos e mesas, persistência compartilhada, autenticação e comunicação entre usuários também serão necessárias; esses recursos podem depender de uma API e de um serviço de backend.

## 2. Problema

Grupos de RPG costumam espalhar informações entre fichas, planilhas, conversas e anotações. Isso dificulta acompanhar mudanças ocorridas durante uma sessão, lembrar o que aconteceu em encontros anteriores e manter o grupo organizado. Além disso, jogadores novos nem sempre encontram mestres e mesas compatíveis com seus horários e sistemas preferidos.

O site reúne em um só lugar:

- organização de campanhas e sessões;
- fichas de personagens e alterações feitas durante o jogo;
- histórico de acontecimentos, com registros automáticos e resumo do mestre;
- divulgação e inscrição em mesas públicas.

## 3. Público-alvo

- **Mestres:** criam e organizam campanhas, conduzem sessões e acompanham inscrições.
- **Jogadores:** criam ou escolhem personagens, acompanham sessões e procuram mesas.
- **Grupos privados:** querem manter campanha, fichas e histórico acessíveis aos participantes.
- **Pessoas buscando grupo:** querem descobrir mesas públicas por sistema, data e disponibilidade.

## 4. Objetivos e indicadores

### Objetivos do MVP

1. Permitir que um mestre crie uma campanha privada e convide jogadores.
2. Permitir criar fichas nos sistemas suportados e vinculá-las a uma campanha.
3. Registrar alterações de ficha feitas durante uma sessão e gerar uma linha do tempo consultável.
4. Permitir que o mestre finalize uma sessão com seu próprio resumo.
5. Permitir publicar mesas abertas e receber inscrições de interessados.

### Indicadores iniciais

- campanhas criadas e sessões iniciadas/finalizadas;
- fichas criadas por sistema;
- proporção de sessões finalizadas com resumo;
- mesas públicas publicadas e inscrições recebidas;
- inscrições aceitas e mesas que chegam a iniciar.

## 5. Escopo do MVP

### Incluído

- Cadastro, login e perfil básico.
- Criação de campanhas privadas com sistema, descrição e participantes.
- Convite e entrada de jogadores em uma campanha privada.
- Criação e edição de fichas para D&D, Tormenta e Ordem Paranormal.
- Início e finalização de sessão pelo mestre.
- Registro cronológico das alterações de ficha feitas dentro do site durante a sessão.
- Resumo automático da sessão a partir dos eventos registrados.
- Campo para o mestre escrever e salvar um resumo próprio.
- Lista de sessões anteriores com os dois tipos de resumo e os eventos.
- Criação, descoberta e inscrição em mesas públicas.
- Contato entre interessado e mestre por um canal definido pelo produto.
- Estados de inscrição: pendente, aceita e recusada.
- Interface responsiva para desktop e celular.

### Fora do escopo inicial

- Videochamada, áudio, mapas táticos e rolagem avançada de dados.
- Suporte a sistemas além dos três definidos.
- Importação automática de fichas de outros sites ou arquivos.
- Geração de narrativa por inteligência artificial.
- Pagamentos, assinatura e marketplace.
- Aplicativo móvel nativo.
- Edição colaborativa simultânea da mesma ficha.
- Moderação automatizada avançada.

## 6. Papéis e permissões

### Visitante

- Visualiza mesas públicas e seus detalhes não privados.
- Pode iniciar cadastro ou login.
- Não pode se inscrever sem estar autenticado.

### Jogador

- Cria e edita suas fichas.
- Acessa campanhas das quais participa.
- Altera suas fichas durante uma sessão ativa, se a campanha permitir.
- Solicita participação em mesa pública e acompanha o estado da inscrição.
- Não pode iniciar/finalizar sessões nem editar resumos do mestre.

### Mestre

- Cria e administra campanhas próprias.
- Convida ou remove participantes de campanhas privadas.
- Inicia e finaliza sessões.
- Consulta registros e resumos das sessões da campanha.
- Publica mesas abertas, define vagas e administra inscrições.
- Pode aceitar ou recusar inscrições.

## 7. Requisitos funcionais

### RF-01 — Conta e perfil

- O sistema deve permitir cadastro, login e logout.
- O perfil deve conter ao menos nome de exibição.
- Ações de criação, inscrição e participação devem exigir autenticação.

### RF-02 — Campanhas privadas

- O mestre deve poder criar uma campanha com nome, sistema, descrição opcional e visibilidade privada.
- A campanha deve ter um mestre e uma lista de participantes.
- O mestre deve poder convidar jogadores por um mecanismo definido pelo produto (por exemplo, link ou convite dentro do site).
- Apenas participantes autorizados podem consultar fichas, sessões e registros privados da campanha.

### RF-03 — Fichas de personagem

- O jogador deve poder criar uma ficha escolhendo D&D, Tormenta ou Ordem Paranormal.
- A ficha deve conter, no mínimo, nome do personagem, sistema, jogador proprietário e os campos pertinentes ao sistema.
- Cada sistema pode ter atributos e recursos diferentes; o formulário deve refletir essa diferença.
- O jogador deve poder editar e salvar sua ficha.
- A ficha pode ser vinculada a uma campanha; o vínculo não deve tornar a ficha pública por padrão.
- O sistema deve validar campos obrigatórios e valores numéricos dentro dos limites definidos para cada campo.

### RF-04 — Sessões e registro de eventos

- Somente o mestre da campanha pode iniciar ou finalizar uma sessão.
- Ao iniciar, a sessão deve receber data/hora de início e estado **Em andamento**.
- Durante uma sessão ativa, alterações de ficha feitas pelo site devem gerar registros com personagem, campo, valor anterior, valor novo, autor e horário.
- O registro automático deve incluir mudanças relevantes, como vida, mana/energia, itens e demais campos rastreados.
- O sistema não deve registrar alterações que não foram realizadas pelo próprio site.
- O mestre deve poder consultar os eventos em ordem cronológica.
- O registro automático deve ser identificado como **Resumo automático / linha do tempo**, sem ser apresentado como texto escrito pelo mestre.

### RF-05 — Resumos da sessão

- Ao finalizar uma sessão, o mestre deve poder escrever e salvar um resumo breve.
- A sessão finalizada deve exibir separadamente:
  1. **Resumo do mestre**, texto escrito pelo mestre;
  2. **Resumo automático**, compilação legível dos eventos registrados;
  3. **Linha do tempo**, lista detalhada de alterações e horários.
- O resumo automático deve indicar quando não houver eventos suficientes para produzi-lo, sem inventar acontecimentos.
- Após a finalização, a sessão não deve aceitar novos eventos. Correções posteriores devem ser registradas como edição administrativa, sem apagar silenciosamente o histórico.

### RF-06 — Mesas públicas

- O mestre deve poder publicar uma mesa com título, descrição, sistema, data e horário, fuso horário, número de vagas e requisitos opcionais.
- Uma mesa publicada deve aparecer na área de mesas públicas enquanto estiver aberta para inscrições.
- Visitantes devem poder filtrar ou localizar mesas por sistema e data.
- Usuários autenticados devem poder solicitar uma vaga.
- O mestre deve poder aceitar ou recusar cada solicitação.
- A quantidade de inscrições aceitas não deve exceder o número de vagas.
- O interessado deve poder ver o estado da própria inscrição.
- A mesa deve deixar de aceitar inscrições quando estiver cheia, encerrada ou cancelada.

### RF-07 — Comunicação

- O interessado deve ter uma forma de entrar em contato com o mestre sobre a mesa.
- A comunicação deve ocorrer sem expor endereço de e-mail ou outros dados pessoais por padrão.
- Para o MVP, pode ser usada uma conversa interna simples ou um canal equivalente definido na implementação. O canal e suas regras devem ser visíveis aos usuários.

### RF-08 — Histórico e acesso

- O mestre e os jogadores participantes devem poder consultar sessões finalizadas da campanha.
- Usuários sem acesso à campanha não devem visualizar fichas, eventos ou resumos privados.
- O sistema deve informar estados vazios, erros de salvamento e problemas de conexão de forma clara.

## 8. Regras de negócio

1. Toda campanha privada tem exatamente um mestre responsável.
2. O criador de uma campanha é seu mestre inicial.
3. Um jogador só pode alterar fichas próprias, salvo permissão explícita do mestre para correção.
4. O mestre pode consultar as fichas vinculadas à campanha; isso não implica permissão para alterar seus valores sem registro.
5. Cada sessão pertence a uma campanha e só pode ter um estado entre **Em andamento**, **Finalizada** ou **Cancelada**.
6. Uma campanha não pode ter mais de uma sessão em andamento ao mesmo tempo, a menos que uma decisão futura de produto altere essa regra.
7. Uma alteração só entra no registro da sessão quando for salva com sucesso.
8. Alterações feitas fora de uma sessão ativa podem atualizar a ficha, mas não entram no resumo automático de uma sessão.
9. Os eventos devem preservar a ordem temporal; em caso de horários iguais, o sistema deve manter uma ordem determinística.
10. Resumo automático e resumo do mestre são conteúdos distintos e nunca devem ser combinados sem identificação.
11. O resumo automático deve derivar exclusivamente dos eventos registrados pelo sistema.
12. Uma mesa pública precisa ter sistema, data/horário, mestre e número de vagas para ser publicada.
13. O mestre não pode aceitar mais inscrições do que as vagas disponíveis.
14. O mestre não pode solicitar vaga na própria mesa.
15. Informações de campanhas privadas não devem aparecer em páginas públicas, resultados de busca ou mesas públicas sem ação explícita do usuário.

## 9. Fluxos principais

### Criar campanha e iniciar sessão

1. Mestre entra na conta e cria campanha privada, selecionando o sistema.
2. Convida jogadores.
3. Jogadores criam fichas compatíveis e as vinculam à campanha.
4. Mestre inicia uma sessão.
5. Jogadores atualizam suas fichas no site; cada alteração salva gera um evento.
6. Mestre consulta a linha do tempo e finaliza a sessão.
7. Mestre escreve seu resumo; o sistema apresenta também o resumo automático.

### Encontrar uma mesa pública

1. Usuário abre a área de mesas públicas.
2. Filtra ou navega pelas mesas por sistema e data.
3. Abre os detalhes e solicita uma vaga.
4. Conversa com o mestre pelo canal disponibilizado.
5. Mestre aceita ou recusa a inscrição.
6. Ao preencher as vagas, a mesa deixa de aceitar novas solicitações.

## 10. Modelo conceitual de dados

- **Usuário:** identificador, nome de exibição, credenciais geridas com segurança e data de criação.
- **Campanha:** identificador, nome, sistema, descrição, mestre, visibilidade e participantes.
- **Personagem/Ficha:** identificador, proprietário, campanha opcional, sistema, nome e dados específicos do sistema.
- **Sessão:** identificador, campanha, estado, início, fim e resumo do mestre.
- **Evento de sessão:** sessão, personagem, autor, campo alterado, valor anterior, valor novo e horário.
- **Mesa pública:** mestre, título, sistema, descrição, data/hora com fuso, vagas e estado.
- **Inscrição:** mesa, jogador, mensagem opcional, estado e datas de solicitação/decisão.
- **Conversa/Mensagem:** participantes, mesa associada quando aplicável, conteúdo e horário, caso comunicação interna faça parte do MVP.

Os campos detalhados de ficha devem ser definidos por sistema, evitando tratar os três sistemas como se compartilhassem os mesmos atributos.

## 11. Requisitos não funcionais

- **Usabilidade:** fluxos principais devem funcionar sem exigir conhecimento técnico.
- **Responsividade:** páginas utilizáveis em telas de celular e desktop.
- **Acessibilidade:** navegação por teclado, rótulos em formulários, contraste adequado e mensagens de erro associadas aos campos.
- **Integridade:** salvar uma alteração de ficha e seu evento de auditoria deve ser consistente; o evento não pode ser perdido se a alteração for confirmada.
- **Privacidade:** aplicar controle de acesso no servidor para dados privados; ocultar elementos na interface não é controle suficiente.
- **Segurança:** senhas não devem ser armazenadas em texto puro; entradas devem ser validadas no cliente e no servidor; sessões e permissões devem ser protegidas.
- **Disponibilidade de dados:** fichas, campanhas e histórico devem persistir após logout e ser acessíveis aos participantes autorizados em outros dispositivos.
- **Compatibilidade:** suportar versões atuais dos principais navegadores modernos.
- **Transparência:** mostrar estado de salvamento e distinguir registros automáticos de conteúdo escrito por usuários.

## 12. Organização sugerida das páginas

1. **Início:** apresentação do produto, acesso a mesas públicas e cadastro/login.
2. **Painel:** campanhas do usuário, próximas sessões e inscrições.
3. **Campanha:** participantes, fichas vinculadas e sessões.
4. **Ficha:** visualização e edição conforme o sistema escolhido.
5. **Sessão ativa:** estado da sessão, fichas permitidas e eventos recentes.
6. **Histórico da sessão:** resumo do mestre, resumo automático e linha do tempo.
7. **Mesas públicas:** busca, filtros e lista de oportunidades.
8. **Detalhe da mesa:** informações, vagas, contato e solicitação de inscrição.
9. **Gestão da mesa:** publicação e administração das inscrições pelo mestre.

## 13. Critérios de aceitação do MVP

1. **Campanha privada:** dado um mestre autenticado, quando ele cria uma campanha com sistema e nome válidos, então a campanha aparece no painel e não fica acessível a usuários não participantes.
2. **Ficha:** dado um jogador autenticado, quando escolhe um dos três sistemas suportados e preenche os campos obrigatórios, então a ficha é salva com os campos próprios daquele sistema.
3. **Permissão da ficha:** quando outro usuário não autorizado tenta acessar uma ficha privada, então o sistema nega o acesso.
4. **Início de sessão:** dado o mestre da campanha, quando inicia uma sessão, então seu estado muda para **Em andamento** e o horário de início é registrado.
5. **Evento de ficha:** durante uma sessão ativa, quando um jogador salva a alteração de um campo rastreado, então é criado um evento contendo autor, personagem, campo, valores anterior e novo e horário.
6. **Sem evento fora da sessão:** quando uma alteração é salva sem sessão ativa, então a ficha é atualizada, mas nenhum evento é associado à sessão.
7. **Resumo automático:** ao finalizar uma sessão com eventos, o sistema exibe uma compilação baseada nesses eventos e permite consultar a linha do tempo.
8. **Resumo do mestre:** ao finalizar, o mestre pode salvar um texto próprio, exibido separadamente do resumo automático.
9. **Sem invenção:** ao finalizar uma sessão sem eventos, o sistema não cria acontecimentos e informa que não há dados para o resumo automático.
10. **Finalização:** após finalizada, a sessão não aceita novas alterações registradas como eventos daquela sessão.
11. **Publicação:** dado um mestre autenticado, quando publica uma mesa com os campos obrigatórios, então ela aparece na lista pública com sistema, data/horário, vagas e estado.
12. **Inscrição:** dado um usuário autenticado, quando solicita uma vaga em mesa aberta, então sua inscrição aparece como pendente para ele e para o mestre.
13. **Limite de vagas:** quando as vagas aceitas são preenchidas, então não é possível aceitar inscrições adicionais e a mesa para de aceitar novas solicitações.
14. **Privacidade pública:** dados privados de campanha e ficha não são exibidos na página de uma mesa pública.
15. **Falha de salvamento:** se o salvamento falhar, então o sistema informa a falha e não mostra a alteração como persistida.

## 14. Decisões e pontos a confirmar antes da implementação

- Definir o conteúdo exato das fichas e limites de campos para cada versão de D&D, Tormenta e Ordem Paranormal que será suportada.
- Escolher o mecanismo de convites para campanhas privadas.
- Definir se a comunicação inicial será conversa interna ou outro canal protegido.
- Definir política de cancelamento de mesas e sessões, remoção de participantes e exclusão/exportação de dados.
- Definir se o MVP terá rolagem de dados e quais campos de ficha serão registrados automaticamente.
- Escolher API, backend e armazenamento persistente compatíveis com autenticação, controle de acesso e atualização dos dados compartilhados.

## 15. Premissas

- O site registra apenas mudanças realizadas e salvas dentro dele; não observa fichas ou aplicativos externos.
- “Em tempo real” no MVP significa que alterações salvas ficam disponíveis aos participantes autorizados sem depender de anotações manuais; a estratégia técnica de atualização (por exemplo, atualização periódica ou conexão persistente) será definida na implementação.
- O resumo automático inicial é uma compilação determinística dos eventos, não uma interpretação narrativa nem geração por IA.
- Regras e campos de cada sistema devem respeitar suas respectivas fontes e ser configurados de maneira específica por sistema.
