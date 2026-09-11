const db = require("../../database/mysql");

const STATUS_VALIDOS = ["presente", "falta", "falta_justificada"];

async function getTurmasPorAnoLetivo(idAnoLetivo) {
  const [rows] = await db.query(
    `SELECT id, text, sigla FROM turmas
      WHERE excluido < 1 AND id_ano_letivo = ?
      ORDER BY text`,
    [idAnoLetivo],
  );
  return rows;
}

async function getDisciplinasAtivas() {
  const [rows] = await db.query(
    "SELECT id, text, sigla FROM params_disciplina WHERE excluido < 1 AND idStatus = 1 ORDER BY text",
  );
  return rows;
}

async function getAlunosDaTurma(idTurma) {
  const [rows] = await db.query(
    `SELECT a.id, a.nome, a.nome_social, a.matricula
       FROM turma_alunos ta
       JOIN alunos a ON a.id = ta.id_aluno
      WHERE ta.id_turma = ? AND ta.excluido = 0 AND a.excluido < 1
      ORDER BY a.nome`,
    [idTurma],
  );
  return rows;
}

async function alunoPertenceATurma(idAluno, idTurma) {
  const [rows] = await db.query(
    "SELECT 1 FROM turma_alunos WHERE id_turma = ? AND id_aluno = ? AND excluido = 0",
    [idTurma, idAluno],
  );
  return rows.length > 0;
}

async function turmaExiste(idTurma) {
  const [rows] = await db.query(
    "SELECT id FROM turmas WHERE id = ? AND excluido < 1",
    [idTurma],
  );
  return rows.length > 0;
}

async function disciplinaExiste(idDisciplina) {
  if (!idDisciplina) return true;
  const [rows] = await db.query(
    "SELECT id FROM params_disciplina WHERE id = ? AND excluido < 1",
    [idDisciplina],
  );
  return rows.length > 0;
}

async function getFrequenciaRegistro(idTurma, idDisciplina, data) {
  const [rows] = await db.query(
    `SELECT id, id_aluno, status, observacao, atualizado_em
       FROM frequencias
      WHERE id_turma = ? AND data = ?
        AND (id_disciplina <=> ?)`,
    [idTurma, data, idDisciplina || null],
  );
  const mapa = {};
  rows.forEach((row) => {
    mapa[row.id_aluno] = row;
  });
  return mapa;
}

async function getHistorico(idFrequencia) {
  const [rows] = await db.query(
    `SELECT h.id, h.status_anterior, h.status_novo, h.motivo, h.criado_em,
            u.nome AS usuario_nome
       FROM frequencias_historico h
       LEFT JOIN usuarios u ON u.id = h.id_usuario
      WHERE h.id_frequencia = ?
      ORDER BY h.criado_em DESC`,
    [idFrequencia],
  );
  return rows;
}

/**
 * Salva/atualiza a frequência de uma turma em uma data, registrando histórico
 * de auditoria quando o status de um lançamento já existente é alterado.
 */
async function salvarFrequencias({
  idTurma,
  idDisciplina,
  data,
  idUsuario,
  registros,
}) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    for (const registro of registros) {
      const { idAluno, status, observacao, motivo } = registro;

      const [existentes] = await connection.query(
        `SELECT id, status, observacao FROM frequencias
          WHERE id_aluno = ? AND id_turma = ? AND data = ? AND (id_disciplina <=> ?)
          FOR UPDATE`,
        [idAluno, idTurma, data, idDisciplina || null],
      );
      const existente = existentes[0];

      if (!existente) {
        await connection.query(
          `INSERT INTO frequencias (id_aluno, id_turma, id_disciplina, data, status, observacao)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            idAluno,
            idTurma,
            idDisciplina || null,
            data,
            status,
            observacao || null,
          ],
        );
        continue;
      }

      const statusAlterado = existente.status !== status;
      if (statusAlterado) {
        const motivoLimpo = String(motivo || "").trim();
        if (!motivoLimpo) {
          const erro = new Error(
            "É necessário informar o motivo da alteração de frequência.",
          );
          erro.codigo = "MOTIVO_OBRIGATORIO";
          erro.idAluno = idAluno;
          throw erro;
        }
        await connection.query(
          `INSERT INTO frequencias_historico
             (id_frequencia, id_aluno, id_turma, id_disciplina, data, status_anterior, status_novo, motivo, id_usuario)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            existente.id,
            idAluno,
            idTurma,
            idDisciplina || null,
            data,
            existente.status,
            status,
            motivoLimpo,
            idUsuario || null,
          ],
        );
      }

      await connection.query(
        "UPDATE frequencias SET status = ?, observacao = ? WHERE id = ?",
        [status, observacao || null, existente.id],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  STATUS_VALIDOS,
  getTurmasPorAnoLetivo,
  getDisciplinasAtivas,
  getAlunosDaTurma,
  alunoPertenceATurma,
  turmaExiste,
  disciplinaExiste,
  getFrequenciaRegistro,
  getHistorico,
  salvarFrequencias,
};
