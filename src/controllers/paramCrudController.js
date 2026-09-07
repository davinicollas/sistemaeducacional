const db = require("../../database/mysql");

function normalizeItems(raw) {
  const items = Array.isArray(raw) ? raw : Object.values(raw || {});
  return items.filter(Boolean);
}

function createParamController({
  model,
  listMethod,
  view,
  viewKey,
  requestKey,
  table,
  redirectPath,
  mapItem,
  buildParams,
  columns,
  getExtraData,
}) {
  return {
    async index(req, res) {
      try {
        const list = await model[listMethod]();
        const data = {
          [viewKey]: { [viewKey]: list },
          ...(getExtraData ? await getExtraData() : {}),
        };
        res.render(view, data[viewKey]);
      } catch (error) {
        console.error(error);
        const data = {
          [viewKey]: { [viewKey]: [] },
          ...(getExtraData ? await getExtraData(true) : {}),
          erro: `Erro ao carregar ${view}`,
        };
        res.render(view, data[viewKey]);
      }
    },

    async remove(req, res) {
      try {
        await db.query(`UPDATE ${table} SET excluido = 1 WHERE id = ?`, [
          req.params.id,
        ]);
      } catch (error) {
        console.error(error);
      }
      res.redirect(redirectPath);
    },

    async save(req, res) {
      try {
        for (const item of normalizeItems(req.body[requestKey])) {
          const mapped = mapItem(item);
          if (!mapped) continue;
          const params = buildParams(mapped);
          if (mapped.id) {
            await db.query(
              `UPDATE ${table} SET ${columns.map((column) => `${column} = ?`).join(", ")} WHERE id = ?`,
              [...params, mapped.id],
            );
          } else {
            await db.query(
              `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
              params,
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
      res.redirect(redirectPath);
    },
  };
}

module.exports = { createParamController };
