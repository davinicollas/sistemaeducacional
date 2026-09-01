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
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=0
;
