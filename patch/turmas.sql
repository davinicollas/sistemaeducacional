CREATE TABLE IF NOT EXISTS `turmas` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sigla` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`id_ano_letivo` INT NULL DEFAULT NULL,
	`id_serie` INT NULL DEFAULT NULL,
	`id_turno` INT NULL DEFAULT NULL,
	`id_salas` INT NULL DEFAULT NULL,
	`id_status` INT NULL DEFAULT NULL,
	`criado_em` TIMESTAMP NULL DEFAULT (now()),
	`atualizado_em` TIMESTAMP NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_params_turmas_params_turnos` (`id_turno`) USING BTREE,
	INDEX `FK_params_turmas_params_ano_letivo` (`id_ano_letivo`) USING BTREE,
	INDEX `FK_params_turmas_params_serie` (`id_serie`) USING BTREE,
	INDEX `FK_params_turmas_params_salas` (`id_salas`) USING BTREE,
	CONSTRAINT `FK_params_turmas_params_ano_letivo` FOREIGN KEY (`id_ano_letivo`) REFERENCES `params_anos_letivos` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_params_turmas_params_salas` FOREIGN KEY (`id_salas`) REFERENCES `params_salas` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_params_turmas_params_serie` FOREIGN KEY (`id_serie`) REFERENCES `params_series` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION,
	CONSTRAINT `FK_params_turmas_params_turnos` FOREIGN KEY (`id_turno`) REFERENCES `params_turnos` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
;
