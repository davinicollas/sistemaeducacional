const db = require("../../database/mysql");
const { exportarExcel, upload } = require("../utils/excel");
const ExcelJS = require("exceljs");
const seriesModel = require("../model/series");
const turmasModel = require("../model/turmas");
const anoLetivoModel = require("../model/anosLetivos");
const salasModel = require("../model/salas");
const turnosModel = require("../model/turnos");

async function index(req, res) {
  try {
    const filtros = { busca: req.query.busca || "" };
    const where = filtros.busca
      ? "1=1 AND (t.text LIKE ? OR t.sigla LIKE ?)"
      : "1=1";
    const params = filtros.busca
      ? [`%${filtros.busca}%`, `%${filtros.busca}%`]
      : [];
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const turmasList = await turmasModel.getTurmas(
      where,
      params,
      pageSize,
      (page - 1) * pageSize,
    );
    const totalItems = await turmasModel.getTotalTurmas(where, params);
    const [series, anoLetivo, salas, turnos] = await Promise.all([
      seriesModel.getSeries(),
      anoLetivoModel.getAnosLetivos(),
      salasModel.getSalas(),
      turnosModel.getTurnos(),
    ]);
    res.render("turmas", {
      turmas: { turmas: turmasList },
      series,
      anoLetivo,
      salas,
      turnos,
      filtros,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      },
    });
  } catch (error) {
    console.error(error);
    res.render("turmas", {
      turmas: { turmas: [] },
      series: [],
      anoLetivo: [],
      salas: [],
      turnos: [],
      filtros: {},
      pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
      erro: "Erro ao carregar turmas",
    });
  }
}

async function remove(req, res) {
  try {
    await db.query("UPDATE turmas SET excluido = 1 WHERE id = ?", [
      req.params.id,
    ]);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/turmas");
}

async function save(req, res) {
  try {
    const raw = req.body.turmas || {};
    for (const item of Array.isArray(raw) ? raw : Object.values(raw)) {
      if (!item) continue;
      const text = (item.text || "").trim();
      if (!text) continue;
      const params = [
        text,
        (item.sigla || "").trim(),
        item.id_ano_letivo ?? null,
        item.id_serie ?? null,
        item.id_turno ?? null,
        item.id_salas ?? null,
        item.id_status ?? 1,
      ];
      if (item.id)
        await db.query(
          "UPDATE turmas SET text = ?, sigla = ?, id_ano_letivo = ?, id_serie = ?, id_turno = ?, id_salas = ?, id_status = ? WHERE id = ?",
          [...params, item.id],
        );
      else
        await db.query(
          "INSERT INTO turmas (text, sigla, id_ano_letivo, id_serie, id_turno, id_salas, id_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
          params,
        );
    }
  } catch (error) {
    console.error(error);
  }
  res.redirect("/turmas");
}

async function exportExcel(req, res) {
  try {
    const [turmas] = await db.query(
      "SELECT id, text, sigla, id_ano_letivo, id_serie, id_turno, id_salas, id_status FROM turmas ORDER BY text",
    );
    await exportarExcel({
      res,
      nomeArquivo: "turmas",
      nomePlanilha: "turmas",
      colunas: [
        { header: "ID", key: "id" },
        { header: "Text", key: "text" },
        { header: "Sigla", key: "sigla" },
        { header: "Ano Letivo", key: "id_ano_letivo" },
        { header: "Série", key: "id_serie" },
        { header: "Turno", key: "id_turno" },
        { header: "Sala", key: "id_salas" },
        { header: "Status", key: "id_status" },
      ],
      dados: turmas,
    });
  } catch (error) {
    console.error(error);
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
    const worksheet = workbook.worksheets[0];
    if (!worksheet)
      return res
        .status(400)
        .json({ sucesso: false, mensagem: "Arquivo Excel inválido." });
    let importados = 0;
    const inserts = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1 || !row.getCell(1).value) return;
      inserts.push([
        String(row.getCell(1).value).trim(),
        row.getCell(2).value ? String(row.getCell(2).value).trim() : null,
        row.getCell(3).value || null,
        row.getCell(4).value || null,
        row.getCell(5).value || null,
        row.getCell(6).value || null,
        row.getCell(12).value !== undefined ? Number(row.getCell(12).value) : 1,
      ]);
    });
    for (const params of inserts) {
      await db.query(
        "INSERT INTO turmas (text, sigla, id_ano_letivo, id_serie, id_turno, id_salas, id_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        params,
      );
      importados++;
    }
    res.json({ sucesso: true, mensagem: "Importação concluída.", importados });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        sucesso: false,
        mensagem: "Erro ao importar turmas.",
        erro: error.message,
      });
  }
}

module.exports = { index, remove, save, exportExcel, importExcel, upload };
