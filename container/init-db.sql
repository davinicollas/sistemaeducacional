\echo '========================================'
\echo '1 - patch-geral.sql'
\echo '========================================'
\i '/docker-entrypoint-initdb.d/patch/patch-geral.sql'

\echo '========================================'
\echo '2 - turmas.sql'
\echo '========================================'
\i '/docker-entrypoint-initdb.d/patch/turmas.sql'

\echo '========================================'
\echo '3 - turma_vinculos.sql'
\echo '========================================'
\i '/docker-entrypoint-initdb.d/patch/turma_vinculos.sql'

\echo '========================================'
\echo '4 - pg_triggers.sql'
\echo '========================================'
\i '/docker-entrypoint-initdb.d/patch/pg_triggers.sql'

\echo '========================================'
\echo '5 - create_session_table.sql'
\echo '========================================'
\i '/docker-entrypoint-initdb.d/patch/create_session_table.sql'

\echo '========================================'
\echo '6 - seed.sql'
\echo '========================================'
\i '/docker-entrypoint-initdb.d/patch/seed.sql'

\echo '========================================'
\echo 'BANCO INICIALIZADO COM SUCESSO'
\echo '========================================'