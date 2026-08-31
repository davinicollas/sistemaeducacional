const express = require("express");
const db = require("../../database/mysql");
const router = express.Router();

const disciplinasModel = require("../model/disciplinas");
router.get("/disciplinas", async (req, res) => {
    try {
        const filtros = {
          busca: req.query.busca || ""
        };

        let where = "1=1";
        const params = [];
        if (filtros.busca) {
            where += " AND (text LIKE ? OR uf LIKE ? )";
            params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;

        const [countRows] = await db.query(`SELECT COUNT(*) as cnt FROM params_estados WHERE ${where}`, params);
        const totalItems = countRows[0]?.cnt || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const list = await disciplinasModel.getDisciplinas(where, params, pageSize, offset);

        res.render("disciplinas", { 
            disciplinas: { disciplinas: list },
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
        res.render("disciplinas", { disciplinas: { disciplinas: [] }, erro: 'Erro ao carregar disciplinas' });
    }
});

router.post("/disciplinas/excluir/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await db.query(`UPDATE params_disciplina SET excluido = 1 WHERE id = ?`, [id]);
        res.redirect("/disciplinas");
    } catch (err) {
        console.error(err);
        res.redirect("/disciplinas");
    }
});

router.post("/disciplinas", async (req, res) => {
    try {
        const raw = req.body.disciplinas || {};
        const itens = Array.isArray(raw) ? raw : Object.values(raw);

        for (const item of itens) {
            if (!item) continue;

            const sigla = (item.sigla || '').trim();
            if (!sigla) continue;

            const id = item.id || null;
            const cargaHoraria = (item.cargaHoraria || '').trim();
            const status = item.status === '0' ? 0 : 1;
            const text = (item.text || '').trim();
            const descricao = (item.descricao || '').trim();

            const params = [sigla, cargaHoraria, status, text, descricao];

            if (id) {
                await db.query(
                    `UPDATE params_disciplina SET sigla = ?, carga_horaria = ?, idStatus = ?, text = ?, descricao = ? WHERE id = ?`,
                    [...params, id]
                );
            } else {
                await db.query(
                    `INSERT INTO params_disciplina (sigla, carga_horaria, idStatus, text, descricao) VALUES (?, ?, ?, ?, ?)`,
                    params
                );
            }
        }

        res.redirect("/disciplinas");
    } catch (err) {
        console.error(err);
        res.redirect("/disciplinas");
    }
});

module.exports = router;
