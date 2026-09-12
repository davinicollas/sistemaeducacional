-- Migration: migrate existing aluno/professor email+senha into usuarios table
-- WARNING: review rows without email manually after running.

START TRANSACTION;

-- 1) Insert alunos with email not yet present in usuarios
INSERT INTO usuarios (nome, email, senha, tipo_usuario, id_aluno, criado_em, atualizado_em)
SELECT a.nome, a.email, COALESCE(a.senha, ''), 'ALUNO', a.id, NOW(), NOW()
FROM alunos a
LEFT JOIN usuarios u ON u.email = a.email
WHERE a.email IS NOT NULL AND a.email <> '' AND u.id IS NULL;

-- 2) For usuarios that share email with alunos, ensure id_aluno is set
UPDATE usuarios u
JOIN alunos a ON u.email = a.email
SET u.id_aluno = a.id, u.tipo_usuario = 'ALUNO', u.atualizado_em = NOW()
WHERE a.email IS NOT NULL AND a.email <> '' AND (u.id_aluno IS NULL OR u.id_aluno = 0);

-- 3) Insert professores with email not yet present in usuarios
INSERT INTO usuarios (nome, email, senha, tipo_usuario, id_professor, criado_em, atualizado_em)
SELECT p.nome, p.email, COALESCE(p.senha, ''), 'PROFESSOR', p.id, NOW(), NOW()
FROM professores p
LEFT JOIN usuarios u ON u.email = p.email
WHERE p.email IS NOT NULL AND p.email <> '' AND u.id IS NULL;

-- 4) For usuarios that share email with professores, ensure id_professor is set
UPDATE usuarios u
JOIN professores p ON u.email = p.email
SET u.id_professor = p.id, u.tipo_usuario = 'PROFESSOR', u.atualizado_em = NOW()
WHERE p.email IS NOT NULL AND p.email <> '' AND (u.id_professor IS NULL OR u.id_professor = 0);

-- 5) Clear senha fields on original tables to avoid duplication (optional but recommended)
UPDATE alunos SET senha = NULL WHERE senha IS NOT NULL;
UPDATE professores SET senha = NULL WHERE senha IS NOT NULL;

COMMIT;

-- NOTE:
-- - Rows without email are skipped because usuarios.email is NOT NULL and UNIQUE.
--   Review those alunos/professores and set an email before creating access.
-- - The migration inserts empty strings for missing senha values (COALESCE).
--   Consider forcing password reset flows for migrated accounts.
-- - Run this migration on a maintenance window and backup DB beforehand.
