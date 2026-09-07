const db = require("../../database/mysql");
const model = require("../model/aparencia");
async function index(req, res) {
  try {
    const aparencia = await model.getAparencia();
    const aparenciaList = Array.isArray(aparencia)
      ? aparencia
      : aparencia
        ? [aparencia]
        : [];
    res.render("aparencia", { aparencia: aparenciaList });
  } catch (e) {
    console.error(e);
    res.render("aparencia", {
      aparencia: null,
      erro: "Erro ao carregar aparência",
    });
  }
}
async function save(req, res) {
  const fields = ["tema_sistema", "cor_principal", "menu_lateral"];
  try {
    const current = await model.getAparencia();
    const values = fields.map((field) => req.body[field] || null);
    if (current?.id)
      await db.query(
        `UPDATE sistema_aparencia SET ${fields.map((field) => `${field}=?`).join(",")} WHERE id=?`,
        [...values, current.id],
      );
    else
      await db.query(
        `INSERT INTO sistema_aparencia (${fields.join(",")}) VALUES (?,?,?) ON DUPLICATE KEY UPDATE ${fields.map((field) => `${field}=VALUES(${field})`).join(",")}`,
        values,
      );
  } catch (e) {
    console.error(e);
  }
  res.redirect("/aparencia");
}
module.exports = { index, save };
