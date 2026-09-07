const db = require("../../database/mysql");
const model = require("../model/documentos");
const tipos = require("../model/tiposDocumentos");
const status = require("../model/statusDocumentos");
const { upload } = require("../utils/excel");
async function index(req, res) {
  try {
    res.render("documentos", {
      documentos: await model.getDocumentos(),
      tiposDocumentos: await tipos.getTiposDocumentos(),
      statusDocumentos: await status.getStatusDocumentos(),
    });
  } catch (e) {
    console.error(e);
    res.render("documentos", {
      documentos: [],
      tiposDocumentos: [],
      statusDocumentos: [],
      erro: "Erro ao carregar documentos",
    });
  }
}
async function save(req, res) {
  try {
    const fields = [
      "nome",
      "idTipo",
      "descricao",
      "arquivo",
      "data_documento",
      "data_validade",
      "idStatus",
      "publico",
    ];
    const values = [
      String(req.body.nome || "").trim(),
      req.body.idTipo || null,
      String(req.body.descricao || "").trim(),
      req.file?.filename || null,
      req.body.data_documento || null,
      req.body.data_validade || null,
      req.body.idStatus || 1,
      req.body.publico || null,
    ];
    if (!values[0]) return res.redirect("/documentos");
    if (req.params.id)
      await db.query(
        `UPDATE documentos SET ${fields
          .filter((f) => f !== "arquivo")
          .map((f) => `${f}=?`)
          .join(",")}${req.file ? ", arquivo=?" : ""} WHERE id=?`,
        [
          ...values.filter((_, i) => i !== 3),
          ...(req.file ? [values[3]] : []),
          req.params.id,
        ],
      );
    else
      await db.query(
        `INSERT INTO documentos (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")})`,
        values,
      );
  } catch (e) {
    console.error(e);
  }
  res.redirect("/documentos");
}
async function remove(req, res) {
  try {
    await db.query("UPDATE documentos SET excluido=1 WHERE id=?", [
      req.params.id,
    ]);
  } catch (e) {
    console.error(e);
  }
  res.redirect("/documentos");
}
module.exports = { index, save, remove, upload };
