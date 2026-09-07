const db = require("../../database/mysql");
const alunosModel = require("../model/alunos");
const estadoModel = require("../model/estados");
const tipoDocumentoModel = require("../model/tiposDocumentos");
const { exportarExcel, upload } = require("../utils/excel");
const ExcelJS = require("exceljs");
async function index(req, res) {
  try {
    const filtros = { busca: req.query.busca || "" };
    const params = filtros.busca
      ? [`%${filtros.busca}%`, `%${filtros.busca}%`]
      : [];
    const where = filtros.busca
      ? "1=1 AND (a.nome LIKE ? OR a.matricula LIKE ?)"
      : "1=1";
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const alunosList = await alunosModel.getAlunos(
      where,
      params,
      pageSize,
      (page - 1) * pageSize,
    );
    const estado = await estadoModel.getEstados();
    const tiposDocumentos = await tipoDocumentoModel.getTiposDocumentos();
    const statusAluno = await alunosModel.getStatusAluno(where, params);
    const estadoList = Array.isArray(estado) ? estado : estado ? [estado] : [];
    const tiposDocumentosCatalogo = Array.isArray(tiposDocumentos)
      ? tiposDocumentos
      : tiposDocumentos
        ? [tiposDocumentos]
        : [];
    const statusAlunoList = Array.isArray(statusAluno)
      ? statusAluno
      : statusAluno
        ? [statusAluno]
        : [];
    const pagination = {
      page,
      pageSize,
      totalItems: alunosList.length,
      totalPages: Math.max(1, Math.ceil(alunosList.length / pageSize)),
    };

    res.render("alunos", {
      alunosList,
      estadoList,
      tiposDocumentosCatalogo,
      statusAlunoList,
      filtros,
      pagination,
    });
  } catch (e) {
    console.error(e);
    res.render("alunos", {
      alunosList: [],
      estadoList: [],
      tiposDocumentosCatalogo: [],
      statusAlunoList: [],
      filtros: { busca: "" },
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1,
      },
      erro: "Erro ao carregar alunos",
    });
  }
}
async function remove(req, res) {
  try {
    await db.query("UPDATE alunos SET excluido=1 WHERE id=?", [req.params.id]);
  } catch (e) {
    console.error(e);
  }
  res.redirect("/alunos");
}
async function save(req, res) {
  try {
    for (const item of Object.values(req.body.alunos || {})) {
      if (!item?.nome?.trim()) continue;
      const fields = [
        "nome",
        "nome_social",
        "cpf",
        "rg",
        "matricula",
        "data_nascimento",
        "sexo",
        "nacionalidade",
        "naturalidade",
        "id_estado_nascimento",
        "foto",
        "id_tipo_documento",
        "numero_documento",
        "orgao_expedidor",
        "data_expedicao",
        "certidao_nascimento",
        "numero_certidao",
        "observacoes",
        "id_status",
      ];
      const values = fields.map((f) => item[f] || null);
      if (item.id)
        await db.query(
          `UPDATE alunos SET ${fields.map((f) => `${f}=?`).join(",")} WHERE id=?`,
          [...values, item.id],
        );
      else
        await db.query(
          `INSERT INTO alunos (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`,
          values,
        );
    }
  } catch (e) {
    console.error(e);
  }
  res.redirect("/alunos");
}
async function exportExcel(req, res) {
  try {
    const [data] = await db.query("SELECT * FROM alunos ORDER BY nome");
    await exportarExcel({
      res,
      nomeArquivo: "alunos",
      nomePlanilha: "Alunos",
      colunas: Object.keys(data[0] || {}).map((key) => ({ header: key, key })),
      dados: data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Erro ao gerar arquivo Excel" });
  }
}
async function importExcel(req, res) {
  try {
    if (!req.file)
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nenhum arquivo Excel foi enviado.",
      });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];
    let importados = 0;
    sheet.eachRow(async (row, n) => {
      if (n > 1 && row.getCell(1).value) {
        await db.query("INSERT INTO alunos (nome) VALUES (?)", [
          String(row.getCell(1).value).trim(),
        ]);
        importados++;
      }
    });
    res.json({ sucesso: true, importados });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao importar alunos." });
  }
}
module.exports = { index, remove, save, exportExcel, importExcel, upload };
