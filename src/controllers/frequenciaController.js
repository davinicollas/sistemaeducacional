const anoLetivoModel = require("../model/anosLetivos");
const frequenciasModel = require("../model/frequencias");

function idInteiro(valor) {
  const id = Number.parseInt(valor, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function dataValida(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor))
    return null;
  const data = new Date(`${valor}T00:00:00`);
  if (Number.isNaN(data.getTime())) return null;
  // Regra atual: não permite lançar frequência para datas futuras.
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (data.getTime() > hoje.getTime()) return null;
  return valor;
}

async function index(req, res) {
  try {
    const [anoLetivo, disciplinas] = await Promise.all([
      anoLetivoModel.getAnosLetivos(),
      frequenciasModel.getDisciplinasAtivas(),
    ]);
    res.render("frequencia", {
      anoLetivo,
      disciplinas,
      statusValidos: frequenciasModel.STATUS_VALIDOS,
    });
  } catch (error) {
    console.error(error);
    res.render("frequencia", {
      anoLetivo: [],
      disciplinas: [],
      statusValidos: frequenciasModel.STATUS_VALIDOS,
      erro: "Erro ao carregar a página de frequência.",
    });
  }
}

async function turmasPorAno(req, res) {
  const idAnoLetivo = idInteiro(req.query.id_ano_letivo);
  if (!idAnoLetivo)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Ano letivo inválido." });
  try {
    const turmas = await frequenciasModel.getTurmasPorAnoLetivo(idAnoLetivo);
    res.json({ sucesso: true, turmas });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao carregar turmas." });
  }
}

async function alunosPorTurma(req, res) {
  const idTurma = idInteiro(req.query.id_turma);
  if (!idTurma)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Turma inválida." });
  try {
    if (!(await frequenciasModel.turmaExiste(idTurma)))
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Turma não encontrada." });
    const alunos = await frequenciasModel.getAlunosDaTurma(idTurma);
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
  const data = dataValida(req.query.data);

  if (!idTurma)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Turma inválida." });
  if (req.query.id_disciplina && !idDisciplina)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Disciplina inválida." });
  if (!data)
    return res.status(400).json({
      sucesso: false,
      mensagem:
        "Data inválida ou futura. Não é possível lançar frequência para datas futuras.",
    });

  try {
    if (!(await frequenciasModel.turmaExiste(idTurma)))
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Turma não encontrada." });
    if (!(await frequenciasModel.disciplinaExiste(idDisciplina)))
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Disciplina não encontrada." });

    const [alunos, registrados] = await Promise.all([
      frequenciasModel.getAlunosDaTurma(idTurma),
      frequenciasModel.getFrequenciaRegistro(idTurma, idDisciplina, data),
    ]);

    const lista = alunos.map((aluno) => {
      const existente = registrados[aluno.id];
      return {
        id_aluno: aluno.id,
        nome: aluno.nome_social || aluno.nome,
        matricula: aluno.matricula,
        id_frequencia: existente?.id || null,
        status: existente?.status || "presente",
        observacao: existente?.observacao || "",
      };
    });

    res.json({ sucesso: true, alunos: lista });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao carregar frequência." });
  }
}

async function salvar(req, res) {
  const idTurma = idInteiro(req.body.id_turma);
  const idDisciplina = req.body.id_disciplina
    ? idInteiro(req.body.id_disciplina)
    : null;
  const data = dataValida(req.body.data);
  const registros = Array.isArray(req.body.registros) ? req.body.registros : [];

  if (!idTurma)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Turma inválida." });
  if (req.body.id_disciplina && !idDisciplina)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Disciplina inválida." });
  if (!data)
    return res.status(400).json({
      sucesso: false,
      mensagem:
        "Data inválida ou futura. Não é possível lançar frequência para datas futuras.",
    });
  if (!registros.length)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Nenhum aluno informado." });

  try {
    if (!(await frequenciasModel.turmaExiste(idTurma)))
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Turma não encontrada." });
    if (!(await frequenciasModel.disciplinaExiste(idDisciplina)))
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Disciplina não encontrada." });

    const alunosDaTurma = await frequenciasModel.getAlunosDaTurma(idTurma);
    const idsValidos = new Set(alunosDaTurma.map((aluno) => aluno.id));

    const registrosValidados = [];
    for (const item of registros) {
      const idAluno = idInteiro(item.id_aluno);
      if (!idAluno)
        return res
          .status(400)
          .json({ sucesso: false, mensagem: "Aluno inválido." });
      if (!idsValidos.has(idAluno))
        return res.status(400).json({
          sucesso: false,
          mensagem: "Aluno não pertence a esta turma.",
        });
      if (!frequenciasModel.STATUS_VALIDOS.includes(item.status))
        return res
          .status(400)
          .json({ sucesso: false, mensagem: "Situação inválida." });

      registrosValidados.push({
        idAluno,
        status: item.status,
        observacao: String(item.observacao || "")
          .trim()
          .slice(0, 500),
        motivo: String(item.motivo || "")
          .trim()
          .slice(0, 500),
      });
    }

    await frequenciasModel.salvarFrequencias({
      idTurma,
      idDisciplina,
      data,
      idUsuario: req.session.usuario?.id || null,
      registros: registrosValidados,
    });

    res.json({ sucesso: true, mensagem: "Frequência salva com sucesso." });
  } catch (error) {
    if (error.codigo === "MOTIVO_OBRIGATORIO") {
      return res.status(400).json({
        sucesso: false,
        mensagem: error.message,
        idAluno: error.idAluno,
      });
    }
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao salvar frequência." });
  }
}

async function historico(req, res) {
  const idFrequencia = idInteiro(req.params.id);
  if (!idFrequencia)
    return res
      .status(400)
      .json({ sucesso: false, mensagem: "Frequência inválida." });
  try {
    const historicoLista = await frequenciasModel.getHistorico(idFrequencia);
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
  turmasPorAno,
  alunosPorTurma,
  registro,
  salvar,
  historico,
};
