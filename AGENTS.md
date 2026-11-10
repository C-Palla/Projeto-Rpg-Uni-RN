# Instruções para agentes

## Contexto do projeto

Mesa RPG é um site para organizar campanhas e sessões de RPG, criar fichas e encontrar mesas públicas. A especificação do produto está em [spec.md](./spec.md).

O projeto está no início: o esqueleto atual é uma interface estática em HTML, CSS e JavaScript puro. Não há backend, autenticação, banco de dados ou persistência. Os dados exibidos na tela são apenas ilustrativos; não os apresente como dados reais nem prometa que ações estão sendo salvas.

## Como rodar

Não é necessário instalar dependências. No PowerShell, na pasta raiz do projeto, inicie um servidor estático:

```powershell
python -m http.server 8000
```

Abra <http://localhost:8000> no navegador. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

Também é possível abrir `index.html` diretamente, mas o servidor local é preferível para evitar diferenças de comportamento do navegador.

## Comandos úteis

```powershell
# Verificar sintaxe do JavaScript
node --check app.js

# Conferir alterações e espaços em branco no Git
git diff --check

# Iniciar o servidor de desenvolvimento estático
python -m http.server 8000
```

Ainda não há suíte de testes, processo de build ou formatador configurado. Não invente resultados de testes nem adicione ferramentas sem necessidade.

## Estrutura atual

- `index.html` — estrutura semântica e conteúdo inicial da página.
- `styles.css` — estilos, layout responsivo e estados de foco.
- `app.js` — interações locais da interface.
- `spec.md` — requisitos e decisões do produto.
- `AGENTS.md` — instruções para agentes que trabalharem no projeto.

## Convenções

- Use HTML semântico e mantenha os rótulos, mensagens e conteúdo da interface em português do Brasil.
- Use HTML, CSS e JavaScript nativos; não introduza frameworks ou dependências sem uma necessidade clara e compatível com a especificação.
- Mantenha nomes de classes em `kebab-case` e nomes de variáveis/funções JavaScript em `camelCase`.
- Prefira funções pequenas e seletores acessíveis; associe rótulos aos campos e preserve navegação por teclado e foco visível.
- Garanta que a interface continue utilizável em telas pequenas e em navegadores modernos.
- Não inclua credenciais, tokens ou dados pessoais reais. Use dados fictícios apenas quando estiverem claramente identificados como demonstração.
- Atualize esta documentação quando mudar os comandos, dependências ou a estrutura do projeto.
- Antes de concluir alterações, valide o JavaScript com `node --check app.js` e confira o diff com `git diff --check`, quando aplicável.

## Limites e cuidados

- Não trate as interações locais do protótipo como funcionalidades completas: campanhas, fichas, sessões, inscrições e mensagens ainda precisam de backend para autenticação, autorização e persistência compartilhada.
- Não implemente regras de ficha como se D&D, Tormenta e Ordem Paranormal compartilhassem os mesmos atributos. Consulte a especificação e confirme o escopo exato do sistema/versão antes de criar regras detalhadas.
- Não invente geração narrativa automática. O requisito inicial descreve resumo derivado dos eventos realmente registrados, separado do resumo escrito pelo mestre.
- Não exponha dados privados de campanha ou personagem na área pública.
- Não adicione dependências, serviços externos, telemetria ou chamadas de rede sem necessidade e sem explicar o impacto.
- Não remova nem sobrescreva trabalho existente que não esteja relacionado à tarefa. Não execute comandos destrutivos, não apague arquivos em massa e não faça commits sem solicitação explícita.
- Se um requisito permitir interpretações com impacto importante em privacidade, permissões ou comportamento do produto, peça esclarecimento antes de tomar uma decisão irreversível.
