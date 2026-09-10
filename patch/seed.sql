-- ============================================================
-- Sistema Educacional - Seed de dados para desenvolvimento
-- Compatível com MySQL 8+
-- Baseado nas tabelas existentes em patch-geral.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- ------------------------------------------------------------
-- 1. ESTADOS
-- ------------------------------------------------------------
INSERT INTO params_estados (uf, text)
SELECT x.uf, x.nome
FROM (
    SELECT 'AC' AS uf, 'Acre' AS nome UNION ALL
    SELECT 'AL', 'Alagoas' UNION ALL
    SELECT 'AP', 'Amapá' UNION ALL
    SELECT 'AM', 'Amazonas' UNION ALL
    SELECT 'BA', 'Bahia' UNION ALL
    SELECT 'CE', 'Ceará' UNION ALL
    SELECT 'DF', 'Distrito Federal' UNION ALL
    SELECT 'ES', 'Espírito Santo' UNION ALL
    SELECT 'GO', 'Goiás' UNION ALL
    SELECT 'MA', 'Maranhão' UNION ALL
    SELECT 'MT', 'Mato Grosso' UNION ALL
    SELECT 'MS', 'Mato Grosso do Sul' UNION ALL
    SELECT 'MG', 'Minas Gerais' UNION ALL
    SELECT 'PA', 'Pará' UNION ALL
    SELECT 'PB', 'Paraíba' UNION ALL
    SELECT 'PR', 'Paraná' UNION ALL
    SELECT 'PE', 'Pernambuco' UNION ALL
    SELECT 'PI', 'Piauí' UNION ALL
    SELECT 'RJ', 'Rio de Janeiro' UNION ALL
    SELECT 'RN', 'Rio Grande do Norte' UNION ALL
    SELECT 'RS', 'Rio Grande do Sul' UNION ALL
    SELECT 'RO', 'Rondônia' UNION ALL
    SELECT 'RR', 'Roraima' UNION ALL
    SELECT 'SC', 'Santa Catarina' UNION ALL
    SELECT 'SP', 'São Paulo' UNION ALL
    SELECT 'SE', 'Sergipe' UNION ALL
    SELECT 'TO', 'Tocantins'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_estados e WHERE e.uf = x.uf
);

-- ------------------------------------------------------------
-- 2. FORMAÇÕES
-- ------------------------------------------------------------
INSERT INTO params_formacao (text, idStatus)
SELECT x.texto, 1
FROM (
    SELECT 'Ensino Médio' AS texto UNION ALL
    SELECT 'Técnico' UNION ALL
    SELECT 'Licenciatura' UNION ALL
    SELECT 'Bacharelado' UNION ALL
    SELECT 'Tecnólogo' UNION ALL
    SELECT 'Pós-graduação' UNION ALL
    SELECT 'Especialização' UNION ALL
    SELECT 'Mestrado' UNION ALL
    SELECT 'Doutorado' UNION ALL
    SELECT 'Pós-doutorado' UNION ALL
    SELECT 'Outro'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_formacao f WHERE f.text = x.texto
);

-- ------------------------------------------------------------
-- 3. TIPOS DE DOCUMENTOS
-- ------------------------------------------------------------
INSERT INTO params_tipos_documentos (text)
SELECT x.texto
FROM (
    SELECT 'Regimento escolar' AS texto UNION ALL
    SELECT 'Projeto político-pedagógico' UNION ALL
    SELECT 'Calendário escolar' UNION ALL
    SELECT 'Plano de ensino' UNION ALL
    SELECT 'Plano de aula' UNION ALL
    SELECT 'Ata' UNION ALL
    SELECT 'Declaração' UNION ALL
    SELECT 'Histórico escolar' UNION ALL
    SELECT 'Boletim' UNION ALL
    SELECT 'Ficha de matrícula' UNION ALL
    SELECT 'Contrato' UNION ALL
    SELECT 'Comunicado' UNION ALL
    SELECT 'Ofício' UNION ALL
    SELECT 'Circular' UNION ALL
    SELECT 'Outro'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_tipos_documentos d WHERE d.text = x.texto
);

-- ------------------------------------------------------------
-- 4. TURNOS
-- ------------------------------------------------------------
INSERT INTO params_turnos (nome, sigla, horario_inicio, horario_final, status, text)
SELECT x.nome, x.sigla, x.inicio, x.fim, 1, 'Seed de desenvolvimento'
FROM (
    SELECT 'Manhã' AS nome, 'MAN' AS sigla, '07:00:00' AS inicio, '12:00:00' AS fim UNION ALL
    SELECT 'Tarde', 'TAR', '13:00:00', '18:00:00' UNION ALL
    SELECT 'Noite', 'NOI', '18:30:00', '22:30:00'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_turnos t WHERE t.sigla = x.sigla
);

-- ------------------------------------------------------------
-- 5. ANO LETIVO
-- ------------------------------------------------------------
INSERT INTO params_anos_letivos
    (ano_letivo, data_inicio, data_fim, status, atual, text)
SELECT 2026, '2026-02-02', '2026-12-18', 1, 1, 'Ano letivo atual - seed'
WHERE NOT EXISTS (
    SELECT 1 FROM params_anos_letivos a WHERE a.ano_letivo = 2026
);

INSERT INTO params_anos_letivos
    (ano_letivo, data_inicio, data_fim, status, atual, text)
SELECT 2025, '2025-02-03', '2025-12-19', 1, 0, 'Ano letivo anterior - seed'
WHERE NOT EXISTS (
    SELECT 1 FROM params_anos_letivos a WHERE a.ano_letivo = 2025
);

-- ------------------------------------------------------------
-- 6. PERÍODOS LETIVOS
-- ------------------------------------------------------------
INSERT INTO params_periodos
    (nome, abreviacao, ano_letivo, data_inicio, data_fim, ordem, tipo, status, text)
SELECT x.nome, x.abrev, '2026', x.inicio, x.fim, x.ordem, 'Bimestre', 1, 'Seed 2026'
FROM (
    SELECT '1º Bimestre' AS nome, '1B' AS abrev, '2026-02-02' AS inicio, '2026-04-17' AS fim, 1 AS ordem UNION ALL
    SELECT '2º Bimestre', '2B', '2026-04-20', '2026-06-30', 2 UNION ALL
    SELECT '3º Bimestre', '3B', '2026-07-27', '2026-09-30', 3 UNION ALL
    SELECT '4º Bimestre', '4B', '2026-10-01', '2026-12-18', 4
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_periodos p
    WHERE p.nome = x.nome AND p.ano_letivo = '2026'
);

-- ------------------------------------------------------------
-- 7. SALAS
-- ------------------------------------------------------------
INSERT INTO params_salas
    (nome, codigo, tipo, capacidade, bloco, andar, recursos, status, text)
SELECT x.nome, x.codigo, 'Sala de aula', x.capacidade, 'A', '1', x.recursos, 1, 'Seed de desenvolvimento'
FROM (
    SELECT 'Sala 01' AS nome, 'A101' AS codigo, 30 AS capacidade, 'Projetor, quadro, ar-condicionado' AS recursos UNION ALL
    SELECT 'Sala 02', 'A102', 30, 'Projetor, quadro, ar-condicionado' UNION ALL
    SELECT 'Sala 03', 'A103', 35, 'Projetor, quadro' UNION ALL
    SELECT 'Sala 04', 'A104', 35, 'Projetor, quadro' UNION ALL
    SELECT 'Laboratório de Informática', 'LAB01', 25, 'Computadores, internet, projetor' UNION ALL
    SELECT 'Sala Multiuso', 'MULT01', 40, 'Projetor, áudio, quadro'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_salas s WHERE s.codigo = x.codigo
);

-- ------------------------------------------------------------
-- 8. TIPOS DE AVALIAÇÃO
-- ------------------------------------------------------------
INSERT INTO params_tipos_avaliacao
    (nome, sigla, nota_maxima, status, text)
SELECT x.nome, x.sigla, 10.00, 1, 'Seed de desenvolvimento'
FROM (
    SELECT 'Prova' AS nome, 'PROVA' AS sigla UNION ALL
    SELECT 'Trabalho', 'TRAB' UNION ALL
    SELECT 'Atividade', 'ATV' UNION ALL
    SELECT 'Projeto', 'PROJ' UNION ALL
    SELECT 'Recuperação', 'REC'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_tipos_avaliacao a WHERE a.sigla = x.sigla
);

-- ------------------------------------------------------------
-- 9. SÉRIES COM FAIXA ETÁRIA
-- ------------------------------------------------------------
INSERT INTO params_series
    (nome, abreviacao, etapa_ensino, nivel_ensino, ano_serie, codigo,
     idTurnos, idade_minima, idade_maxima, carga_horaria, aulas_semanais,
     status, descricao)
SELECT
    x.nome,
    x.abrev,
    'Ensino Fundamental',
    'Fundamental I',
    x.ano_serie,
    x.codigo,
    (SELECT id FROM params_turnos WHERE sigla = 'MAN' LIMIT 1),
    x.idade_minima,
    x.idade_maxima,
    800,
    25,
    1,
    CONCAT('Faixa etária esperada: ', x.idade_minima, ' a ', x.idade_maxima, ' anos')
FROM (
    SELECT '1º Ano' AS nome, '1º' AS abrev, 1 AS ano_serie, 'EF1' AS codigo, 6 AS idade_minima, 7 AS idade_maxima UNION ALL
    SELECT '2º Ano', '2º', 2, 'EF2', 7, 8 UNION ALL
    SELECT '3º Ano', '3º', 3, 'EF3', 8, 9 UNION ALL
    SELECT '4º Ano', '4º', 4, 'EF4', 9, 10 UNION ALL
    SELECT '5º Ano', '5º', 5, 'EF5', 10, 11 UNION ALL
    SELECT '6º Ano', '6º', 6, 'EF6', 11, 12 UNION ALL
    SELECT '7º Ano', '7º', 7, 'EF7', 12, 13 UNION ALL
    SELECT '8º Ano', '8º', 8, 'EF8', 13, 14 UNION ALL
    SELECT '9º Ano', '9º', 9, 'EF9', 14, 15
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_series s WHERE s.codigo = x.codigo
);

-- ------------------------------------------------------------
-- 10. DISCIPLINAS ADICIONAIS
-- ------------------------------------------------------------
INSERT INTO params_disciplina
    (text, descricao, sigla, carga_horaria, idStatus)
SELECT x.nome, x.descricao, x.sigla, x.carga, 1
FROM (
    SELECT 'Língua Portuguesa' AS nome, 'Componente curricular de Língua Portuguesa' AS descricao, 'LP' AS sigla, 200 AS carga UNION ALL
    SELECT 'Matemática', 'Componente curricular de Matemática', 'MAT', 200 UNION ALL
    SELECT 'Ciências', 'Componente curricular de Ciências', 'CIE', 120 UNION ALL
    SELECT 'História', 'Componente curricular de História', 'HIS', 120 UNION ALL
    SELECT 'Geografia', 'Componente curricular de Geografia', 'GEO', 120 UNION ALL
    SELECT 'Arte', 'Componente curricular de Arte', 'ART', 80 UNION ALL
    SELECT 'Educação Física', 'Componente curricular de Educação Física', 'EF', 80 UNION ALL
    SELECT 'Língua Inglesa', 'Componente curricular de Língua Inglesa', 'ING', 120 UNION ALL
    SELECT 'Robótica', 'Robótica educacional e pensamento computacional', 'ROB', 80 UNION ALL
    SELECT 'Programação', 'Programação e pensamento computacional', 'PRO', 80
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_disciplina d WHERE d.sigla = x.sigla
);

-- ------------------------------------------------------------
-- 11. CARGOS
-- ------------------------------------------------------------
INSERT INTO params_cargos (text)
SELECT x.nome
FROM (
    SELECT 'Administrador' AS nome UNION ALL
    SELECT 'Professor' UNION ALL
    SELECT 'Secretaria' UNION ALL
    SELECT 'Coordenação' UNION ALL
    SELECT 'Direção'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_cargos c WHERE c.text = x.nome
);

-- ------------------------------------------------------------
-- 12. STATUS DE DOCUMENTOS
-- ------------------------------------------------------------
INSERT INTO params_status_documentos (text, cor)
SELECT x.nome, x.cor
FROM (
    SELECT 'Ativo' AS nome, '#198754' AS cor UNION ALL
    SELECT 'Pendente', '#ffc107' UNION ALL
    SELECT 'Arquivado', '#6c757d'
) x
WHERE NOT EXISTS (
    SELECT 1 FROM params_status_documentos s WHERE s.text = x.nome
);

-- ------------------------------------------------------------
-- 13. PROFESSORES DE TESTE
-- ------------------------------------------------------------
-- Remove somente registros do seed anterior.
DELETE FROM professores WHERE email LIKE 'seed.professor.%@escola.local';

INSERT INTO professores
    (nome, nome_social, cpf, data_nascimento, sexo, id_disciplina,
     carga_horaria, id_status, email, telefone, celular,
     id_estado, matricula, registro_profissional, data_admissao,
     formacao, area_formacao, observacoes, excluido)
SELECT
    CONCAT('Professor Seed ', LPAD(n, 3, '0')),
    NULL,
    CONCAT('900.', LPAD(n, 3, '0'), '.', LPAD(n * 7, 3, '0'), '-00'),
    DATE_ADD('1978-01-01', INTERVAL ((n * 83) MOD 12000) DAY),
    IF(MOD(n, 2) = 0, 'F', 'M'),
    (
        SELECT id FROM params_disciplina
        WHERE sigla = ELT(((n - 1) MOD 10) + 1,
            'LP','MAT','CIE','HIS','GEO','ART','EF','ING','ROB','PRO')
        LIMIT 1
    ),
    IF(MOD(n, 3) = 0, '30', '40'),
    1,
    CONCAT('seed.professor.', LPAD(n, 3, '0'), '@escola.local'),
    CONCAT('(31) 3000-', LPAD(n, 4, '0')),
    CONCAT('(31) 99000-', LPAD(n, 5, '0')),
    (SELECT id FROM params_estados WHERE uf = 'MG' LIMIT 1),
    CONCAT('PROF-SEED-', LPAD(n, 4, '0')),
    CONCAT('REG-', LPAD(n, 6, '0')),
    '2024-01-15',
    ELT(((n - 1) MOD 5) + 1,
        'Licenciatura','Bacharelado','Especialização','Mestrado','Pós-graduação'),
    ELT(((n - 1) MOD 5) + 1,
        'Educação','Matemática','Letras','Ciências','Tecnologia'),
    'Registro criado pelo seed de desenvolvimento',
    0
FROM (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
    UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
    UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
    UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
    UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
) seed_professores;

-- ------------------------------------------------------------
-- 14. ALUNOS DE TESTE
-- ------------------------------------------------------------
-- Remove somente registros do seed anterior.
DELETE FROM alunos WHERE matricula LIKE 'ALU-SEED-%';

-- 240 alunos distribuídos por faixas etárias de 6 a 17 anos.
INSERT INTO alunos
    (nome, nome_social, cpf, rg, matricula, data_nascimento,
     sexo, nacionalidade, naturalidade, id_estado_nascimento,
     id_tipo_documento, numero_documento, orgao_expedidor,
     data_expedicao, certidao_nascimento, numero_certidao,
     observacoes, id_status, excluido)
SELECT
    CONCAT(
        ELT(((n - 1) MOD 12) + 1,
            'Ana','Beatriz','Bruno','Carlos','Daniel','Eduardo',
            'Gabriel','Julia','Lucas','Mariana','Pedro','Sofia'
        ),
        ' ',
        ELT(((n - 1) MOD 10) + 1,
            'Silva','Souza','Oliveira','Santos','Costa',
            'Pereira','Rodrigues','Almeida','Lima','Gomes'
        ),
        ' ', LPAD(n, 3, '0')
    ),
    NULL,
    CONCAT('800.', LPAD(n, 3, '0'), '.', LPAD((n * 13) MOD 1000, 3, '0'), '-00'),
    CONCAT('MG-', LPAD(10000000 + n, 8, '0')),
    CONCAT('ALU-SEED-', LPAD(n, 4, '0')),
    CASE
        WHEN MOD(n, 12) < 10 THEN DATE_SUB(DATE_SUB('2026-03-01', INTERVAL (6 + MOD(n - 1, 10)) YEAR), INTERVAL MOD(n * 17, 365) DAY)
        ELSE DATE_SUB(DATE_SUB('2026-03-01', INTERVAL (15 + MOD(n - 1, 3)) YEAR), INTERVAL MOD(n * 11, 365) DAY)
    END,
    IF(MOD(n, 2) = 0, 'F', 'M'),
    'Brasileira',
    'Belo Horizonte',
    (SELECT id FROM params_estados WHERE uf = 'MG' LIMIT 1),
    (SELECT id FROM params_tipos_documentos WHERE text = 'Ficha de matrícula' LIMIT 1),
    CONCAT('SEED-DOC-', LPAD(n, 6, '0')),
    'SSP-MG',
    '2025-01-10',
    CONCAT('CERT-SEED-', LPAD(n, 6, '0')),
    CONCAT('CERT-', LPAD(n, 8, '0')),
    CASE
        WHEN n <= 12 THEN 'Aluno criado para testar seleção por faixa etária.'
        WHEN MOD(n, 20) = 0 THEN 'Aluno de teste com idade fora da faixa da maioria das séries.'
        ELSE 'Registro criado pelo seed de desenvolvimento.'
    END,
    IF(MOD(n, 25) = 0, 0, 1),
    0
FROM (
    SELECT (d1.n + d2.n * 10 + d3.n * 100) AS n
    FROM
        (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
         UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) d1
    CROSS JOIN
        (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
         UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) d2
    CROSS JOIN
        (SELECT 0 n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
         UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) d3
    WHERE (d1.n + d2.n * 10 + d3.n * 100) BETWEEN 1 AND 240
) seed_alunos;

-- ------------------------------------------------------------
-- 15. CASOS CONTROLADOS DE TESTE DE FAIXA ETÁRIA
-- ------------------------------------------------------------
-- Estes registros facilitam testar a regra da turma.
DELETE FROM alunos WHERE matricula IN (
    'ALU-IDADE-6', 'ALU-IDADE-8', 'ALU-IDADE-12', 'ALU-IDADE-15', 'ALU-INATIVO'
);

INSERT INTO alunos
    (nome, cpf, matricula, data_nascimento, sexo, nacionalidade,
     naturalidade, id_estado_nascimento, id_tipo_documento,
     numero_documento, id_status, excluido)
VALUES
('Aluno Teste - 6 anos',  '811.000.000-01', 'ALU-IDADE-6',  '2020-05-15', 'M', 'Brasileira', 'Belo Horizonte', (SELECT id FROM params_estados WHERE uf='MG' LIMIT 1), (SELECT id FROM params_tipos_documentos WHERE text='Ficha de matrícula' LIMIT 1), 'TESTE-IDADE-6', 1, 0),
('Aluno Teste - 8 anos',  '811.000.000-02', 'ALU-IDADE-8',  '2018-05-15', 'F', 'Brasileira', 'Belo Horizonte', (SELECT id FROM params_estados WHERE uf='MG' LIMIT 1), (SELECT id FROM params_tipos_documentos WHERE text='Ficha de matrícula' LIMIT 1), 'TESTE-IDADE-8', 1, 0),
('Aluno Teste - 12 anos', '811.000.000-03', 'ALU-IDADE-12', '2014-05-15', 'M', 'Brasileira', 'Belo Horizonte', (SELECT id FROM params_estados WHERE uf='MG' LIMIT 1), (SELECT id FROM params_tipos_documentos WHERE text='Ficha de matrícula' LIMIT 1), 'TESTE-IDADE-12', 1, 0),
('Aluno Teste - 15 anos', '811.000.000-04', 'ALU-IDADE-15', '2011-05-15', 'F', 'Brasileira', 'Belo Horizonte', (SELECT id FROM params_estados WHERE uf='MG' LIMIT 1), (SELECT id FROM params_tipos_documentos WHERE text='Ficha de matrícula' LIMIT 1), 'TESTE-IDADE-15', 1, 0),
('Aluno Teste - Inativo', '811.000.000-05', 'ALU-INATIVO',   '2019-05-15', 'M', 'Brasileira', 'Belo Horizonte', (SELECT id FROM params_estados WHERE uf='MG' LIMIT 1), (SELECT id FROM params_tipos_documentos WHERE text='Ficha de matrícula' LIMIT 1), 'TESTE-INATIVO', 0, 0);

-- ------------------------------------------------------------
-- 16. EVENTOS DE CALENDÁRIO
-- ------------------------------------------------------------
INSERT INTO eventos_calendario
    (titulo, tipo, data_inicio, data_fim, descricao, excluido)
VALUES
('Início do ano letivo', 'evento', '2026-02-02', '2026-02-02', 'Início das aulas.', 0),
('Reunião de pais', 'reuniao', '2026-03-14', '2026-03-14', 'Reunião com responsáveis.', 0),
('Avaliação bimestral', 'avaliacao', '2026-04-13', '2026-04-17', 'Período de avaliações do 1º bimestre.', 0),
('Recesso escolar', 'recesso', '2026-07-13', '2026-07-24', 'Recesso do meio do ano.', 0),
('Feriado', 'feriado', '2026-09-07', '2026-09-07', 'Feriado nacional.', 0);

-- ------------------------------------------------------------
-- 17. CONFIGURAÇÃO DE NOTAS
-- ------------------------------------------------------------
INSERT INTO configuracao_notas
    (tipo, nota_minima, recuperacao, nota_recuperacao, nota_maxima, excluido)
SELECT 'bimestral', 6.00, 1, 6.00, 10.00, 0
WHERE NOT EXISTS (
    SELECT 1 FROM configuracao_notas WHERE tipo = 'bimestral' AND excluido = 0
);

-- ------------------------------------------------------------
-- 18. CONFIGURAÇÃO DA APARÊNCIA
-- ------------------------------------------------------------
INSERT INTO sistema_aparecia
    (tema_sistema, cor_principal, menu_lateral, excluido)
SELECT 'claro', '#6f42c1', 'expandido', 0
WHERE NOT EXISTS (
    SELECT 1 FROM sistema_aparecia WHERE excluido = 0
);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- OBSERVAÇÃO
-- ============================================================
-- O patch-geral.sql analisado não possui a tabela 'turmas' nem
-- tabelas de relacionamento aluno/turma e professor/turma.
-- Por isso este seed não inventa essas estruturas.
-- Quando elas forem criadas, podemos adicionar ao seed:
--   - turmas
--   - matrícula aluno/turma
--   - vínculo professor/turma
--   - testes de capacidade
--   - testes de aluno já matriculado
-- ============================================================
