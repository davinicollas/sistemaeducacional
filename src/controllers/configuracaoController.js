const db = require("../../database/mysql");
const configuracoes = require("../model/configuracoes");
const estados = require("../model/estados");
async function index(req, res) {
  try {
    res.render("configuracoes", {
      conf: await configuracoes.getConfig(),
      estado: await estados.getEstados(),
    });
  } catch (e) {
    console.error(e);
    res.render("configuracoes", {
      conf: null,
      estado: [],
      erro: "Erro ao carregar configurações",
    });
  }
}
async function save(req, res) {
  const fields = [
    "nome",
    "nome_fantasia",
    "cnpj",
    "logo",
    "telefone",
    "whatsapp",
    "email",
    "site",
    "ano_letivo_atual",
    "horario_funcionamento",
    "fuso_horario",
    "moeda",
    "cep",
    "rua",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "idEstado",
    "data_inicio",
    "data_fim",
  ];
  try {
    const values = fields.map((field) => req.body[field] || null);
    await db.query(
      `INSERT INTO configuracoes (${fields.join(",")}) VALUES (${fields.map(() => "?").join(",")}) ON DUPLICATE KEY UPDATE ${fields.map((field) => `${field}=VALUES(${field})`).join(",")}`,
      values,
    );
  } catch (e) {
    console.error(e);
  }
  res.redirect("/configuracoes");
}
module.exports = { index, save };
