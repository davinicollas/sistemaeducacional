CREATE TABLE params_tipos_documentos (
    id INT AUTO_INCREMENT,
    text VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);


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