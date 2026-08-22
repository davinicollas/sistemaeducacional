const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

// GET /StatusDocumentos - list with filters and pagination
router.get("/statusDocumentos", async (req, res) => {
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

        const [countRows] = await db.query(`SELECT COUNT(*) as cnt FROM params_status_documentos WHERE ${where}`, params);
        const totalItems = countRows[0]?.cnt || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const [rows] = await db.query(
            `SELECT * FROM params_status_documentos WHERE ${where} ORDER BY text LIMIT ? OFFSET ?`,
            [...params, pageSize, offset]
        );

      

        res.render("statusDocumentos", {
            statusDocumentos: rows,
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
        res.render("statusDocumentos", { statusDocumentos: [], filtros: {}, pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 }, erro: 'Erro ao carregar status de documentos' });
    }
});


router.post("/statusDocumentos", async (req, res) => {
    try {
        const itens = req.body.itens || [];
        const deleteIds = req.body.deleteIds || [];

        // process deletions first
        if (Array.isArray(deleteIds) && deleteIds.length) {
            const ids = deleteIds.filter(Boolean).map(id => Number(id)).filter(Boolean);
            if (ids.length) {
                await db.query(`DELETE FROM params_status_documentos WHERE id IN (${ids.map(() => '?').join(',')})`, ids);
            }
        }    
        // process inserts/updates
        for (const raw of itens) {
            const id = Number(raw.id) || null;
            let text = String(raw.text || '').trim();
            let cor = String(raw.cor || '').trim();

            // Normaliza texto: remove vírgulas iniciais/finais e espaços
            text = text.replace(/^,+|,+$/g, '').trim();

            // Ignora linha completamente vazia
            if (!text) continue;

            // Normaliza cor: se vier com múltiplas cores separadas por vírgula, pega a primeira
            if (cor.includes(',')) {
                cor = cor.split(',').map(s => s.trim()).filter(Boolean)[0] || cor;
            }

            // Valida formato hexadecimal de 6 dígitos, fallback para '#000000'
            const isValidHex = /^#([0-9a-fA-F]{6})$/.test(cor);
            const colorToSave = isValidHex ? cor : '#000000';

            if (id) {
                await db.query(`UPDATE params_status_documentos SET text = ?, cor = ? WHERE id = ?`, [text, colorToSave, id]);
            } else {
                await db.query(`INSERT INTO params_status_documentos (text, cor) VALUES (?, ?)`, [text, colorToSave]);
            }
        }

        res.redirect('/statusDocumentos');
    } catch (err) {
        console.error(err);
        res.redirect('/statusDocumentos');
    }
});

module.exports = router;