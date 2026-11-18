# Registro de uso da IA

## O que foi pedido

- Investigar a mensagem de falha de conexão e verificar se faltava configurar o Supabase.
- Iniciar o servidor local do site.
- Orientar a conexão do projeto ao Supabase, passo a passo.
- Integrar o site ao Supabase usando conexão direta do navegador.
- Ajudar a resolver erros encontrados durante a configuração e a criação de uma campanha.
- Criar este registro do que foi pedido, aceito e rejeitado.

## O que foi aceito e realizado

- Foi identificado que a falha inicial não era causada pela falta do Supabase: o site tentava acessar a API local, e as dependências do servidor não estavam instaladas.
- As dependências foram instaladas e o servidor local foi iniciado. A API e o site responderam em `http://localhost:8000`.
- A integração escolhida foi Supabase Auth e PostgreSQL, com acesso direto pelo navegador e políticas RLS.
- O frontend foi adaptado para autenticação, leitura e gravação no Supabase. A configuração local usa a Project URL e a chave publishable.
- Foram preparadas migrações complementares para as operações necessárias à interface.
- O usuário executou as migrações no painel Supabase, configurou os dados de conexão localmente, confirmou o email e conseguiu entrar no site.
- Após corrigir a chamada de criação de campanhas e atualizar o catálogo do Supabase, o usuário confirmou que a campanha foi criada.
- A sintaxe JavaScript e os testes existentes do projeto foram verificados; os testes passaram.

## O que foi rejeitado ou evitado

- **Usar uma chave `secret` ou `service_role` no navegador:** não foi usado, pois concederia privilégios excessivos e não deve ser exposto ao público.
- **Enviar chaves, senhas, links de confirmação ou tokens pelo chat:** foi orientado que esses dados não fossem compartilhados, para proteger a conta e o projeto.
- **Tratar o Supabase como causa da falha inicial:** essa hipótese foi descartada após a inspeção do código; o projeto original usava Express e SQLite localmente.
- **Migrar automaticamente os dados do SQLite para o Supabase:** isso não foi solicitado nem implementado. Os dados antigos não são transferidos automaticamente.

## Decisões e motivos

- Foi escolhida a conexão direta do frontend ao Supabase porque o usuário preferiu essa abordagem e o projeto já continha uma migração com políticas RLS.
- Para criar campanhas, foi usada uma função PostgreSQL que obtém a identidade com `auth.uid()`. Essa abordagem mantém a validação no banco e evita depender de uma chave privilegiada no cliente.
- O link de confirmação aberto no celular apontou para `localhost`, que não é acessível como o computador do usuário a partir do celular. O usuário confirmou o email e conseguiu entrar pelo navegador do computador.
- Quando a função de criação não aparecia no catálogo do PostgREST, foi solicitado recarregar o schema. Depois da atualização, o usuário confirmou a criação da campanha.
