CREATE TABLE IF NOT EXISTS turma_alunos (
    id INT NOT NULL AUTO_INCREMENT,
    id_turma INT NOT NULL,
    id_aluno INT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_turma_aluno (id_turma, id_aluno),
    KEY idx_turma_alunos_aluno (id_aluno),
    CONSTRAINT fk_turma_alunos_turma FOREIGN KEY (id_turma) REFERENCES turmas(id),
    CONSTRAINT fk_turma_alunos_aluno FOREIGN KEY (id_aluno) REFERENCES alunos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS turma_professores (
    id INT NOT NULL AUTO_INCREMENT,
    id_turma INT NOT NULL,
    id_professor INT NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    excluido TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_turma_professor (id_turma, id_professor),
    KEY idx_turma_professores_professor (id_professor),
    CONSTRAINT fk_turma_professores_turma FOREIGN KEY (id_turma) REFERENCES turmas(id),
    CONSTRAINT fk_turma_professores_professor FOREIGN KEY (id_professor) REFERENCES professores(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;