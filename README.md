# Mesa RPG

MVP para organizar campanhas, fichas, sessões e mesas públicas. O frontend usa HTML, CSS e JavaScript nativos; o servidor Node.js/Express entrega os arquivos e a configuração pública do Supabase. Autenticação e dados do site usam Supabase Auth e PostgreSQL com RLS.

## Executar localmente

Requer Node.js 20 ou superior.

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Antes de iniciar, preencha `SUPABASE_URL` e `SUPABASE_PUBLISHABLE_KEY` no `.env`. No painel do Supabase, execute em ordem os arquivos de `supabase/migrations/` no SQL Editor. Abra <http://localhost:8000>, crie uma conta e confirme o email se a confirmação estiver habilitada no Supabase Auth.

Para executar os testes:

```powershell
npm.cmd test
```

## Backend

- `server.js`: inicializa o servidor e carrega `.env`.
- `server/app.js`: entrega o frontend e configura CSP para a conexão direta do navegador ao Supabase.
- `server/db.js`: armazenamento SQLite legado usado apenas pela API local e pelos testes.
- `test/api.test.js`: teste de integração cobrindo privacidade, eventos de sessão e vagas.
- `supabase/migrations/`: esquema PostgreSQL, políticas RLS e funções de operações transacionais usadas pelo site.

A chave publishable é pública por definição e será entregue ao navegador; nunca use `service_role` ou outra chave secreta no frontend. Dados que já existam no antigo arquivo SQLite não são migrados automaticamente para o Supabase.

## Limites atuais

- A API SQLite continua disponível para testes legados, mas o frontend usa Supabase e não sincroniza com esse banco local.
- Configure confirmação de email, recuperação de senha e demais opções de autenticação no painel do Supabase antes de publicar.
- Convites de campanha exigem que a pessoa já tenha uma conta.
- Os campos de ficha são exemplos de interface; não implementam regras completas de D&D, Tormenta ou Ordem Paranormal.
