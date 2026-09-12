-- Migration: add authentication fields to existing usuarios table
ALTER TABLE usuarios
  ADD COLUMN tipo_usuario ENUM('ADMIN','PROFESSOR','ALUNO') NOT NULL DEFAULT 'ADMIN',
  ADD COLUMN id_aluno INT NULL DEFAULT NULL,
  ADD COLUMN id_professor INT NULL DEFAULT NULL,
  ADD COLUMN atualizado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Optional indexes to speed lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_id_aluno ON usuarios (id_aluno);
CREATE INDEX IF NOT EXISTS idx_usuarios_id_professor ON usuarios (id_professor);

-- Note: do not add foreign key constraints here to avoid migration lock issues; add later if desired.
