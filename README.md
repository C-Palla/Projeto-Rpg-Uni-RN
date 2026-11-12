# Mesa RPG

MVP para organizar campanhas, fichas, sessões e mesas públicas. O frontend usa HTML, CSS e JavaScript nativos; o backend é uma API Node.js/Express com SQLite para desenvolvimento local.

## Executar localmente

Requer Node.js 20 ou superior.

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run dev
```

Abra <http://localhost:8000>, crie uma conta no formulário e entre. Senhas precisam ter pelo menos 10 caracteres. O banco é criado em `data/mesa-rpg.sqlite`; mantenha esse arquivo protegido e faça backups apropriados se quiser preservar os dados locais.

Para executar os testes:

```powershell
npm.cmd test
```

## Backend

- `server.js`: inicializa o servidor e carrega `.env`.
- `server/app.js`: rotas REST, validação, autenticação por cookie HttpOnly e verificações de autorização.
- `server/db.js`: esquema e conexão SQLite.
- `test/api.test.js`: teste de integração cobrindo privacidade, eventos de sessão e vagas.
- `supabase/migrations/202611120001_initial_schema.sql`: esquema PostgreSQL/RLS de referência para migração futura.

A API e a interface são servidas na mesma origem. As senhas locais são derivadas com scrypt; tokens de sessão aleatórios são armazenados apenas como hash no banco. Configure `APP_ORIGIN` e HTTPS (`COOKIE_SECURE=true`) atrás de um proxy. A configuração padrão é apenas para desenvolvimento local.

## Preparação para Supabase

O MVP atual **não usa Supabase**: ainda não há projeto, URL ou chaves configurados. A migração em `supabase/migrations/` cria tabelas vinculadas a `auth.users`, políticas RLS e funções transacionais para eventos e decisões de inscrição. Quando o projeto Supabase estiver pronto, será necessário conectar o frontend à autenticação Supabase e trocar a persistência/adaptador do servidor; não coloque a chave `service_role` no navegador. Revise as políticas e os fluxos de convite antes de publicar.

## Limites atuais

- SQLite é para uma instância local/single-server, não para várias instâncias sem uma camada de armazenamento compartilhada.
- Cadastro e login locais não incluem verificação de email, recuperação de senha ou MFA.
- Convites de campanha exigem que a pessoa já tenha uma conta.
- Os campos de ficha são exemplos de interface; não implementam regras completas de D&D, Tormenta ou Ordem Paranormal.
