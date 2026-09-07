const db = require("../../database/mysql");
const model = require("../model/notificacoes");
const fields = [
  "titulo",
  "tipo",
  "prioridade",
  "mensagem",
  "destinatarios",
  "data_inicio",
  "data_fim",
  "enviar_notificacao",
];
async function index(req, res) {
  try {
    res.render("notificacoes", { notificacoes: await model.getNotificacoes() });
  } catch (e) {
    console.error(e);
    res.render("notificacoes", {
      notificacoes: [],
      erro: "Erro ao carregar notificações",
    });
  }
}
async function save(req, res) {
  try {
    const values = fields.map((field) => req.body[field] || null);
    await db.query(
      `INSERT INTO notificacoes (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")}) ON DUPLICATE KEY UPDATE ${fields.map((field) => `${field}=VALUES(${field})`).join(",")}`,
      values,
    );
  } catch (e) {
    console.error(e);
  }
  res.redirect("/notificacoes");
}
module.exports = { index, save };
