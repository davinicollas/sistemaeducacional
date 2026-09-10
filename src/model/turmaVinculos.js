const db = require("../../database/mysql");

async function getTurmaDetalhe(idTurma) {
  const [rows] = await db.query(
    `SELECT t.*, s.nome AS serie_nome, s.idade_minima, s.idade_maxima,
            a.ano_letivo, a.data_inicio AS ano_data_inicio, a.data_fim AS ano_data_fim,
            sala.nome AS sala_nome, sala.capacidade
       FROM turmas t
       LEFT JOIN params_series s ON s.id = t.id_serie
       LEFT JOIN params_anos_letivos a ON a.id = t.id_ano_letivo
       LEFT JOIN params_salas sala ON sala.id = t.id_salas
      WHERE t.id = ? AND t.excluido < 1`,
    [idTurma],
  );
  return rows[0] || null;
}

async function getAlunosDaTurma(idTurma) {
  const [rows] = await db.query(
    `SELECT a.id, a.nome, a.nome_social, a.matricula, a.data_nascimento,
            TIMESTAMPDIFF(YEAR, a.data_nascimento, COALESCE(aly.data_inicio, MAKEDATE(aly.ano_letivo, 1))) AS idade,
            a.id_status
       FROM turma_alunos ta
       JOIN alunos a ON a.id = ta.id_aluno
       JOIN turmas t ON t.id = ta.id_turma
       LEFT JOIN params_anos_letivos aly ON aly.id = t.id_ano_letivo
      WHERE ta.id_turma = ? AND ta.excluido = 0
      ORDER BY a.nome`,
    [idTurma],
  );
  return rows;
}

async function getProfessoresDaTurma(idTurma) {
  const [rows] = await db.query(
    `SELECT p.id, p.nome, p.nome_social, p.matricula, p.email, p.id_status, p.area_formacao
       FROM turma_professores tp
       JOIN professores p ON p.id = tp.id_professor
      WHERE tp.id_turma = ? AND tp.excluido = 0
      ORDER BY p.nome`,
    [idTurma],
  );
  return rows;
}

async function getAlunosElegiveis(idTurma) {
  const [rows] = await db.query(
    `SELECT a.id, a.nome, a.nome_social, a.matricula, a.data_nascimento,
            TIMESTAMPDIFF(YEAR, a.data_nascimento, COALESCE(aly.data_inicio, MAKEDATE(aly.ano_letivo, 1))) AS idade,
            a.id_status, s.idade_minima, s.idade_maxima,
            COALESCE(aly.data_inicio, MAKEDATE(aly.ano_letivo, 1)) AS data_referencia
       FROM alunos a
       JOIN turmas t ON t.id = ? AND t.excluido < 1
       JOIN params_series s ON s.id = t.id_serie AND s.excluido < 1
       LEFT JOIN params_anos_letivos aly ON aly.id = t.id_ano_letivo
      WHERE a.excluido < 1
        AND a.id_status = 1
        AND a.data_nascimento IS NOT NULL
        AND (s.idade_minima IS NULL OR TIMESTAMPDIFF(YEAR, a.data_nascimento, COALESCE(aly.data_inicio, MAKEDATE(aly.ano_letivo, 1))) >= s.idade_minima)
        AND (s.idade_maxima IS NULL OR TIMESTAMPDIFF(YEAR, a.data_nascimento, COALESCE(aly.data_inicio, MAKEDATE(aly.ano_letivo, 1))) <= s.idade_maxima)
        AND NOT EXISTS (SELECT 1 FROM turma_alunos ta WHERE ta.id_aluno = a.id AND ta.id_turma = t.id AND ta.excluido = 0)
        AND NOT EXISTS (SELECT 1 FROM turma_alunos ta JOIN turmas outra ON outra.id = ta.id_turma WHERE ta.id_aluno = a.id AND ta.excluido = 0 AND outra.excluido < 1 AND outra.id_ano_letivo = t.id_ano_letivo)
      ORDER BY a.nome`,
    [idTurma],
  );
  return rows;
}

async function getProfessoresElegiveis(idTurma) {
  const [rows] = await db.query(
    `SELECT p.id, p.nome, p.nome_social, p.matricula, p.email, p.id_status
       FROM professores p
      WHERE p.excluido < 1 AND p.id_status = 1
        AND NOT EXISTS (SELECT 1 FROM turma_professores tp WHERE tp.id_turma = ? AND tp.id_professor = p.id AND tp.excluido = 0)
      ORDER BY p.nome`,
    [idTurma],
  );
  return rows;
}

async function vincularAluno(idTurma, idAluno) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [candidatos] = await connection.query(
      `SELECT a.id
         FROM alunos a
         JOIN turmas t ON t.id = ? AND t.excluido < 1
         JOIN params_series s ON s.id = t.id_serie AND s.excluido < 1
         LEFT JOIN params_anos_letivos aly ON aly.id = t.id_ano_letivo
        WHERE a.id = ? AND a.excluido < 1 AND a.id_status = 1 AND a.data_nascimento IS NOT NULL
          AND (s.idade_minima IS NULL OR TIMESTAMPDIFF(YEAR, a.data_nascimento, COALESCE(aly.data_inicio, MAKEDATE(aly.ano_letivo, 1))) >= s.idade_minima)
          AND (s.idade_maxima IS NULL OR TIMESTAMPDIFF(YEAR, a.data_nascimento, COALESCE(aly.data_inicio, MAKEDATE(aly.ano_letivo, 1))) <= s.idade_maxima)
          AND NOT EXISTS (SELECT 1 FROM turma_alunos ta JOIN turmas outra ON outra.id = ta.id_turma WHERE ta.id_aluno = a.id AND ta.excluido = 0 AND outra.excluido < 1 AND outra.id_ano_letivo = t.id_ano_letivo)`,
      [idTurma, idAluno],
    );
    if (!candidatos.length)
      throw new Error("Aluno não é elegível para esta turma.");
    const [capacidade] = await connection.query(
      `SELECT sala.capacidade, (SELECT COUNT(*) FROM turma_alunos ta WHERE ta.id_turma = t.id AND ta.excluido = 0) AS ocupacao
         FROM turmas t LEFT JOIN params_salas sala ON sala.id = t.id_salas WHERE t.id = ? FOR UPDATE`,
      [idTurma],
    );
    if (
      capacidade[0]?.capacidade &&
      capacidade[0].ocupacao >= capacidade[0].capacidade
    )
      throw new Error("A capacidade da turma foi atingida.");
    await connection.query(
      `INSERT INTO turma_alunos (id_turma, id_aluno, excluido) VALUES (?, ?, 0)
       ON DUPLICATE KEY UPDATE excluido = 0, atualizado_em = CURRENT_TIMESTAMP`,
      [idTurma, idAluno],
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function vincularProfessor(idTurma, idProfessor) {
  const [result] = await db.query(
    `INSERT INTO turma_professores (id_turma, id_professor, excluido)
     SELECT ?, id, 0 FROM professores WHERE id = ? AND id_status = 1 AND excluido < 1
     ON DUPLICATE KEY UPDATE excluido = 0, atualizado_em = CURRENT_TIMESTAMP`,
    [idTurma, idProfessor],
  );
  if (!result.affectedRows)
    throw new Error("Professor não está ativo ou não foi encontrado.");
}

async function removerAluno(idTurma, idAluno) {
  await db.query(
    "UPDATE turma_alunos SET excluido = 1 WHERE id_turma = ? AND id_aluno = ?",
    [idTurma, idAluno],
  );
}

async function removerProfessor(idTurma, idProfessor) {
  await db.query(
    "UPDATE turma_professores SET excluido = 1 WHERE id_turma = ? AND id_professor = ?",
    [idTurma, idProfessor],
  );
}

module.exports = {
  getTurmaDetalhe,
  getAlunosDaTurma,
  getProfessoresDaTurma,
  getAlunosElegiveis,
  getProfessoresElegiveis,
  vincularAluno,
  vincularProfessor,
  removerAluno,
  removerProfessor,
};
