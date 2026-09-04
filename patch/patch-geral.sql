SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS `alunos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nome_social` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`cpf` VARCHAR(14) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rg` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`matricula` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`data_nascimento` DATE NULL DEFAULT NULL,
	`sexo` CHAR(1) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nacionalidade` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`naturalidade` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`id_estado_nascimento` INT NULL DEFAULT NULL,
	`foto` BLOB NULL DEFAULT NULL,
	`id_tipo_documento` INT NULL DEFAULT NULL,
	`numero_documento` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`orgao_expedidor` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`data_expedicao` DATE NULL DEFAULT NULL,
	`certidao_nascimento` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`numero_certidao` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`observacoes` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`id_status` INT NULL DEFAULT NULL,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_alunos_params_estados` (`id_estado_nascimento`) USING BTREE,
	INDEX `FK_alunos_params_tipos_documentos` (`id_tipo_documento`) USING BTREE,
	CONSTRAINT `FK_alunos_params_estados` FOREIGN KEY (`id_estado_nascimento`) REFERENCES `params_estados` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_alunos_params_tipos_documentos` FOREIGN KEY (`id_tipo_documento`) REFERENCES `params_tipos_documentos` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `eventos_calendario` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`titulo` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`tipo` VARCHAR(20) NOT NULL DEFAULT 'evento' COLLATE 'utf8mb4_0900_ai_ci',
	`data_inicio` DATE NOT NULL,
	`data_fim` DATE NULL DEFAULT NULL,
	`descricao` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `configuracao_notas` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`tipo` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nota_minima` DECIMAL(5,2) NOT NULL,
	`recuperacao` TINYINT(1) NOT NULL,
	`nota_recuperacao` DECIMAL(5,2) NOT NULL,
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	`nota_maxima` DECIMAL(5,2) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS params_periodos_letivos;
DROP TABLE IF EXISTS params_periodos;
DROP TABLE IF EXISTS params_turnos;
DROP TABLE IF EXISTS params_salas;
DROP TABLE IF EXISTS params_tipos_avaliacao;
DROP TABLE IF EXISTS params_anos_letivos;

CREATE TABLE IF NOT EXISTS params_anos_letivos (
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
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS params_periodos (
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
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS params_turnos (
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
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS params_salas (
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
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS params_tipos_avaliacao (
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
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `configuracoes` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nome_fantasia` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`cnpj` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`logo` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`telefone` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`whatsapp` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`email` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`site` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`ano_letivo_atual` INT NOT NULL,
	`horario_funcionamento` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`fuso_horario` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`moeda` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`cep` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rua` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`numero` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`complemento` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`bairro` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`cidade` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`idEstado` INT NULL DEFAULT NULL,
	`data_inicio` DATE NOT NULL,
	`data_fim` DATE NOT NULL,
	`tema_sistema` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `email` (`email`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `params_disciplina` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sigla` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`descricao` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`carga_horaria` INT NOT NULL,
	`idStatus` INT NOT NULL DEFAULT '1',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





CREATE TABLE IF NOT EXISTS `documentos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`idTipo` INT NULL DEFAULT NULL,
	`descricao` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`arquivo` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`data_documento` DATE NULL DEFAULT NULL,
	`data_validade` DATE NULL DEFAULT NULL,
	`idStatus` INT NULL DEFAULT '1',
	`publico` INT NULL DEFAULT NULL,
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_documentos_params_tipos_documentos` (`idTipo`) USING BTREE,
	CONSTRAINT `FK_documentos_params_tipos_documentos` FOREIGN KEY (`idTipo`) REFERENCES `params_tipos_documentos` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `params_estados` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`uf` VARCHAR(2) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `params_formacao` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`idStatus` INT NOT NULL DEFAULT '1',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




CREATE TABLE IF NOT EXISTS notificacoes (

    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'evento',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'normal',
    mensagem TEXT,
    destinatarios TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE DEFAULT NULL,
    enviar_notificacao INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS params_cargos (
    id INT AUTO_INCREMENT,
    text VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `params_periodos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`abreviacao` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`ano_letivo` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`data_inicio` DATE NULL DEFAULT NULL,
	`data_fim` DATE NULL DEFAULT NULL,
	`ordem` INT NULL DEFAULT NULL,
	`tipo` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`status` TINYINT(1) NOT NULL DEFAULT '1',
	`text` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS params_status_documentos (
    id INT AUTO_INCREMENT,
    text VARCHAR(20) NOT NULL,
    cor VARCHAR(7) NOT NULL DEFAULT '#000000',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- Tabela de papéis
CREATE TABLE IF NOT EXISTS `roles` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `permissions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Matriz que liga papéis a permissões com nível de acesso
CREATE TABLE IF NOT EXISTS `role_permissions` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`role_id` INT NOT NULL,
	`permission_id` INT NOT NULL,
	`access` ENUM('none','view','full') NOT NULL DEFAULT 'none' COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `role_perm_unique` (`role_id`, `permission_id`) USING BTREE,
	INDEX `permission_id` (`permission_id`) USING BTREE,
	CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;




-- Exemplo de povoamento inicial: administradores full
INSERT INTO role_permissions (role_id, permission_id, access)
SELECT r.id, p.id, 'full'
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Administradores'
ON DUPLICATE KEY UPDATE access = VALUES(access);

-- Professores: ver, notas e frequência full
INSERT INTO role_permissions (role_id, permission_id, access)
SELECT r.id, p.id, 'full'
FROM roles r
JOIN permissions p ON p.name IN ('Ver alunos','Notas','Frequência')
WHERE r.name = 'Professores'
ON DUPLICATE KEY UPDATE access = VALUES(access);

-- Alunos: notas e frequência como view
INSERT INTO role_permissions (role_id, permission_id, access)
SELECT r.id, p.id, 'view'
FROM roles r
JOIN permissions p ON p.name IN ('Notas','Frequência')
WHERE r.name = 'Alunos'
ON DUPLICATE KEY UPDATE access = VALUES(access);

CREATE TABLE IF NOT EXISTS professores (
    id INT AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    nome_social VARCHAR(255),
    cpf VARCHAR(20),
    data_nascimento DATE,
    sexo VARCHAR(1),
    id_disciplina INT,
    carga_horaria VARCHAR(20),
    id_status TINYINT(1) NOT NULL DEFAULT 1,
    email VARCHAR(255),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    cep VARCHAR(15),
    endereco VARCHAR(255),
    numeros VARCHAR(20),
    complemento VARCHAR(255),
    bairro VARCHAR(255),
    cidade VARCHAR(255),
    id_estado INT,
    matricula VARCHAR(50),
    registro_profissional VARCHAR(50),
    data_admissao DATE,
    formacao VARCHAR(255),
    area_formacao VARCHAR(255),
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_professores_disciplina FOREIGN KEY (id_disciplina) REFERENCES params_disciplina(id),
    CONSTRAINT fk_professores_estado FOREIGN KEY (id_estado) REFERENCES params_estados(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `params_series` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`abreviacao` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`etapa_ensino` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nivel_ensino` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`ano_serie` INT NULL DEFAULT NULL,
	`codigo` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`idTurnos` INT NULL DEFAULT NULL,
	`idade_minima` INT NULL DEFAULT NULL,
	`idade_maxima` INT NULL DEFAULT NULL,
	`carga_horaria` INT NULL DEFAULT NULL,
	`aulas_semanais` INT NULL DEFAULT NULL,
	`status` TINYINT(1) NOT NULL DEFAULT '1',
	`descricao` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_params_series_params_turnos` (`idTurnos`) USING BTREE,
	CONSTRAINT `FK_params_series_params_turnos` FOREIGN KEY (`idTurnos`) REFERENCES `params_turnos` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `sistema_aparecia` (
    id INT NOT NULL AUTO_INCREMENT,
    tema_sistema VARCHAR(20) NOT NULL,
    cor_principal VARCHAR(20) NOT NULL,
    menu_lateral VARCHAR(20) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE IF NOT EXISTS `params_status_documentos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`cor` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `params_tipos_avaliacao` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sigla` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nota_maxima` DECIMAL(5,2) NULL DEFAULT NULL,
	`status` TINYINT(1) NOT NULL DEFAULT '1',
	`text` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `params_tipos_documentos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





CREATE TABLE IF NOT EXISTS `params_turnos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`nome` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sigla` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`horario_inicio` TIME NULL DEFAULT NULL,
	`horario_final` TIME NULL DEFAULT NULL,
	`status` TINYINT(1) NOT NULL DEFAULT '1',
	`text` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`telefone` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`nome` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`email` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`idCargo` INT NULL DEFAULT NULL,
	`data_nascimento` DATE NULL DEFAULT NULL,
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`senha` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avatar` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`termos` INT NOT NULL DEFAULT '0',
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `email` (`email`) USING BTREE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS usuariosPermissoes (
    id INT NOT NULL AUTO_INCREMENT,
    text VARCHAR(20) NOT NULL,
    idCargo INT (11) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO params_estados (uf, text) VALUES
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
('TO', 'Tocantins');


INSERT INTO params_formacao (text, idStatus) VALUES
('Ensino Médio', 1),
('Técnico', 1),
('Licenciatura', 1),
('Bacharelado', 1),
('Tecnólogo', 1),
('Pós-graduação', 1),
('Especialização', 1),
('Mestrado', 1),
('Doutorado', 1),
('Pós-doutorado', 1),
('Outro', 1);


-- Inserir papéis básicos
INSERT IGNORE INTO roles (name) VALUES
('Administradores'),
('Professores'),
('Alunos'),
('Responsáveis'),
('Secretaria'),
('Coordenação');

-- Inserir permissões básicas
INSERT IGNORE INTO permissions (name) VALUES
('Ver alunos'),
('Criar alunos'),
('Notas'),
('Frequência'),
('Financeiro'),
('Configurações');
INSERT INTO params_tipos_documentos (text) VALUES
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
('Histórico Escolar'),
('Outro');

INSERT INTO params_disciplina (text, descricao, sigla, carga_horaria, idStatus) VALUES
('Língua Portuguesa', 'Componente curricular de Língua Portuguesa','LP', 200, 1),
('Matemática', 'Componente curricular de Matemática','MAT', 200, 1),
('Ciências', 'Componente curricular de Ciências da Natureza no Ensino Fundamental','CIE', 120, 1),
('História', 'Componente curricular de História','HIS', 120, 1),
('Geografia', 'Componente curricular de Geografia','GEO', 120, 1),
('Arte', 'Componente curricular de Arte','ART', 80, 1),
('Educação Física', 'Componente curricular de Educação Física','EF', 80, 1),
('Língua Inglesa', 'Componente curricular de Língua Inglesa','ING', 120, 1),
('Ensino Religioso', 'Componente curricular de Ensino Religioso','ER', 40, 1),

('Biologia', 'Componente curricular de Biologia do Ensino Médio','BIO', 120, 1),
('Física', 'Componente curricular de Física do Ensino Médio','FIS', 120, 1),
('Química', 'Componente curricular de Química do Ensino Médio','QUI', 120, 1),
('Filosofia', 'Componente curricular de Filosofia do Ensino Médio','FIL', 80, 1),
('Sociologia', 'Componente curricular de Sociologia do Ensino Médio','SOC', 80, 1),

('Língua Espanhola', 'Língua estrangeira adicional, conforme oferta da rede','ESP', 80, 1),
('Projeto de Vida', 'Componente destinado ao desenvolvimento pessoal, social e profissional','PV', 80, 1),
('Tecnologia e Inovação', 'Tecnologia, cultura digital e inovação','TI', 80, 1),
('Educação Financeira', 'Educação financeira e planejamento financeiro','EF', 40, 1),
('Robótica', 'Robótica educacional e pensamento computacional','ROB', 80, 1),
('Programação', 'Programação e pensamento computacional','PRO', 80, 1),
('Empreendedorismo', 'Empreendedorismo e desenvolvimento de projetos','EMP', 40, 1),
('Orientação de Estudos', 'Acompanhamento e desenvolvimento de estratégias de estudo','OE', 80, 1),
('Eletiva', 'Componente curricular eletivo definido pela unidade ou rede de ensino','ELE', 40, 1);