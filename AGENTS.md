# Instruções para agentes

## Contexto do projeto

Mesa RPG é um site para organizar campanhas e sessões de RPG, criar fichas e encontrar mesas públicas. A especificação do produto está em [spec.md](./spec.md).

O MVP inclui frontend sem framework e API Node.js/Express com SQLite. Contas, campanhas, fichas, sessões, inscrições e mensagens são persistidas no servidor local. A autenticação local usa senhas com scrypt e cookies de sessão HttpOnly; não é Supabase Auth e não deve ser exposta diretamente à internet sem configuração de produção, HTTPS, backup e revisão operacional. A migração PostgreSQL/RLS futura está em `supabase/migrations/`.

## Como rodar

Requer Node.js 20 ou superior. No PowerShell, na pasta raiz do projeto, instale as dependências e inicie o servidor da aplicação:

```powershell
npm.cmd install
npm.cmd run dev
```

Abra <http://localhost:8000>. A API e o frontend são servidos pelo mesmo processo. Encerre com `Ctrl+C`. Configure variáveis locais copiando `.env.example` para `.env`; o banco SQLite padrão é criado em `data/mesa-rpg.sqlite`.

## Comandos úteis

```powershell
# Verificar sintaxe do frontend
node --check app.js

# Rodar testes de integração da API
npm.cmd test

# Conferir alterações e espaços em branco no Git
git diff --check

# Iniciar o servidor do MVP
npm.cmd run dev
```

Não há processo de build ou formatador configurado.

## Estrutura atual

- `index.html` — estrutura semântica, página inicial e contêiner das telas do protótipo.
- `styles.css` — estilos, layout responsivo e estados de foco.
- `app.js` — navegação por hash, telas e integração HTTP com a API.
- `server.js` e `server/` — processo HTTP, rotas REST, autenticação local e persistência SQLite.
- `supabase/migrations/` — esquema PostgreSQL e políticas RLS preparadas para futura integração Supabase.
- `test/` — testes de integração da API.
- `.env.example` — configuração de desenvolvimento local.
- `package.json` — comandos e dependências do servidor.
- `spec.md` — requisitos e decisões do produto.
- `AGENTS.md` — instruções para agentes que trabalharem no projeto.

## Convenções

- Use HTML semântico e mantenha os rótulos, mensagens e conteúdo da interface em português do Brasil.
- Use HTML, CSS e JavaScript nativos no frontend; mantenha dependências do backend pequenas e justificadas.
- Mantenha nomes de classes em `kebab-case` e nomes de variáveis/funções JavaScript em `camelCase`.
- Prefira funções pequenas e seletores acessíveis; associe rótulos aos campos e preserve navegação por teclado e foco visível.
- Garanta que a interface continue utilizável em telas pequenas e em navegadores modernos.
- Não inclua credenciais, tokens ou dados pessoais reais. Use dados fictícios apenas quando estiverem claramente identificados como demonstração.
- Atualize esta documentação quando mudar os comandos, dependências ou a estrutura do projeto.
- Antes de concluir alterações, valide o JavaScript com `node --check app.js` e confira o diff com `git diff --check`, quando aplicável.

## Limites e cuidados

- A autenticação local e o SQLite são para desenvolvimento/MVP de instância única. Não os trate como Supabase Auth, hospedagem compartilhada ou configuração de produção pronta.
- Preserve as verificações de autorização no servidor; esconder controles na interface não substitui autorização.
- Não exponha segredos Supabase no frontend nem use a chave `service_role` no navegador.
- Mantenha dados privados de campanha, personagens, conversas e inscrições restritos no backend e nas futuras políticas RLS.
- Não implemente regras de ficha como se D&D, Tormenta e Ordem Paranormal compartilhassem os mesmos atributos. Consulte a especificação e confirme o escopo exato do sistema/versão antes de criar regras detalhadas.
- Não invente geração narrativa automática. O requisito inicial descreve resumo derivado dos eventos realmente registrados, separado do resumo escrito pelo mestre.
- Não exponha dados privados de campanha ou personagem na área pública.
- Não adicione dependências, serviços externos, telemetria ou chamadas de rede sem necessidade e sem explicar o impacto.
- Não remova nem sobrescreva trabalho existente que não esteja relacionado à tarefa. Não execute comandos destrutivos, não apague arquivos em massa e não faça commits sem solicitação explícita.
- Se um requisito permitir interpretações com impacto importante em privacidade, permissões ou comportamento do produto, peça esclarecimento antes de tomar uma decisão irreversível.
