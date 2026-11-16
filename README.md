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

Para enviar emails reais de recuperação, configure um servidor SMTP em Authentication → SMTP Settings. O remetente padrão do Supabase é limitado para testes e não é indicado para produção. Adicione `http://localhost:8000/` em Authentication → URL Configuration → Redirect URLs e, em produção, adicione também a URL HTTPS do site. A pessoa solicita um link na tela de login e escolhe a nova senha após abri-lo.

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
- Configure confirmação de email, envio de emails de recuperação de senha e demais opções de autenticação no painel do Supabase antes de publicar.
- Convites de campanha exigem que a pessoa já tenha uma conta.
- A criação de fichas de Ordem Paranormal usa um assistente em quatro etapas, calcula atributos, perícias e valores derivados para as classes básicas e permite configurar os valores de Mundano.
- A aba Combate fica na visualização da ficha e oferece rolagem de dados para todos os sistemas. Em fichas de Ordem Paranormal, somente o proprietário pode cadastrar, editar e excluir ataques; os membros autorizados da campanha podem consultá-los e testá-los. O teste mostra d20 natural, total com bônus e se atingiu a faixa crítica configurada; não decide acerto nem rola dano.
- As imagens da galeria são privadas. Uma imagem anexada a um ataque pode ser vista pelos membros autorizados da campanha onde a ficha está vinculada. Tipos de dano, atributos e perícias usam as opções existentes na ficha de Ordem; confirme a aplicação das regras com o mestre.
- O catálogo de origens inclui perícias e resumos das histórias e poderes, sem automatizar a aplicação desses efeitos; confirme as regras com o mestre. Cada personagem pode selecionar apenas uma origem. Trilhas, rituais, inventário e progressão avançada ainda precisam ser registrados conforme as regras da mesa.
- Nas fichas de Ordem Paranormal, jogadores podem alterar PV, PE e Sanidade nas próprias fichas; o mestre pode alterar os recursos de qualquer ficha da campanha. Durante uma sessão ativa, recursos alterados são salvos junto com eventos na linha do tempo.
- As sessões de campanha permanecem ativas ao navegar entre fichas. Ao abrir uma ficha pela sessão, o link de retorno leva diretamente de volta a ela. O mestre encerra cada sessão pela campanha e precisa salvar um resumo não vazio; sessões arquivadas são numeradas e seu resumo e linha do tempo ficam visíveis aos participantes.
- Somente o mestre pode selecionar e excluir em lote sessões finalizadas na campanha. A exclusão requer confirmação e apaga também os resumos e as linhas do tempo. Execute `202611150004_delete_finished_sessions_batch.sql` no Supabase depois das migrações anteriores para habilitar a operação.
- Execute também `202611150007_character_combat_gallery.sql` no Supabase para habilitar a galeria privada e suas políticas de acesso.
- As fichas de D&D e Tormenta continuam com campos demonstrativos e não implementam suas regras completas.
