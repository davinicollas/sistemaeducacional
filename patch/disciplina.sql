CREATE TABLE IF NOT EXISTS `params_disciplina` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`text` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sigla` VARCHAR(10) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`descricao` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`carga_horaria` INT NOT NULL,
	`idStatus` INT NOT NULL DEFAULT '1',
	`criado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP),
	`atualizado_em` TIMESTAMP NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`excluido` INT NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_0900_ai_ci'
ENGINE=InnoDB
AUTO_INCREMENT=0;




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