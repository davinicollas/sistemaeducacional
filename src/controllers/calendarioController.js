const db = require("../../database/mysql");
const calendarioModel = require("../model/calendario");

async function index(req, res) {
  const hoje = new Date();
  const ano = parseInt(req.query.ano, 10) || hoje.getFullYear();
  const mes =
    req.query.mes !== undefined ? parseInt(req.query.mes, 10) : hoje.getMonth();
  try {
    const evento = await calendarioModel.getEventos(ano, mes);

    res.render("calendario", {
      evento: evento,
      filtros: { ano, mes },
    });
  } catch (error) {
    console.error(error);
    res.render("calendario", {
      evento: [],
      filtros: { ano, mes },
      erro: "Erro ao carregar calendário",
    });
  }
}
async function save(req, res) {
  try {
    const titulo = String(req.body.titulo || "").trim();
    if (!titulo) return res.redirect("/calendario");
    await db.query(
      "INSERT INTO eventos_calendario (titulo, tipo, data_inicio, data_fim, descricao) VALUES (?, ?, ?, ?, ?)",
      [
        titulo,
        String(req.body.tipo || "evento").trim(),
        req.body.data_inicio,
        req.body.data_fim || null,
        String(req.body.descricao || "").trim(),
      ],
    );
  } catch (error) {
    console.error(error);
  }
  res.redirect("/calendario");
}
async function remove(req, res) {
  try {
    await db.query("UPDATE eventos_calendario SET excluido = 1 WHERE id = ?", [
      req.params.id,
    ]);
  } catch (error) {
    console.error(error);
  }
  res.redirect("/calendario");
}
module.exports = { index, save, remove };
