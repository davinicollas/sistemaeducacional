-- Tabelas de parâmetros das Configurações Acadêmicas
-- Nomes de tabela e colunas alinhados com src/model e src/routes (campo padrão de descrição: `text`)
--
-- ATENÇÃO: as tabelas abaixo já existiam no banco com um esquema antigo e incompatível
-- (ex: params_periodos_letivos em vez de params_periodos, colunas `turno`/`sala`/`tipo_avaliacao`
-- em vez de `nome`/`sigla`, faltando `abreviacao`, `ordem`, `capacidade`, etc). Como estavam vazias,
-- este patch remove as tabelas antigas antes de recriá-las com o esquema correto.
-- Se já existirem dados importantes nelas, faça backup antes de rodar este patch.

DROP TABLE IF EXISTS params_periodos_letivos;
DROP TABLE IF EXISTS params_periodos;
DROP TABLE IF EXISTS params_turnos;
DROP TABLE IF EXISTS params_salas;
DROP TABLE IF EXISTS params_tipos_avaliacao;
DROP TABLE IF EXISTS params_anos_letivos;

CREATE TABLE params_anos_letivos (
    id INT NOT NULL AUTO_INCREMENT,
    ano_letivo INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status TINYINT(1) NOT NULL DEFAULT 1,
    atual TINYINT(1) NOT NULL DEFAULT 0,
    text TEXT,
    excluido INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE params_periodos (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    abreviacao VARCHAR(20),
    ano_letivo VARCHAR(20),
    data_inicio DATE,
    data_fim DATE,
    ordem INT,
    tipo VARCHAR(30),
    status TINYINT(1) NOT NULL DEFAULT 1,
    text TEXT,
    excluido INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE params_turnos (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(20),
    horario_inicio TIME,
    horario_final TIME,
    status TINYINT(1) NOT NULL DEFAULT 1,
    text TEXT,
    excluido INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE params_salas (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(20),
    tipo VARCHAR(50),
    capacidade INT,
    bloco VARCHAR(20),
    andar VARCHAR(20),
    recursos VARCHAR(255),
    status TINYINT(1) NOT NULL DEFAULT 1,
    text TEXT,
    excluido INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE params_tipos_avaliacao (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    sigla VARCHAR(20),
    nota_maxima DECIMAL(5,2),
    status TINYINT(1) NOT NULL DEFAULT 1,
    text TEXT,
    excluido INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);