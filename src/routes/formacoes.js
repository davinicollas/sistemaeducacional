const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

// POST /TiposDocumentos - create or update
router.post("/formacoes", async (req, res) => {
    try {
        const raw = req.body.itens || {};
        console.log("Raw formacao data:", raw);
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const formacao = (item.text || '').trim();
            if (!formacao) continue;

            let text = String(item.text || '').trim();
            let id = item.id || null;
            
            // If marked as atual, unset others
            // If marked as atual, unset others
            // if (atual) {
            //     await db.query(`UPDATE params_formacao SET atual = 0`);
            // }


            if (id) {
                await db.query(
                    `UPDATE params_formacao SET text = ? WHERE id = ?`,
                    [text, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_formacao (text) VALUES (?)`,
                    [text]
                );
            }
        }

        res.redirect("/formacoes");
    } catch (err) {
        console.error(err);
        res.redirect("/formacoes");
    }
});

// GET /TiposDocumentos - list with filters and pagination
router.get("/formacoes", async (req, res) => {
    try {
        const filtros = {
            busca: req.query.busca || ""
        };

        let where = "1=1";
        const params = [];
        if (filtros.busca) {
            where += " AND text LIKE ?";
            params.push(`%${filtros.busca}%`);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = Math.max(1, parseInt(req.query.pageSize, 10) || 10);
        const offset = (page - 1) * pageSize;

        const [countRows] = await db.query(`SELECT COUNT(*) as cnt FROM params_formacao WHERE ${where}`, params);
        const totalItems = countRows[0]?.cnt || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

        const [rows] = await db.query(
            `SELECT * FROM params_formacao WHERE ${where} ORDER BY text LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );

        res.render("formacoes", {
            formacao: rows,
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
        res.render("formacoes", {
            formacao: [],
            filtros: {},
            pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
            erro: "Erro ao carregar formações"
        });
    }
});

module.exports = router;