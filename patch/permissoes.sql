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
