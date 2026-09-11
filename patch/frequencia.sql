CREATE TABLE IF NOT EXISTS frequencias (
    id INT NOT NULL AUTO_INCREMENT,
    id_aluno INT NOT NULL,
    id_turma INT NOT NULL,
    id_disciplina INT NULL DEFAULT NULL,
    data DATE NOT NULL,
    status ENUM('presente','falta','falta_justificada') NOT NULL,
    observacao VARCHAR(500) NULL DEFAULT NULL,
    id_disciplina_chave INT GENERATED ALWAYS AS (COALESCE(id_disciplina, 0)) STORED,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_frequencia (id_aluno, id_turma, id_disciplina_chave, data),
    KEY idx_frequencias_turma_data (id_turma, data),
    CONSTRAINT fk_frequencias_aluno FOREIGN KEY (id_aluno) REFERENCES alunos(id),
    CONSTRAINT fk_frequencias_turma FOREIGN KEY (id_turma) REFERENCES turmas(id),
    CONSTRAINT fk_frequencias_disciplina FOREIGN KEY (id_disciplina) REFERENCES params_disciplina(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS frequencias_historico (
    id INT NOT NULL AUTO_INCREMENT,
    id_frequencia INT NOT NULL,
    id_aluno INT NOT NULL,
    id_turma INT NOT NULL,
    id_disciplina INT NULL DEFAULT NULL,
    data DATE NOT NULL,
    status_anterior VARCHAR(30) NOT NULL,
    status_novo VARCHAR(30) NOT NULL,
    motivo VARCHAR(500) NOT NULL,
    id_usuario INT NULL DEFAULT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_frequencias_historico_frequencia (id_frequencia),
    CONSTRAINT fk_frequencias_historico_frequencia FOREIGN KEY (id_frequencia) REFERENCES frequencias(id),
    CONSTRAINT fk_frequencias_historico_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
