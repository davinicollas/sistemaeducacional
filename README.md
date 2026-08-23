# Sistema Educacional

Sistema web de gestão escolar (alunos, professores, documentos, configurações acadêmicas, financeiro, etc.), construído com Node.js + Express, EJS (server-side rendering) e MySQL.

## Stack

- **Runtime**: Node.js 20 (Alpine, via Docker)
- **Framework**: Express 5
- **View engine**: EJS
- **Banco de dados**: MySQL 8, acesso via `mysql2/promise` (pool de conexões)
- **Sessão**: `express-session` + `express-mysql-session` (sessão persistida no MySQL)
- **Autenticação de senha**: `bcrypt`
- **Upload de arquivos**: `multer`
- **Dev**: `nodemon` (`npm run dev`)

## Como rodar

```powershell
docker compose up --build
```

- App: http://localhost:3000
- MySQL: localhost:3306 (usuário `root`, senha `root`, banco `sistema_educacional`)

Variáveis de ambiente (arquivo `.env` na raiz):

```
DB_HOST=mysql
DB_PORT=3306
DB_NAME=sistema_educacional
DB_USER=root
DB_PASSWORD=root

SESSION_NAME=sistema_educacional_session
SESSION_SECRET=<valor secreto>
```

Sem Docker (precisa de um MySQL acessível localmente):

```powershell
npm install
npm run dev
```

## Estrutura do projeto

```
src/
  app.js / server.js      # bootstrap do Express, sessão, view engine, registro de rotas
  config/                 # configurações da aplicação
  controllers/            # (reservado para lógica de controller, quando aplicável)
  middleware/auth.js       # middleware de autenticação/autorização
  model/                  # acesso a dados (queries mysql2) por domínio
  routes/                 # rotas Express por domínio
  services/               # (reservado para regras de negócio compartilhadas)
  views/                  # templates EJS (telas + partials/header,menu,footer,filtros,paginations)
database/
  mysql.js                # pool de conexão mysql2
  permissions.json         # definição de permissões do sistema
patch/                     # scripts SQL incrementais (rodar manualmente no MySQL)
public/
  css/                    # estilos por tela
  javascript/
    script.js              # scripts gerais do site
    modalHelper.js          # helper client-side compartilhado para grids com modal (ver abaixo)
  uploads/documentos/      # arquivos enviados via upload
scripts/                    # utilitários de manutenção/teste (db insert, http check, validação de CSS)
```

## Módulos / telas implementadas

| Domínio | Rota principal | View | Model | Observação |
|---|---|---|---|---|
| Login / Cadastro | `/login`, `/cadastro` | `login.ejs`, `cadastro.ejs` | `usuario.js` | |
| Dashboard | `/dashboard` | `dashboard.ejs` | — | |
| Alunos / Professores | `/alunos`, `/professores` | `alunos.ejs`, `professores.ejs` | — | páginas estáticas (sem grid dinâmica ainda) |
| Financeiro | `/financeiro` | `financeiro.ejs` | — | |
| Aparência | `/aparencia` | `aparencia.ejs` | `aparencia.js` | |
| Calendário | `/calendario` | `calendario.ejs` | `calendario.js` | |
| Configurações (gerais) | `/configuracoes` | `configuracoes.ejs` | `configuracoes.js` | |
| Configuração de notas | `/configuracao-notas` | `configuracao_notas.ejs` | `configuracao_notas.js` | |
| Documentos | `/documentos` | `documentos.ejs` | `documentos.js` | upload via multer |
| Tipos/Status de documentos | `/tipos-documentos`, `/status-documentos` | `tiposDocumentos.ejs`, `statusDocumentos.ejs` | `tiposDocumentos.js`, `statusDocumentos.js` | |
| Estados | `/estados` | `estados.ejs` | `estados.js` | |
| Notificações | `/notificacoes` | `notificacoes.ejs` | `notificacoes.js` | |
| Permissões de usuário | `/usuario-permissoes` | `usuariosPermissoes.ejs` | `usuarioPermissoes.js` | |
| Séries | `/series` | `series.ejs` | `series.js` | grid + modal (padrão de referência) |
| **Anos Letivos** | `/anos-letivos` | `anosLetivos.ejs` | `anosLetivos.js` | grid + modal, campo "atual" |
| **Períodos/Bimestres** | `/periodos` | `periodos.ejs` | `periodos.js` | grid + modal, vinculado a Ano Letivo |
| **Turnos** | `/turnos` | `turnos.ejs` | `turnos.js` | grid + modal |
| **Salas** | `/salas` | `salas.ejs` | `salas.js` | grid + modal |
| **Tipos de Avaliação** | `/tipos-avaliacao` | `tiposAvaliacao.ejs` | `tiposAvaliacao.js` | grid + modal |

Os cinco últimos itens (Configurações Acadêmicas) foram os últimos módulos adicionados e seguem o padrão grid + modal descrito abaixo.

## Padrão de tela "grid + modal" (Configurações Acadêmicas)

Cada tela desse grupo segue a mesma estrutura:

- **Tabela** com uma linha por registro (`data-index`) e uma célula oculta (`.hidden-values`) contendo `<input type="hidden" data-field="...">` para cada coluna — usados para reidratar o modal e reenviar o formulário completo no submit.
- **Modal** criado dinamicamente via JS (`getOrCreateXModal()`), controlado por `public/javascript/modalHelper.js` (`window.ModalHelper`), que centraliza:
  - abrir modal para novo registro ou edição (`ModalHelper.openModal`);
  - aplicar valores na grid, criando ou atualizando a linha (`ModalHelper.applyValuesToRow`);
  - reindexar `name`/`data-index` após inclusão/remoção de linhas (`ModalHelper.reindex`);
  - remover linha (`ModalHelper.removeRow`) e excluir via POST (`ModalHelper.submitDelete`).
- CSS do modal é genérico: qualquer elemento com `id` terminado em `-modal` recebe o estilo de overlay/painel (`public/css/configuracoes.css`), então novas telas não precisam adicionar CSS de modal.
- **Convenção de nomes**: no banco as colunas usam `snake_case` (ex.: `ano_letivo`, `horario_inicio`, `nota_maxima`); no lado cliente (ids de input, `name` dos campos, chaves dos objetos JS) usa-se `camelCase` (ex.: `anoLetivo`, `horarioInicio`, `notaMaxima`) — a rota faz a ponte entre os dois. O campo de descrição livre é sempre chamado de `text` (não `descricao`).
- Exclusão lógica: todas as tabelas de parâmetros usam `excluido` (soft delete) em vez de `DELETE`.

## Banco de dados / patches

Os scripts SQL ficam em `patch/*.sql` e devem ser aplicados manualmente no MySQL (não há migração automática). O patch mais recente, `patch/configuracaoAcademicas.sql`, cria as tabelas `params_anos_letivos`, `params_periodos`, `params_turnos`, `params_salas` e `params_tipos_avaliacao` com o schema atual (inclui `DROP TABLE IF EXISTS` das versões antigas/incompatíveis dessas tabelas — confira se não há dados importantes antes de rodar).

Exemplo de aplicação via Docker:

```powershell
docker compose exec mysql mysql -uroot -proot sistema_educacional < patch/configuracaoAcademicas.sql
```

## Scripts utilitários

- `scripts/db_test_insert.js` — teste manual de insert no banco.
- `scripts/http_post_check.js` — teste manual de requisições POST.
- `scripts/validate_css_classes.js` — valida uso de classes CSS nas views.

## Convenções do projeto

Consulte `.github/instructions/` para as regras detalhadas de backend, banco de dados, EJS e frontend usadas neste repositório.
