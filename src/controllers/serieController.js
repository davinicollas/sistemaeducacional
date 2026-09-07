const db = require("../../database/mysql");
const seriesModel = require("../model/series");
const turnosModel = require("../model/turnos");
const { upload } = require("../utils/excel");
const ExcelJS = require("exceljs");
async function index(req, res) {
  try {
    res.render("series", {
      series: { series: await seriesModel.getSeries() },
      turnos: await turnosModel.getTurnos(),
    });
  } catch (error) {
    console.error(error);
    res.render("series", {
      series: { series: [] },
      turnos: [],
      erro: "Erro ao carregar séries",
    });
  }
}
async function remove(req, res) {
  try {
    await db.query("UPDATE params_series SET excluido = 1 WHERE id = ?", [
      req.params.id,
    ]);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/series");
}
async function save(req, res) {
  try {
    const raw = req.body.series || {};
    const fields = [
      "nome",
      "abreviacao",
      "etapa_ensino",
      "nivel_ensino",
      "ano_serie",
      "codigo",
      "idTurnos",
      "idade_minima",
      "idade_maxima",
      "carga_horaria",
      "aulas_semanais",
      "status",
      "descricao",
    ];
    for (const item of Array.isArray(raw) ? raw : Object.values(raw)) {
      const nome = String(item?.nome || "").trim();
      if (!nome) continue;
      const values = [
        nome,
        String(item.abreviacao || "").trim(),
        String(item.etapa_ensino || "").trim(),
        String(item.nivel_ensino || "").trim(),
        item.ano_serie ? Number(item.ano_serie) : null,
        String(item.codigo || "").trim(),
        item.idTurnos || null,
        item.idade_minima ? Number(item.idade_minima) : null,
        item.idade_maxima ? Number(item.idade_maxima) : null,
        item.carga_horaria ? Number(item.carga_horaria) : null,
        item.aulas_semanais ? Number(item.aulas_semanais) : null,
        item.status === "0" ? 0 : 1,
        String(item.descricao || "").trim(),
      ];
      if (item.id)
        await db.query(
          `UPDATE params_series SET ${fields.map((field) => `${field} = ?`).join(", ")} WHERE id = ?`,
          [...values, item.id],
        );
      else
        await db.query(
          `INSERT INTO params_series (${fields.join(", ")}) VALUES (${fields.map(() => "?").join(", ")})`,
          values,
        );
    }
  } catch (error) {
    console.error(error);
  }
  res.redirect("/series");
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
        await db.query(
          "INSERT INTO params_series (nome, abreviacao) VALUES (?, ?)",
          [nome, row.getCell(2).value || ""],
        );
        importados++;
      }
    }
    res.json({ sucesso: true, importados });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro ao importar séries." });
  }
}

module.exports = { index, remove, save, importExcel, upload };
