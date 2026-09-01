CREATE TABLE IF NOT EXISTS `params_estados` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`uf` VARCHAR(2) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`excluido` INT NOT NULL DEFAULT '0',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=0
;


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