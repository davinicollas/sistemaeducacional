CREATE TABLE `params_tipos_documentos` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=20
;



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