const db = require("../../database/mysql");
async function index(req, res) {
  try {
    const filtros = { busca: req.query.busca || "" };
    const params = filtros.busca ? [`%${filtros.busca}%`] : [];
    const where = filtros.busca ? "1=1 AND text LIKE ?" : "1=1";
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = Math.max(1, parseInt(req.query.pageSize, 10) || 10);
    const [[count]] = await db.query(
      `SELECT COUNT(*) cnt FROM params_formacao WHERE ${where}`,
      params,
    );
    const [rows] = await db.query(
      `SELECT * FROM params_formacao WHERE ${where} ORDER BY text LIMIT ? OFFSET ?`,
      [...params, pageSize, (page - 1) * pageSize],
    );
    res.render("formacoes", {
      formacoes: rows,
      filtros,
      pagination: {
        page,
        pageSize,
        totalItems: count?.cnt || 0,
        totalPages: Math.max(1, Math.ceil((count?.cnt || 0) / pageSize)),
      },
    });
  } catch (e) {
    console.error(e);
    res.render("formacoes", {
      formacoes: [],
      filtros: {},
      pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
      erro: "Erro ao carregar formações",
    });
  }
}
async function save(req, res) {
  try {
    for (const item of Array.isArray(req.body.itens)
      ? req.body.itens
      : Object.values(req.body.itens || {})) {
      const text = String(item?.text || "").trim();
      if (!text) continue;
      if (item.id)
        await db.query("UPDATE params_formacao SET text=? WHERE id=?", [
          text,
          item.id,
        ]);
      else
        await db.query("INSERT INTO params_formacao (text) VALUES (?)", [text]);
    }
  } catch (e) {
    console.error(e);
  }
  res.redirect("/formacoes");
}
module.exports = { index, save };
