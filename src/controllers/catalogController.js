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
        // Filtros
        const busca = req.query.busca || "";
        const filtros = { busca };

        // Pesquisa
        let where = "excluido < 1";
        let params = [];

        if (busca) {
          const conditions = searchColumns.map((column) => `${column} LIKE ?`);

          where = `excluido < 1 AND (${conditions.join(" OR ")})`;
          params = searchColumns.map(() => `%${busca}%`);
        }

        // Paginação
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;

        // Total de registros
        const [[count]] = await db.query(
          `SELECT COUNT(*) AS cnt
           FROM ${table}
           WHERE ${where}`,
          params,
        );

        const totalItems = count?.cnt || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

        // Registros
        const [rows] = await db.query(
          `SELECT *
           FROM ${table}
           WHERE ${where}
           ORDER BY text
           LIMIT ? OFFSET ?`,
          [...params, pageSize, offset],
        );

        // Renderização
        res.render(view, {
          [listKey]: rows,
          filtros,
          pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
          },
        });
      } catch (error) {
        console.error(error);

        res.render(view, {
          [listKey]: [],
          filtros: {},
          pagination: {
            page: 1,
            pageSize: 10,
            totalItems: 0,
            totalPages: 1,
          },
          erro: `Erro ao carregar ${view}`,
        });
      }
    },

    async save(req, res) {
      try {
        // Exclusao ocorre no endpoint proprio; este handler apenas salva dados.
        const itens = Array.isArray(req.body.itens)
          ? req.body.itens
          : Object.values(req.body.itens || {});

        for (const raw of itens) {
          const item = mapItem(raw);

          if (!item) {
            continue;
          }

          const values = columns.map((column) => item[column]);

          // Atualizar
          if (item.id) {
            const updates = columns.map((column) => `${column} = ?`).join(", ");

            await db.query(
              `UPDATE ${table}
               SET ${updates}
               WHERE id = ?`,
              [...values, item.id],
            );

            continue;
          }

          // Inserir
          const columnNames = columns.join(", ");
          const placeholders = columns.map(() => "?").join(", ");

          await db.query(
            `INSERT INTO ${table}
             (${columnNames})
             VALUES (${placeholders})`,
            values,
          );
        }
      } catch (error) {
        console.error(error);
      }

      res.redirect(redirectPath);
    },

    async remove(req, res) {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.redirect(redirectPath);
        await db.query(`UPDATE ${table} SET excluido = 1 WHERE id = ?`, [id]);
      } catch (error) {
        console.error(error);
      }
      res.redirect(redirectPath);
    },
  };
}

module.exports = { createCatalogController };
