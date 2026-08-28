CREATE TABLE params_formacao (
    id INT AUTO_INCREMENT,
    text VARCHAR(255) NOT NULL,
    status INT NOT NULL DEFAULT 1,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);


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