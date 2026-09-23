const anosLetivoModel = require("../model/anosLetivos");
const notasModel = require("../model/notas");

function idInteiro(valor) {
  const id = Number.parseInt(valor, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function index(req, res) {
  try {
    const usuario = req.session.usuario || {};
    const professorId = usuario.id_professor || null;
    const alunoId = usuario.id_aluno || null;

    const periodosModel = require("../model/periodos");
    const configuracaoNotasModel = require("../model/configuracao_notas");

    const [anoLetivo, tiposAvaliacao, periodos, configuracaoNotas] =
      await Promise.all([
        anosLetivoModel.getAnosLetivos(),
        notasModel.getTiposAvaliacao(),
        periodosModel.getPeriodos(),
        configuracaoNotasModel.getConfiguracaoNotas(),
      ]);

    res.render("notas", {
      anoLetivo,
      tiposAvaliacao,
      periodos,
      configuracaoNotas,
      usuario,
    });
  } catch (error) {
    console.error(error);
    res.render("notas", {
      anoLetivo: [],
      tiposAvaliacao: [],
      periodos: [],
      configuracaoNotas: null,
      erro: "Erro ao carregar a página de notas.",
    });
  }
}

async function dados(req, res) {
  // returns turmas, disciplinas filtered by professor or aluno, similar to frequencia
  try {
    const usuario = req.session.usuario || {};
    const professorId = usuario.id_professor || null;
    const alunoId = usuario.id_aluno || null;

    const idAnoLetivo = idInteiro(req.query.id_ano_letivo);
    if (!idAnoLetivo)
      return res
        .status(400)
        .json({ sucesso: false, mensagem: "Ano letivo inválido." });

    const dados = await notasModel.getDadosFiltros(idAnoLetivo, {
      professorId,
      alunoId,
    });
    res.json({ sucesso: true, ...dados });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao carregar dados." });
  }
}

async function alunosPorTurma(req, res) {
  const idTurma = idInteiro(req.query.id_turma);
  if (!idTurma)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Turma inválida." });
  try {
    if (!(await notasModel.turmaExiste(idTurma)))
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Turma não encontrada." });

    const usuario = req.session.usuario || {};
    const professorId = usuario.id_professor || null;
    const alunoId = usuario.id_aluno || null;

    // If professor, verify vínculo
    if (professorId) {
      const frequenciasModel = require("../model/frequencias");
      if (
        !(await frequenciasModel.turmaPertenceAoProfessor(idTurma, professorId))
      )
        return res
          .status(403)
          .json({ sucesso: false, mensagem: "Acesso negado à turma." });
    }

    // If aluno, ensure turma contains aluno
    if (alunoId) {
      const frequenciasModel = require("../model/frequencias");
      if (!(await frequenciasModel.alunoPertenceATurma(alunoId, idTurma)))
        return res
          .status(403)
          .json({ sucesso: false, mensagem: "Acesso negado à turma." });
      const alunos = await notasModel.getAlunosDaTurma(idTurma);
      const somente = alunos.filter((a) => Number(a.id) === Number(alunoId));
      return res.json({ sucesso: true, alunos: somente });
    }

    const alunos = await notasModel.getAlunosDaTurma(idTurma);
    res.json({ sucesso: true, alunos });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao carregar alunos." });
  }
}

async function registro(req, res) {
  const idTurma = idInteiro(req.query.id_turma);
  const idDisciplina = req.query.id_disciplina
    ? idInteiro(req.query.id_disciplina)
    : null;
  const idPeriodo = idInteiro(req.query.id_periodo);

  if (!idTurma)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Turma inválida." });
  if (!idPeriodo)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Período inválido." });

  try {
    if (!(await notasModel.turmaExiste(idTurma)))
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Turma não encontrada." });

    const usuario = req.session.usuario || {};
    const professorId = usuario.id_professor || null;
    const alunoId = usuario.id_aluno || null;

    // If professor, verify vínculo
    if (professorId) {
      const frequenciasModel = require("../model/frequencias");
      if (
        !(await frequenciasModel.turmaPertenceAoProfessor(idTurma, professorId))
      )
        return res
          .status(403)
          .json({ sucesso: false, mensagem: "Acesso negado à turma." });
      if (
        idDisciplina &&
        !(await frequenciasModel.disciplinaPertenceAoProfessor(
          idDisciplina,
          professorId,
        ))
      )
        return res
          .status(403)
          .json({ sucesso: false, mensagem: "Acesso negado à disciplina." });
    }

    // If aluno, ensure turma contains aluno
    if (alunoId) {
      const frequenciasModel = require("../model/frequencias");
      if (!(await frequenciasModel.alunoPertenceATurma(alunoId, idTurma)))
        return res
          .status(403)
          .json({ sucesso: false, mensagem: "Acesso negado à turma." });
      // force filter to only this aluno when returning data
    }

    const [alunos, registrados] = await Promise.all([
      notasModel.getAlunosDaTurma(idTurma),
      notasModel.getNotasRegistro(idTurma, idDisciplina, idPeriodo),
    ]);

    const lista = alunos.map((aluno) => {
      const existente = registrados[aluno.id] || {};
      return {
        id_aluno: aluno.id,
        nome: aluno.nome_social || aluno.nome,
        matricula: aluno.matricula,
        notas: existente,
      };
    });

    // If aluno user, filter list to only that aluno
    const resultado = alunoId
      ? lista.filter((l) => Number(l.id_aluno) === Number(alunoId))
      : lista;

    res.json({ sucesso: true, alunos: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao carregar registro de notas.",
    });
  }
}

async function salvar(req, res) {
  try {
    const usuario = req.session.usuario || {};
    const professorId = usuario.id_professor || null;
    const alunoId = usuario.id_aluno || null;
    const payload = req.body;

    // Prevent students from submitting arbitrary aluno ids
    if (alunoId) {
      // If payload.registros includes other student ids, block early
      const registros = Array.isArray(payload.registros)
        ? payload.registros
        : [];
      for (const r of registros) {
        if (parseInt(r.id_aluno, 10) !== Number(alunoId)) {
          return res.status(403).json({
            sucesso: false,
            mensagem: "Aluno não autorizado a lançar notas de outro aluno.",
          });
        }
      }
    }

    const result = await notasModel.salvarNotas(payload, {
      usuarioId: usuario.id,
      professorId,
      alunoId,
    });
    res.json({ sucesso: true, mensagem: "Notas salvas com sucesso.", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      mensagem: error.message || "Erro ao salvar notas.",
    });
  }
}

async function atualizar(req, res) {
  const id = idInteiro(req.params.id);
  if (!id)
    return res.status(400).json({ sucesso: false, mensagem: "Nota inválida." });
  try {
    const usuario = req.session.usuario || {};
    const professorId = usuario.id_professor || null;
    const alunoId = usuario.id_aluno || null;
    const payload = req.body;
    const result = await notasModel.atualizarNota(id, payload, {
      usuarioId: usuario.id,
      professorId,
      alunoId,
    });
    res.json({ sucesso: true, mensagem: "Nota atualizada.", result });
  } catch (error) {
    if (error.codigo === "MOTIVO_OBRIGATORIO")
      return res.status(400).json({
        sucesso: false,
        mensagem: error.message,
        idAluno: error.idAluno,
      });
    console.error(error);
    res.status(500).json({
      sucesso: false,
      mensagem: error.message || "Erro ao atualizar nota.",
    });
  }
}

async function deletar(req, res) {
  const id = idInteiro(req.params.id);
  if (!id)
    return res.status(400).json({ sucesso: false, mensagem: "Nota inválida." });
  try {
    const usuario = req.session.usuario || {};
    await notasModel.deletarNota(id, { usuarioId: usuario.id });
    res.json({ sucesso: true, mensagem: "Nota excluída." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ sucesso: false, mensagem: "Erro ao excluir nota." });
  }
}

async function historico(req, res) {
  const idNota = idInteiro(req.params.id);
  if (!idNota)
    return res.status(400).json({ sucesso: false, mensagem: "Nota inválida." });
  try {
    const historicoLista = await notasModel.getHistorico(idNota);
    res.json({ sucesso: true, historico: historicoLista });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao carregar histórico." });
  }
}

module.exports = {
  index,
  dados,
  alunosPorTurma,
  registro,
  salvar,
  atualizar,
  deletar,
  historico,
};
