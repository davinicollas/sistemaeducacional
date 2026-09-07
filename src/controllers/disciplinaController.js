const db = require("../../database/mysql");
const disciplinasModel = require("../model/disciplinas");
async function index(req, res) {
  try {
    const filtros = { busca: req.query.busca || "" };
    const params = filtros.busca
      ? [`%${filtros.busca}%`, `%${filtros.busca}%`]
      : [];
    const where = filtros.busca
      ? "1=1 AND (text LIKE ? OR sigla LIKE ?)"
      : "1=1";
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const [rows] = await db.query(
      `SELECT COUNT(*) AS cnt FROM params_disciplina WHERE ${where}`,
      params,
    );
    const totalItems = rows[0]?.cnt || 0;
    const list = await disciplinasModel.getDisciplinas(
      where,
      params,
      pageSize,
      (page - 1) * pageSize,
    );
    res.render("disciplinas", {
      disciplinas: { disciplinas: list },
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
    res.render("disciplinas", {
      disciplinas: { disciplinas: [] },
      erro: "Erro ao carregar disciplinas",
    });
  }
}
async function remove(req, res) {
  try {
    await db.query("UPDATE params_disciplina SET excluido = 1 WHERE id = ?", [
      req.params.id,
    ]);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/disciplinas");
}
async function save(req, res) {
  try {
    const raw = req.body.disciplinas || {};
    for (const item of Array.isArray(raw) ? raw : Object.values(raw)) {
      const sigla = String(item?.sigla || "").trim();
      if (!sigla) continue;
      const params = [
        sigla,
        String(item.cargaHoraria || "").trim(),
        item.status === "0" ? 0 : 1,
        String(item.text || "").trim(),
        String(item.descricao || "").trim(),
      ];
      if (item.id)
        await db.query(
          "UPDATE params_disciplina SET sigla = ?, carga_horaria = ?, idStatus = ?, text = ?, descricao = ? WHERE id = ?",
          [...params, item.id],
        );
      else
        await db.query(
          "INSERT INTO params_disciplina (sigla, carga_horaria, idStatus, text, descricao) VALUES (?, ?, ?, ?, ?)",
          params,
        );
    }
  } catch (error) {
    console.error(error);
  }
  res.redirect("/disciplinas");
}
module.exports = { index, remove, save };
