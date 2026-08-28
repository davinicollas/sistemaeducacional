# EJS

Aplica-se às views EJS.

- Seguir o padrão atual das views.
- Não assumir que uma variável existe: usar defaults quando o padrão existente exigir.
- Arrays devem ser tratados de forma segura antes de forEach/map.
- Escapar saída por padrão com <%= %>; usar <%- %> somente quando HTML confiável for necessário.
- Não inserir JSON bruto ou HTML não confiável diretamente na página.
- Manter formulários compatíveis com as rotas existentes.
- Reutilizar partials existentes.
