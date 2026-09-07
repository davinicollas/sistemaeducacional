const db = require("../../database/mysql");
const model = require("../model/configuracao_notas");
const fields = [
  "tipo",
  "nota_minima",
  "nota_maxima",
  "recuperacao",
  "nota_recuperacao",
];
async function index(req, res) {
  try {
    res.render("configuracao_notas", {
      configuracao_notas: await model.getConfiguracaoNotas(),
    });
  } catch (e) {
    console.error(e);
    res.render("configuracao_notas", {
      configuracao_notas: null,
      erro: "Erro ao carregar configuração de notas",
    });
  }
}
async function save(req, res) {
  try {
    const current = await model.getConfiguracaoNotas();
    const values = fields.map((field) => req.body[field] || null);
    if (current?.id)
      await db.query(
        `UPDATE configuracao_notas SET ${fields.map((field) => `${field}=?`).join(",")} WHERE id=?`,
        [...values, current.id],
      );
    else
      await db.query(
        `INSERT INTO configuracao_notas (${fields.join(",")}) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE ${fields.map((field) => `${field}=VALUES(${field})`).join(",")}`,
        values,
      );
  } catch (e) {
    console.error(e);
  }
  res.redirect("/configuracao_notas");
}
module.exports = { index, save };
