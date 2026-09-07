const db = require("../../database/mysql");

function createCatalogController({
  table,
  view,
  listKey,
  columns,
  searchColumns,
  mapItem,
  redirectPath,
}) {
  return {
    async index(req, res) {
      try {
        const filtros = { busca: req.query.busca || "" };
        const params = filtros.busca
          ? searchColumns.map(() => `%${filtros.busca}%`)
          : [];
        const where = filtros.busca
          ? `1=1 AND (${searchColumns.map((column) => `${column} LIKE ?`).join(" OR ")})`
          : "1=1";
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;
        const [[count]] = await db.query(
          `SELECT COUNT(*) AS cnt FROM ${table} WHERE ${where}`,
          params,
        );
        const [rows] = await db.query(
          `SELECT * FROM ${table} WHERE ${where} ORDER BY text LIMIT ? OFFSET ?`,
          [...params, pageSize, offset],
        );
        res.render(view, {
          [listKey]: rows,
          filtros,
          pagination: {
            page,
            pageSize,
            totalItems: count?.cnt || 0,
            totalPages: Math.max(1, Math.ceil((count?.cnt || 0) / pageSize)),
          },
        });
      } catch (error) {
        console.error(error);
        res.render(view, {
          [listKey]: [],
          filtros: {},
          pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
          erro: `Erro ao carregar ${view}`,
        });
      }
    },
    async save(req, res) {
      try {
        const ids = (
          Array.isArray(req.body.deleteIds)
            ? req.body.deleteIds
            : [req.body.deleteIds]
        )
          .filter(Boolean)
          .map(Number)
          .filter(Boolean);
        if (ids.length)
          await db.query(
            `DELETE FROM ${table} WHERE id IN (${ids.map(() => "?").join(",")})`,
            ids,
          );
        for (const raw of Array.isArray(req.body.itens) ? req.body.itens : []) {
          const item = mapItem(raw);
          if (!item) continue;
          const values = columns.map((column) => item[column]);
          if (item.id)
            await db.query(
              `UPDATE ${table} SET ${columns.map((column) => `${column} = ?`).join(", ")} WHERE id = ?`,
              [...values, item.id],
            );
          else
            await db.query(
              `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
              values,
            );
        }
      } catch (error) {
        console.error(error);
      }
      res.redirect(redirectPath);
    },
  };
}

module.exports = { createCatalogController };
