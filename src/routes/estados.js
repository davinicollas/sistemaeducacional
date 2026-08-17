const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

// GET /estados - list with filters and pagination
router.get("/estados", async (req, res) => {
    try {
        const filtros = {
          busca: req.query.busca || ""
        };

        let where = "1=1";
        const params = [];
        if (filtros.busca) {
            where += " AND (descricao LIKE ? OR uf LIKE ? )";
            params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;

        const [countRows] = await db.query(`SELECT COUNT(*) as cnt FROM params_estados WHERE ${where}`, params);
        const totalItems = countRows[0]?.cnt || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        console.log(totalItems, totalPages, page, pageSize);
        const [rows] = await db.query(
            `SELECT * FROM params_estados WHERE ${where} ORDER BY descricao LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );

      

        res.render("estados", {
            estados: rows,
            filtros,
            pagination: {
                page,
                pageSize,
                totalItems,
                totalPages
            }
        });
    } catch (err) {
        console.error(err);
        res.render("estados", { estados: [], filtros: {}, pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 }, erro: 'Erro ao carregar estados' });
    }
});


router.post("/estados", async (req, res) => {
    try {
        const itens = req.body.itens || [];
        const deleteIds = req.body.deleteIds || [];

        // process deletions first
        if (Array.isArray(deleteIds) && deleteIds.length) {
            const ids = deleteIds.filter(Boolean).map(id => Number(id)).filter(Boolean);
            if (ids.length) {
                await db.query(`DELETE FROM params_estados WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
            }
        }
        // process inserts/updates
        for (const raw of itens) {
            const id = raw.id || null;
            const descricao = (raw.descricao || '').trim();
            const uf = (raw.uf || '').trim();

            if (!descricao && !uf) continue; // skip empty rows
            console.log(raw);
            if (id) {
                await db.query(`UPDATE params_estados SET descricao = ?, uf = ? WHERE id = ?`, [descricao, uf, id]);
            } else {
                await db.query(`INSERT INTO params_estados (descricao, uf) VALUES (?, ?)`, [descricao, uf]);
            }
        }

        res.redirect('/estados');
    } catch (err) {
        console.error(err);
        res.redirect('/estados');
    }
});

module.exports = router;