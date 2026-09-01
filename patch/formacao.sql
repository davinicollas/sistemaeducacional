CREATE TABLE IF NOT EXISTS `params_formacao` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`idStatus` INT NOT NULL DEFAULT '1',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=13
;



INSERT INTO params_formacao (text, status) VALUES
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