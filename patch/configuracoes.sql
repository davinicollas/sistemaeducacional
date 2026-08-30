CREATE TABLE `configuracoes` (
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
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=8
;
