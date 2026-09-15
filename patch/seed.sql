-- ============================================================
-- Sistema Educacional
-- Seed de dados para desenvolvimento
-- PostgreSQL
-- ============================================================

-- ============================================================
-- 1. ESTADOS
-- ============================================================

INSERT INTO params_estados (uf, text)
VALUES
    ('AC', 'Acre'),
    ('AL', 'Alagoas'),
    ('AP', 'Amapá'),
    ('AM', 'Amazonas'),
    ('BA', 'Bahia'),
    ('CE', 'Ceará'),
    ('DF', 'Distrito Federal'),
    ('ES', 'Espírito Santo'),
    ('GO', 'Goiás'),
    ('MA', 'Maranhão'),
    ('MT', 'Mato Grosso'),
    ('MS', 'Mato Grosso do Sul'),
    ('MG', 'Minas Gerais'),
    ('PA', 'Pará'),
    ('PB', 'Paraíba'),
    ('PR', 'Paraná'),
    ('PE', 'Pernambuco'),
    ('PI', 'Piauí'),
    ('RJ', 'Rio de Janeiro'),
    ('RN', 'Rio Grande do Norte'),
    ('RS', 'Rio Grande do Sul'),
    ('RO', 'Rondônia'),
    ('RR', 'Roraima'),
    ('SC', 'Santa Catarina'),
    ('SP', 'São Paulo'),
    ('SE', 'Sergipe'),
    ('TO', 'Tocantins')
ON CONFLICT (uf) DO NOTHING;


-- ============================================================
-- 2. FORMAÇÕES
-- ============================================================

INSERT INTO params_formacao (text, idStatus)
SELECT v.texto, 1
FROM (
    VALUES
        ('Ensino Médio'),
        ('Técnico'),
        ('Licenciatura'),
        ('Bacharelado'),
        ('Tecnólogo'),
        ('Pós-graduação'),
        ('Especialização'),
        ('Mestrado'),
        ('Doutorado'),
        ('Pós-doutorado'),
        ('Outro')
) AS v(texto)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_formacao f
    WHERE f.text = v.texto
);


-- ============================================================
-- 3. TIPOS DE DOCUMENTOS
-- ============================================================

INSERT INTO params_tipos_documentos (text)
SELECT v.texto
FROM (
    VALUES
        ('Regimento escolar'),
        ('Projeto político-pedagógico'),
        ('Calendário escolar'),
        ('Plano de ensino'),
        ('Plano de aula'),
        ('Ata'),
        ('Declaração'),
        ('Histórico escolar'),
        ('Boletim'),
        ('Ficha de matrícula'),
        ('Contrato'),
        ('Comunicado'),
        ('Ofício'),
        ('Circular'),
        ('Outro')
) AS v(texto)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_tipos_documentos d
    WHERE d.text = v.texto
);


-- ============================================================
-- 4. TURNOS
-- ============================================================

INSERT INTO params_turnos (
    nome,
    sigla,
    horario_inicio,
    horario_final,
    status,
    text
)
SELECT
    v.nome,
    v.sigla,
    v.inicio::TIME,
    v.fim::TIME,
    1,
    'Seed de desenvolvimento'
FROM (
    VALUES
        ('Manhã', 'MAN', '07:00:00', '12:00:00'),
        ('Tarde', 'TAR', '13:00:00', '18:00:00'),
        ('Noite', 'NOI', '18:30:00', '22:30:00')
) AS v(nome, sigla, inicio, fim)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_turnos t
    WHERE t.sigla = v.sigla
);


-- ============================================================
-- 5. ANOS LETIVOS
-- ============================================================

INSERT INTO params_anos_letivos (
    ano_letivo,
    data_inicio,
    data_fim,
    status,
    atual,
    text
)
SELECT
    2026,
    DATE '2026-02-02',
    DATE '2026-12-18',
    1,
    1,
    'Ano letivo atual - seed'
WHERE NOT EXISTS (
    SELECT 1
    FROM params_anos_letivos
    WHERE ano_letivo = 2026
);


INSERT INTO params_anos_letivos (
    ano_letivo,
    data_inicio,
    data_fim,
    status,
    atual,
    text
)
SELECT
    2025,
    DATE '2025-02-03',
    DATE '2025-12-19',
    1,
    0,
    'Ano letivo anterior - seed'
WHERE NOT EXISTS (
    SELECT 1
    FROM params_anos_letivos
    WHERE ano_letivo = 2025
);


-- ============================================================
-- 6. PERÍODOS LETIVOS
-- ============================================================

INSERT INTO params_periodos (
    nome,
    abreviacao,
    ano_letivo,
    data_inicio,
    data_fim,
    ordem,
    tipo,
    status,
    text
)
SELECT
    v.nome,
    v.abrev,
    '2026',
    v.inicio::DATE,
    v.fim::DATE,
    v.ordem,
    'Bimestre',
    1,
    'Seed 2026'
FROM (
    VALUES
        ('1º Bimestre', '1B', '2026-02-02', '2026-04-17', 1),
        ('2º Bimestre', '2B', '2026-04-20', '2026-06-30', 2),
        ('3º Bimestre', '3B', '2026-07-27', '2026-09-30', 3),
        ('4º Bimestre', '4B', '2026-10-01', '2026-12-18', 4)
) AS v(nome, abrev, inicio, fim, ordem)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_periodos p
    WHERE p.nome = v.nome
      AND p.ano_letivo = '2026'
);


-- ============================================================
-- 7. SALAS
-- ============================================================

INSERT INTO params_salas (
    nome,
    codigo,
    tipo,
    capacidade,
    bloco,
    andar,
    recursos,
    status,
    text
)
SELECT
    v.nome,
    v.codigo,
    'Sala de aula',
    v.capacidade,
    'A',
    '1',
    v.recursos,
    1,
    'Seed de desenvolvimento'
FROM (
    VALUES
        ('Sala 01', 'A101', 30, 'Projetor, quadro, ar-condicionado'),
        ('Sala 02', 'A102', 30, 'Projetor, quadro, ar-condicionado'),
        ('Sala 03', 'A103', 35, 'Projetor, quadro'),
        ('Sala 04', 'A104', 35, 'Projetor, quadro'),
        ('Laboratório de Informática', 'LAB01', 25, 'Computadores, internet, projetor'),
        ('Sala Multiuso', 'MULT01', 40, 'Projetor, áudio, quadro')
) AS v(nome, codigo, capacidade, recursos)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_salas s
    WHERE s.codigo = v.codigo
);


-- ============================================================
-- 8. TIPOS DE AVALIAÇÃO
-- ============================================================

INSERT INTO params_tipos_avaliacao (
    nome,
    sigla,
    nota_maxima,
    status,
    text
)
SELECT
    v.nome,
    v.sigla,
    10.00,
    1,
    'Seed de desenvolvimento'
FROM (
    VALUES
        ('Prova', 'PROVA'),
        ('Trabalho', 'TRAB'),
        ('Atividade', 'ATV'),
        ('Projeto', 'PROJ'),
        ('Recuperação', 'REC')
) AS v(nome, sigla)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_tipos_avaliacao a
    WHERE a.sigla = v.sigla
);


-- ============================================================
-- 9. SÉRIES
-- ============================================================

INSERT INTO params_series (
    nome,
    abreviacao,
    etapa_ensino,
    nivel_ensino,
    ano_serie,
    codigo,
    idTurnos,
    idade_minima,
    idade_maxima,
    carga_horaria,
    aulas_semanais,
    status,
    descricao
)
SELECT
    v.nome,
    v.abrev,
    'Ensino Fundamental',
    'Fundamental I',
    v.ano_serie,
    v.codigo,
    (
        SELECT id
        FROM params_turnos
        WHERE sigla = 'MAN'
        LIMIT 1
    ),
    v.idade_minima,
    v.idade_maxima,
    800,
    25,
    1,
    CONCAT(
        'Faixa etária esperada: ',
        v.idade_minima,
        ' a ',
        v.idade_maxima,
        ' anos'
    )
FROM (
    VALUES
        ('1º Ano', '1º', 1, 'EF1', 6, 7),
        ('2º Ano', '2º', 2, 'EF2', 7, 8),
        ('3º Ano', '3º', 3, 'EF3', 8, 9),
        ('4º Ano', '4º', 4, 'EF4', 9, 10),
        ('5º Ano', '5º', 5, 'EF5', 10, 11),
        ('6º Ano', '6º', 6, 'EF6', 11, 12),
        ('7º Ano', '7º', 7, 'EF7', 12, 13),
        ('8º Ano', '8º', 8, 'EF8', 13, 14),
        ('9º Ano', '9º', 9, 'EF9', 14, 15)
) AS v(
    nome,
    abrev,
    ano_serie,
    codigo,
    idade_minima,
    idade_maxima
)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_series s
    WHERE s.codigo = v.codigo
);


-- ============================================================
-- 10. DISCIPLINAS ADICIONAIS
-- ============================================================

INSERT INTO params_disciplina (
    text,
    descricao,
    sigla,
    carga_horaria,
    idStatus
)
SELECT
    v.nome,
    v.descricao,
    v.sigla,
    v.carga,
    1
FROM (
    VALUES
        ('Língua Portuguesa', 'Componente curricular de Língua Portuguesa', 'LP', 200),
        ('Matemática', 'Componente curricular de Matemática', 'MAT', 200),
        ('Ciências', 'Componente curricular de Ciências', 'CIE', 120),
        ('História', 'Componente curricular de História', 'HIS', 120),
        ('Geografia', 'Componente curricular de Geografia', 'GEO', 120),
        ('Arte', 'Componente curricular de Arte', 'ART', 80),
        ('Educação Física', 'Componente curricular de Educação Física', 'EF', 80),
        ('Língua Inglesa', 'Componente curricular de Língua Inglesa', 'ING', 120),
        ('Robótica', 'Robótica educacional e pensamento computacional', 'ROB', 80),
        ('Programação', 'Programação e pensamento computacional', 'PRO', 80)
) AS v(nome, descricao, sigla, carga)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_disciplina d
    WHERE d.sigla = v.sigla
);


-- ============================================================
-- 11. CARGOS
-- ============================================================

INSERT INTO params_cargos (text)
SELECT v.nome
FROM (
    VALUES
        ('Administrador'),
        ('Professor'),
        ('Secretaria'),
        ('Coordenação'),
        ('Direção')
) AS v(nome)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_cargos c
    WHERE c.text = v.nome
);


-- ============================================================
-- 12. STATUS DE DOCUMENTOS
-- ============================================================

INSERT INTO params_status_documentos (
    text,
    cor
)
SELECT
    v.nome,
    v.cor
FROM (
    VALUES
        ('Ativo', '#198754'),
        ('Pendente', '#ffc107'),
        ('Arquivado', '#6c757d')
) AS v(nome, cor)
WHERE NOT EXISTS (
    SELECT 1
    FROM params_status_documentos s
    WHERE s.text = v.nome
);


-- ============================================================
-- 13. PROFESSORES DE TESTE
-- ============================================================

DELETE FROM professores
WHERE email LIKE 'seed.professor.%@escola.local';


INSERT INTO professores (
    nome,
    nome_social,
    cpf,
    data_nascimento,
    sexo,
    id_disciplina,
    carga_horaria,
    id_status,
    email,
    telefone,
    celular,
    id_estado,
    matricula,
    registro_profissional,
    data_admissao,
    formacao,
    area_formacao,
    observacoes,
    excluido
)
SELECT
    CONCAT(
        'Professor Seed ',
        LPAD(g.n::TEXT, 3, '0')
    ),

    NULL,

    CONCAT(
        '900.',
        LPAD(g.n::TEXT, 3, '0'),
        '.',
        LPAD((g.n * 7)::TEXT, 3, '0'),
        '-00'
    ),

    (
        DATE '1978-01-01'
        + ((g.n * 83) % 12000) * INTERVAL '1 day'
    )::DATE,

    CASE
        WHEN MOD(g.n, 2) = 0 THEN 'F'
        ELSE 'M'
    END,

    (
        SELECT id
        FROM params_disciplina
        WHERE sigla = (
            ARRAY[
                'LP',
                'MAT',
                'CIE',
                'HIS',
                'GEO',
                'ART',
                'EF',
                'ING',
                'ROB',
                'PRO'
            ]
        )[MOD(g.n - 1, 10) + 1]
        LIMIT 1
    ),

    CASE
        WHEN MOD(g.n, 3) = 0 THEN '30'
        ELSE '40'
    END,

    1,

    CONCAT(
        'seed.professor.',
        LPAD(g.n::TEXT, 3, '0'),
        '@escola.local'
    ),

    CONCAT(
        '(31) 3000-',
        LPAD(g.n::TEXT, 4, '0')
    ),

    CONCAT(
        '(31) 99000-',
        LPAD(g.n::TEXT, 5, '0')
    ),

    (
        SELECT id
        FROM params_estados
        WHERE uf = 'MG'
        LIMIT 1
    ),

    CONCAT(
        'PROF-SEED-',
        LPAD(g.n::TEXT, 4, '0')
    ),

    CONCAT(
        'REG-',
        LPAD(g.n::TEXT, 6, '0')
    ),

    DATE '2024-01-15',

    (
        ARRAY[
            'Licenciatura',
            'Bacharelado',
            'Especialização',
            'Mestrado',
            'Pós-graduação'
        ]
    )[MOD(g.n - 1, 5) + 1],

    (
        ARRAY[
            'Educação',
            'Matemática',
            'Letras',
            'Ciências',
            'Tecnologia'
        ]
    )[MOD(g.n - 1, 5) + 1],

    'Registro criado pelo seed de desenvolvimento',

    0

FROM generate_series(1, 30) AS g(n);


-- ============================================================
-- 14. ALUNOS DE TESTE
-- ============================================================

DELETE FROM alunos
WHERE matricula LIKE 'ALU-SEED-%';


INSERT INTO alunos (
    nome,
    nome_social,
    cpf,
    rg,
    matricula,
    data_nascimento,
    sexo,
    nacionalidade,
    naturalidade,
    id_estado_nascimento,
    id_tipo_documento,
    numero_documento,
    orgao_expedidor,
    data_expedicao,
    certidao_nascimento,
    numero_certidao,
    observacoes,
    id_status,
    excluido
)
SELECT

    CONCAT(
        (
            ARRAY[
                'Ana',
                'Beatriz',
                'Bruno',
                'Carlos',
                'Daniel',
                'Eduardo',
                'Gabriel',
                'Julia',
                'Lucas',
                'Mariana',
                'Pedro',
                'Sofia'
            ]
        )[MOD(g.n - 1, 12) + 1],

        ' ',

        (
            ARRAY[
                'Silva',
                'Souza',
                'Oliveira',
                'Santos',
                'Costa',
                'Pereira',
                'Rodrigues',
                'Almeida',
                'Lima',
                'Gomes'
            ]
        )[MOD(g.n - 1, 10) + 1],

        ' ',

        LPAD(g.n::TEXT, 3, '0')
    ),

    NULL,

    CONCAT(
        '800.',
        LPAD(g.n::TEXT, 3, '0'),
        '.',
        LPAD(MOD(g.n * 13, 1000)::TEXT, 3, '0'),
        '-00'
    ),

    CONCAT(
        'MG-',
        LPAD((10000000 + g.n)::TEXT, 8, '0')
    ),

    CONCAT(
        'ALU-SEED-',
        LPAD(g.n::TEXT, 4, '0')
    ),

    CASE
        WHEN MOD(g.n, 12) < 10 THEN
            (
                DATE '2026-03-01'
                - (6 + MOD(g.n - 1, 10)) * INTERVAL '1 year'
                - MOD(g.n * 17, 365) * INTERVAL '1 day'
            )::DATE
        ELSE
            (
                DATE '2026-03-01'
                - (15 + MOD(g.n - 1, 3)) * INTERVAL '1 year'
                - MOD(g.n * 11, 365) * INTERVAL '1 day'
            )::DATE
    END,

    CASE
        WHEN MOD(g.n, 2) = 0 THEN 'F'
        ELSE 'M'
    END,

    'Brasileira',

    'Belo Horizonte',

    (
        SELECT id
        FROM params_estados
        WHERE uf = 'MG'
        LIMIT 1
    ),

    (
        SELECT id
        FROM params_tipos_documentos
        WHERE text = 'Ficha de matrícula'
        LIMIT 1
    ),

    CONCAT(
        'SEED-DOC-',
        LPAD(g.n::TEXT, 6, '0')
    ),

    'SSP-MG',

    DATE '2025-01-10',

    CONCAT(
        'CERT-SEED-',
        LPAD(g.n::TEXT, 6, '0')
    ),

    CONCAT(
        'CERT-',
        LPAD(g.n::TEXT, 8, '0')
    ),

    CASE
        WHEN g.n <= 12 THEN
            'Aluno criado para testar seleção por faixa etária.'
        WHEN MOD(g.n, 20) = 0 THEN
            'Aluno de teste com idade fora da faixa da maioria das séries.'
        ELSE
            'Registro criado pelo seed de desenvolvimento.'
    END,

    CASE
        WHEN MOD(g.n, 25) = 0 THEN 0
        ELSE 1
    END,

    0

FROM generate_series(1, 240) AS g(n);


-- ============================================================
-- 15. CASOS CONTROLADOS DE TESTE DE IDADE
-- ============================================================

DELETE FROM alunos
WHERE matricula IN (
    'ALU-IDADE-6',
    'ALU-IDADE-8',
    'ALU-IDADE-12',
    'ALU-IDADE-15',
    'ALU-INATIVO'
);


INSERT INTO alunos (
    nome,
    cpf,
    matricula,
    data_nascimento,
    sexo,
    nacionalidade,
    naturalidade,
    id_estado_nascimento,
    id_tipo_documento,
    numero_documento,
    id_status,
    excluido
)
VALUES

(
    'Aluno Teste - 6 anos',
    '811.000.000-01',
    'ALU-IDADE-6',
    DATE '2020-05-15',
    'M',
    'Brasileira',
    'Belo Horizonte',
    (SELECT id FROM params_estados WHERE uf = 'MG' LIMIT 1),
    (SELECT id FROM params_tipos_documentos WHERE text = 'Ficha de matrícula' LIMIT 1),
    'TESTE-IDADE-6',
    1,
    0
),

(
    'Aluno Teste - 8 anos',
    '811.000.000-02',
    'ALU-IDADE-8',
    DATE '2018-05-15',
    'F',
    'Brasileira',
    'Belo Horizonte',
    (SELECT id FROM params_estados WHERE uf = 'MG' LIMIT 1),
    (SELECT id FROM params_tipos_documentos WHERE text = 'Ficha de matrícula' LIMIT 1),
    'TESTE-IDADE-8',
    1,
    0
),

(
    'Aluno Teste - 12 anos',
    '811.000.000-03',
    'ALU-IDADE-12',
    DATE '2014-05-15',
    'M',
    'Brasileira',
    'Belo Horizonte',
    (SELECT id FROM params_estados WHERE uf = 'MG' LIMIT 1),
    (SELECT id FROM params_tipos_documentos WHERE text = 'Ficha de matrícula' LIMIT 1),
    'TESTE-IDADE-12',
    1,
    0
),

(
    'Aluno Teste - 15 anos',
    '811.000.000-04',
    'ALU-IDADE-15',
    DATE '2011-05-15',
    'F',
    'Brasileira',
    'Belo Horizonte',
    (SELECT id FROM params_estados WHERE uf = 'MG' LIMIT 1),
    (SELECT id FROM params_tipos_documentos WHERE text = 'Ficha de matrícula' LIMIT 1),
    'TESTE-IDADE-15',
    1,
    0
),

(
    'Aluno Teste - Inativo',
    '811.000.000-05',
    'ALU-INATIVO',
    DATE '2019-05-15',
    'M',
    'Brasileira',
    'Belo Horizonte',
    (SELECT id FROM params_estados WHERE uf = 'MG' LIMIT 1),
    (SELECT id FROM params_tipos_documentos WHERE text = 'Ficha de matrícula' LIMIT 1),
    'TESTE-INATIVO',
    0,
    0
);


-- ============================================================
-- 16. EVENTOS DO CALENDÁRIO
-- ============================================================

INSERT INTO eventos_calendario (
    titulo,
    tipo,
    data_inicio,
    data_fim,
    descricao,
    excluido
)
SELECT
    v.titulo,
    v.tipo,
    v.data_inicio::DATE,
    v.data_fim::DATE,
    v.descricao,
    0
FROM (
    VALUES
        (
            'Início do ano letivo',
            'evento',
            '2026-02-02',
            '2026-02-02',
            'Início das aulas.'
        ),
        (
            'Reunião de pais',
            'reuniao',
            '2026-03-14',
            '2026-03-14',
            'Reunião com responsáveis.'
        ),
        (
            'Avaliação bimestral',
            'avaliacao',
            '2026-04-13',
            '2026-04-17',
            'Período de avaliações do 1º bimestre.'
        ),
        (
            'Recesso escolar',
            'recesso',
            '2026-07-13',
            '2026-07-24',
            'Recesso do meio do ano.'
        ),
        (
            'Feriado',
            'feriado',
            '2026-09-07',
            '2026-09-07',
            'Feriado nacional.'
        )
) AS v(
    titulo,
    tipo,
    data_inicio,
    data_fim,
    descricao
)
WHERE NOT EXISTS (
    SELECT 1
    FROM eventos_calendario e
    WHERE e.titulo = v.titulo
      AND e.data_inicio = v.data_inicio::DATE
);


-- ============================================================
-- 17. CONFIGURAÇÃO DE NOTAS
-- ============================================================

INSERT INTO configuracao_notas (
    tipo,
    nota_minima,
    recuperacao,
    nota_recuperacao,
    nota_maxima,
    excluido
)
SELECT
    'bimestral',
    6.00,
    1,
    6.00,
    10.00,
    0
WHERE NOT EXISTS (
    SELECT 1
    FROM configuracao_notas
    WHERE tipo = 'bimestral'
      AND excluido = 0
);


-- ============================================================
-- 18. CONFIGURAÇÃO DA APARÊNCIA
-- ============================================================

INSERT INTO sistema_aparecia (
    tema_sistema,
    cor_principal,
    menu_lateral,
    excluido
)
SELECT
    'claro',
    '#6f42c1',
    'expandido',
    0
WHERE NOT EXISTS (
    SELECT 1
    FROM sistema_aparecia
    WHERE excluido = 0
);


-- ============================================================
-- FIM DO SEED
-- ============================================================