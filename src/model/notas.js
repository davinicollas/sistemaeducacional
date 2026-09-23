const db = require("../../database/mysql");

async function getTiposAvaliacao() {
  const [rows] = await db.query(
    "SELECT id, nome FROM params_tipos_avaliacao WHERE excluido < 1 ORDER BY nome",
  );
  return rows;
}

async function getDadosFiltros(
  idAnoLetivo,
  { professorId = null, alunoId = null } = {},
) {
  // re-use existing queries similar to frequencias model
  const frequenciasModel = require("./frequencias");

  let turmas;
  if (alunoId) {
    turmas = await frequenciasModel.getTurmasDoAlunoPorAno(
      idAnoLetivo,
      alunoId,
    );
  } else if (professorId) {
    turmas = (
      await db.query(
        `SELECT t.id, t.text, t.sigla FROM turmas t JOIN turma_professores tp ON tp.id_turma = t.id AND tp.excluido = 0 WHERE t.excluido < 1 AND t.id_ano_letivo = ? AND tp.id_professor = ? ORDER BY t.text`,
        [idAnoLetivo, professorId],
      )
    )[0];
  } else {
    turmas = (
      await db.query(
        `SELECT id, text, sigla FROM turmas WHERE excluido < 1 AND id_ano_letivo = ? ORDER BY text`,
        [idAnoLetivo],
      )
    )[0];
  }

  let disciplinas;
  if (alunoId) {
    disciplinas = await frequenciasModel.getDisciplinasParaAluno(alunoId);
  } else if (professorId) {
    disciplinas = (
      await db.query(
        `SELECT p.id, p.text FROM params_disciplina p JOIN professores pr ON pr.id_disciplina = p.id WHERE pr.id = ? AND p.excluido < 1 AND p.idStatus = 1 ORDER BY p.text`,
        [professorId],
      )
    )[0];
  } else {
    disciplinas = (
      await db.query(
        `SELECT id, text FROM params_disciplina WHERE excluido < 1 AND idStatus = 1 ORDER BY text`,
      )
    )[0];
  }

  return { turmas, disciplinas };
}

async function turmaExiste(idTurma) {
  const [rows] = await db.query(
    "SELECT id FROM turmas WHERE id = ? AND excluido < 1",
    [idTurma],
  );
  return rows.length > 0;
}

async function getAlunosDaTurma(idTurma) {
  const [rows] = await db.query(
    `SELECT a.id, a.nome, a.nome_social, a.matricula FROM turma_alunos ta JOIN alunos a ON a.id = ta.id_aluno WHERE ta.id_turma = ? AND ta.excluido = 0 AND a.excluido < 1 ORDER BY a.nome`,
    [idTurma],
  );
  return rows;
}

async function notaPertenceAoProfessor(idNota, idProfessor) {
  // verify that the note belongs to a turma/discipline of the professor
  const [rows] = await db.query(
    `SELECT n.id FROM notas n JOIN turmas t ON t.id = n.id_turma JOIN turma_professores tp ON tp.id_turma = t.id AND tp.id_professor = ? WHERE n.id = ? AND n.excluido = 0 LIMIT 1`,
    [idProfessor, idNota],
  );
  return rows.length > 0;
}

async function getNotasRegistro(idTurma, idDisciplina, idPeriodo) {
  const [rows] = await db.query(
    `SELECT n.id, n.id_aluno, n.id_tipo_avaliacao, n.valor, n.observacao, n.criado_em, n.atualizado_em FROM notas n WHERE n.id_turma = ? AND n.id_periodo = ? AND (n.id_disciplina IS NOT DISTINCT FROM ?)`,
    [idTurma, idPeriodo, idDisciplina || null],
  );
  const mapa = {};
  rows.forEach((r) => {
    if (!mapa[r.id_aluno]) mapa[r.id_aluno] = {};
    mapa[r.id_aluno][r.id_tipo_avaliacao] = r;
  });
  return mapa;
}

async function getHistorico(idNota) {
  const [rows] = await db.query(
    `SELECT h.id, h.valor_anterior, h.valor_novo, h.motivo, h.criado_em, u.nome AS usuario_nome FROM notas_historico h LEFT JOIN usuarios u ON u.id = h.id_usuario WHERE h.id_nota = ? ORDER BY h.criado_em DESC`,
    [idNota],
  );
  return rows;
}

async function salvarNotas(
  payload,
  { usuarioId = null, professorId = null, alunoId = null } = {},
) {
  // payload expected: { id_turma, id_disciplina, id_periodo, registros: [ { id_aluno, id_tipo_avaliacao, valor, observacao, motivo } ] }
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { id_turma, id_disciplina, id_periodo, registros } = payload;

    if (!(await turmaExiste(id_turma)))
      throw new Error("Turma não encontrada.");

    // Validate professor's access to turma/disciplina
    if (professorId) {
      const [rowsTp] = await db.query(
        `SELECT 1 FROM turma_professores WHERE id_turma = ? AND id_professor = ? AND excluido = 0 LIMIT 1`,
        [id_turma, professorId],
      );
      if (rowsTp.length === 0) throw new Error("Acesso negado à turma.");
      if (id_disciplina) {
        const [rowsPd] = await db.query(
          `SELECT 1 FROM professores WHERE id = ? AND id_disciplina = ? AND excluido < 1 LIMIT 1`,
          [professorId, id_disciplina],
        );
        if (rowsPd.length === 0) throw new Error("Acesso negado à disciplina.");
      }
    }

    // fetch alunos da turma
    const alunos = await getAlunosDaTurma(id_turma);
    const idsValidos = new Set(alunos.map((a) => a.id));

    for (const item of registros) {
      const idAluno = Number.parseInt(item.id_aluno, 10);
      const idTipo = Number.parseInt(item.id_tipo_avaliacao, 10);
      const valorRaw = item.valor;
      const valor =
        valorRaw === null || valorRaw === ""
          ? null
          : parseFloat(String(valorRaw).replace(",", "."));

      if (!idsValidos.has(idAluno))
        throw new Error("Aluno não pertence a esta turma.");

      // If user is ALUNO (no professorId and alunoId present), ensure they only write their own notes
      if (!professorId && alunoId) {
        if (Number(alunoId) !== Number(idAluno)) {
          throw new Error(
            "Aluno não autorizado a lançar notas de outro aluno.",
          );
        }
      }

      // validate scale (configuracao_notas)
      const [config] = await db.query(
        "SELECT nota_minima, nota_maxima FROM configuracao_notas WHERE excluido = 0 LIMIT 1",
      );
      const conf = config[0] || null;
      if (valor !== null && conf) {
        const min = conf.nota_minima != null ? Number(conf.nota_minima) : null;
        const max = conf.nota_maxima != null ? Number(conf.nota_maxima) : null;
        if (min != null && valor < min)
          throw new Error("Valor da nota abaixo do mínimo permitido.");
        if (max != null && valor > max)
          throw new Error("Valor da nota acima do máximo permitido.");
      }

      // check existing
      const [exist] = await connection.query(
        `SELECT id, valor FROM notas WHERE id_aluno = ? AND id_turma = ? AND id_periodo = ? AND id_tipo_avaliacao = ? AND (id_disciplina IS NOT DISTINCT FROM ?) FOR UPDATE`,
        [idAluno, id_turma, id_periodo, idTipo, id_disciplina || null],
      );
      const existente = exist[0];

      if (!existente) {
        await connection.query(
          `INSERT INTO notas (id_aluno, id_turma, id_disciplina, id_periodo, id_tipo_avaliacao, valor, observacao, id_usuario_criacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
          [
            idAluno,
            id_turma,
            id_disciplina || null,
            id_periodo,
            idTipo,
            valor,
            item.observacao || null,
            usuarioId || null,
          ],
        );
        continue;
      }

      const alterou =
        (existente.valor === null && valor !== null) ||
        (existente.valor !== null && String(existente.valor) !== String(valor));
      if (alterou) {
        const motivoLimpo = String(item.motivo || "").trim();
        if (!motivoLimpo) {
          const erro = new Error(
            "É necessário informar o motivo da alteração da nota.",
          );
          erro.codigo = "MOTIVO_OBRIGATORIO";
          erro.idAluno = idAluno;
          throw erro;
        }
        await connection.query(
          `INSERT INTO notas_historico (id_nota, id_aluno, id_turma, id_disciplina, id_periodo, id_tipo_avaliacao, valor_anterior, valor_novo, motivo, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
          [
            existente.id,
            idAluno,
            id_turma,
            id_disciplina || null,
            id_periodo,
            idTipo,
            existente.valor,
            valor,
            motivoLimpo,
            usuarioId || null,
          ],
        );
      }

      await connection.query(
        `UPDATE notas SET valor = ?, observacao = ?, atualizado_em = now(), id_usuario_atualizacao = ? WHERE id = ?`,
        [valor, item.observacao || null, usuarioId || null, existente.id],
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

async function atualizarNota(
  id,
  payload,
  { usuarioId = null, professorId = null } = {},
) {
  // verify existence and permissions
  const [rows] = await db.query(
    `SELECT id, id_aluno, id_turma, id_disciplina, id_periodo, id_tipo_avaliacao, valor FROM notas WHERE id = ? AND excluido = 0`,
    [id],
  );
  const nota = rows[0];
  if (!nota) throw new Error("Nota não encontrada.");

  if (professorId) {
    const [rowsTp] = await db.query(
      `SELECT 1 FROM turma_professores WHERE id_turma = ? AND id_professor = ? AND excluido = 0 LIMIT 1`,
      [nota.id_turma, professorId],
    );
    if (rowsTp.length === 0) throw new Error("Acesso negado à turma.");
  }

  // apply update via salvarNotas logic for single note
  return salvarNotas(
    {
      id_turma: nota.id_turma,
      id_disciplina: nota.id_disciplina,
      id_periodo: nota.id_periodo,
      registros: [
        {
          id_aluno: nota.id_aluno,
          id_tipo_avaliacao: nota.id_tipo_avaliacao,
          valor: payload.valor,
          observacao: payload.observacao,
          motivo: payload.motivo,
        },
      ],
    },
    { usuarioId, professorId },
  );
}

async function deletarNota(id, { usuarioId = null } = {}) {
  await db.query(
    `UPDATE notas SET excluido = 1, atualizado_em = now(), id_usuario_atualizacao = ? WHERE id = ?`,
    [usuarioId || null, id],
  );
}

module.exports = {
  getTiposAvaliacao,
  getDadosFiltros,
  turmaExiste,
  getAlunosDaTurma,
  notaPertenceAoProfessor,
  getNotasRegistro,
  getHistorico,
  salvarNotas,
  atualizarNota,
  deletarNota,
};
