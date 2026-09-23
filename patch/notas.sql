CREATE TABLE IF NOT EXISTS notas (
  id SERIAL PRIMARY KEY,
  id_aluno INT NOT NULL,
  id_turma INT NOT NULL,
  id_disciplina INT,
  id_periodo INT NOT NULL,
  id_tipo_avaliacao INT NOT NULL,
  valor NUMERIC(8,2),
  observacao TEXT,
  id_usuario_criacao INT,
  id_usuario_atualizacao INT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  excluido INT DEFAULT 0,
  CONSTRAINT fk_notas_aluno FOREIGN KEY (id_aluno) REFERENCES alunos(id),
  CONSTRAINT fk_notas_turma FOREIGN KEY (id_turma) REFERENCES turmas(id),
  CONSTRAINT fk_notas_disciplina FOREIGN KEY (id_disciplina) REFERENCES params_disciplina(id)
);

CREATE TABLE IF NOT EXISTS notas_historico (
  id SERIAL PRIMARY KEY,
  id_nota INT NOT NULL,
  id_aluno INT NOT NULL,
  id_turma INT NOT NULL,
  id_disciplina INT,
  id_periodo INT NOT NULL,
  id_tipo_avaliacao INT NOT NULL,
  valor_anterior NUMERIC(8,2),
  valor_novo NUMERIC(8,2),
  motivo TEXT,
  id_usuario INT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  excluido INT DEFAULT 0,
  CONSTRAINT fk_notas_historico_nota FOREIGN KEY (id_nota) REFERENCES notas(id),
  CONSTRAINT fk_notas_historico_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
