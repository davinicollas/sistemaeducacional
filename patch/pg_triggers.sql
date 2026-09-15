-- Função genérica para atualizar colunas atualizado_em
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para tabelas convertidas
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = current_schema() AND tablename = 'turmas') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_turmas_updated_at') THEN
      EXECUTE 'CREATE TRIGGER trg_turmas_updated_at BEFORE UPDATE ON turmas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = current_schema() AND tablename = 'turma_alunos') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_turma_alunos_updated_at') THEN
      EXECUTE 'CREATE TRIGGER trg_turma_alunos_updated_at BEFORE UPDATE ON turma_alunos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();';
    END IF;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = current_schema() AND tablename = 'turma_professores') THEN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_turma_professores_updated_at') THEN
      EXECUTE 'CREATE TRIGGER trg_turma_professores_updated_at BEFORE UPDATE ON turma_professores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();';
    END IF;
  END IF;
END$$;
