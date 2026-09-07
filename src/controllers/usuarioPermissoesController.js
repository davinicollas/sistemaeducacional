const db = require("../../database/mysql");
const permissaoModel = require("../model/usuarioPermissoes");
async function renderPage(res, extra = {}) {
  const roles = await permissaoModel.getRoles();
  const permissions = await permissaoModel.getPermissions();
  const matrix = await permissaoModel.getMatrix();
  return res.render("usuariosPermissoes", {
    roles,
    permissions,
    matrix,
    ...extra,
  });
}
async function index(req, res) {
  try {
    return await renderPage(res);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao carregar permissões");
  }
}
async function save(req, res) {
  try {
    const matrix = {};
    for (const [role, perms] of Object.entries(req.body.matrix || {}))
      matrix[role] = Object.fromEntries(
        Object.keys(perms || {}).map((permission) => [
          permission,
          !!perms[permission],
        ]),
      );
    await permissaoModel.saveMatrix(matrix);
    res.redirect("/usuariosPermissoes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao salvar permissões");
  }
}
async function create(table, req, res, label) {
  const name = String(req.body.name || "").trim();
  if (!name) return renderPage(res, { erro: `Nome ${label} é obrigatório.` });
  try {
    const [exists] = await db.query(`SELECT id FROM ${table} WHERE name = ?`, [
      name,
    ]);
    if (exists.length)
      return renderPage(res, {
        erro: `${label[0].toUpperCase() + label.slice(1)} já existente.`,
      });
    await db.query(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
    res.redirect("/usuariosPermissoes");
  } catch (error) {
    console.error(error);
    return renderPage(res, { erro: `Erro ao criar ${label}.` });
  }
}
const createRole = (req, res) => create("roles", req, res, "papel");
const createPermission = (req, res) =>
  create("permissions", req, res, "permissão");
module.exports = { index, save, createRole, createPermission };
