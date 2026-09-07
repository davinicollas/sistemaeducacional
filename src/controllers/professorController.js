const db = require("../../database/mysql");
const model = require("../model/professores");
const estados = require("../model/estados");
const disciplinas = require("../model/disciplinas");
const formacoes = require("../model/formacoes");
const { exportarExcel, upload } = require("../utils/excel");
const ExcelJS = require("exceljs");
async function index(req, res) {
  try {
    const filtros = { busca: req.query.busca || "" };
    const params = filtros.busca
      ? [`%${filtros.busca}%`, `%${filtros.busca}%`]
      : [];
    const where = filtros.busca
      ? "1=1 AND (p.nome LIKE ? OR p.matricula LIKE ?)"
      : "1=1";
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const list = await model.getProfessores(
      where,
      params,
      pageSize,
      (page - 1) * pageSize,
    );
    res.render("professores", {
      professores: { professores: list },
      estado: await estados.getEstados(),
      disciplinasList: await disciplinas.getDisciplinas(),
      formacaoList: await formacoes.getFormacoes(),
      statusProfessor: await model.getStatusProfessor(where, params),
      filtros,
      pagination: {
        page,
        pageSize,
        totalItems: list.length,
        totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
      },
    });
  } catch (e) {
    console.error(e);
    res.render("professores", {
      professores: { professores: [] },
      estado: [],
      disciplinasList: [],
      formacaoList: [],
      erro: "Erro ao carregar professores",
    });
  }
}
async function remove(req, res) {
  try {
    await db.query("UPDATE professores SET excluido=1 WHERE id=?", [
      req.params.id,
    ]);
  } catch (e) {
    console.error(e);
  }
  res.redirect("/professores");
}
async function save(req, res) {
  try {
    const fields = [
      "nome",
      "nome_social",
      "cpf",
      "data_nascimento",
      "sexo",
      "id_disciplina",
      "carga_horaria",
      "id_status",
      "email",
      "telefone",
      "celular",
      "cep",
      "endereco",
      "numeros",
      "complemento",
      "bairro",
      "cidade",
      "id_estado",
      "matricula",
      "registro_profissional",
      "data_admissao",
      "idFormacao",
      "area_formacao",
      "observacoes",
    ];
    for (const item of Object.values(req.body.professores || {})) {
      if (!item?.nome?.trim()) continue;
      const values = fields.map((f) => item[f] || null);
      if (item.id)
        await db.query(
          `UPDATE professores SET ${fields.map((f) => `${f}=?`).join(",")} WHERE id=?`,
          [...values, item.id],
        );
      else
        await db.query(
          `INSERT INTO professores (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`,
          values,
        );
    }
  } catch (e) {
    console.error(e);
  }
  res.redirect("/professores");
}
async function exportExcel(req, res) {
  try {
    const [data] = await db.query("SELECT * FROM professores ORDER BY nome");
    await exportarExcel({
      res,
      nomeArquivo: "professores",
      nomePlanilha: "Professores",
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
      return res
        .status(400)
        .json({
          sucesso: false,
          mensagem: "Nenhum arquivo Excel foi enviado.",
        });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const sheet = workbook.worksheets[0];
    let importados = 0;
    for (const row of sheet.getRows(2, Math.max(sheet.rowCount - 1, 0)) || []) {
      const nome = String(row.getCell(1).value || "").trim();
      if (nome) {
        await db.query("INSERT INTO professores (nome) VALUES (?)", [nome]);
        importados++;
      }
    }
    res.json({ sucesso: true, importados });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao importar professores." });
  }
}

module.exports = { index, remove, save, exportExcel, importExcel, upload };
