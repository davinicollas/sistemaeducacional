const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

// GET /TiposDocumentos - list with filters and pagination
router.get("/tiposDocumentos", async (req, res) => {
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
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;

        const [countRows] = await db.query(`SELECT COUNT(*) as cnt FROM params_tipos_documentos WHERE ${where}`, params);
        const totalItems = countRows[0]?.cnt || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const [rows] = await db.query(
            `SELECT * FROM params_tipos_documentos WHERE ${where} ORDER BY text LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );

      

        res.render("tiposDocumentos", {
            tiposDocumentos: rows,
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
        res.render("tiposDocumentos", { tiposDocumentos: [], filtros: {}, pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 }, erro: 'Erro ao carregar tipos de documentos' });
    }
});


router.post("/tiposDocumentos", async (req, res) => {
    try {
        const itens = req.body.itens || [];
        const deleteIds = req.body.deleteIds || [];

        // process deletions first
        if (Array.isArray(deleteIds) && deleteIds.length) {
            const ids = deleteIds.filter(Boolean).map(id => Number(id)).filter(Boolean);
            if (ids.length) {
                await db.query(`DELETE FROM params_tipos_documentos WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
            }
        }    
        // process inserts/updates
        for (const raw of itens) {
            const id = Number(raw.id) || null;
            const text = String(raw.text || '').trim();
           
            // Ignora linha completamente vazia

            console.log(id)

            if (!text) continue; // skip empty rows
            if (id) {
                await db.query(`UPDATE params_tipos_documentos SET text = ? WHERE id = ?`, [text, id]);
            } else {
                await db.query(`INSERT INTO params_tipos_documentos (text) VALUES (?)`, [text]);
            }
        }

        res.redirect('/tiposDocumentos');
    } catch (err) {
        console.error(err);
        res.redirect('/tiposDocumentos');
    }
});

module.exports = router;